#!/bin/sh
# scripts/handle-translation-changes.sh

folder_path=$1
translations_file="$folder_path/translations.ts"

# Ensure the translations file exists
if [ ! -f "$translations_file" ]; then
  echo "Translations file not found: $translations_file"
  exit 1
fi

# Get the list of translation folders
translation_folders=$(find "$folder_path" -mindepth 1 -maxdepth 1 -type d -exec basename {} \;)

# Check if each folder and index file is listed in the translations file
for folder in $translation_folders; do
  statement="from './$folder/index';"
  if ! grep -q "$statement" "$translations_file"; then
    echo "Export statement for folder $folder not found in $translations_file"
    exit 1
  else
    echo "Export statement for folder $folder is already listed in $translations_file"
  fi

  # Check if each index.ts file contains the correct import statements for .json files
  index_file="$folder_path/$folder/index.ts"
  if [ ! -f "$index_file" ]; then
    echo "Index file not found: $index_file"
    exit 1
  fi

  json_files=$(find "$folder_path/$folder" -maxdepth 1 -type f -name "*.json" -exec basename {} \;)
  for json_file in $json_files; do
    json_statement="from './$json_file';"
    if ! grep -q "$json_statement" "$index_file"; then
      echo "Import statement for $json_file not found in $index_file"
      exit 1
    else
      echo "Import statement for $json_file is already listed in $index_file"
    fi
  done
done