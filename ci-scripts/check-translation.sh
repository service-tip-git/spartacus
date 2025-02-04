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

# Convert string to lowercase
to_lowercase() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

# Check if each folder and index file is listed in the translations file
for folder in $translation_folders; do
  lowercase_folder=$(to_lowercase "$folder")
  lowercase_export_statement=$(to_lowercase "export { $folder as cpqquoteTranslations${folder^} } from './$folder/index';")
  if ! grep -qi "$lowercase_export_statement" "$translations_file"; then
    echo "Export statement for folder $folder not found in $translations_file"
    # Add your logic here to update the translations.ts file if needed
  else
    echo "Export statement for folder $folder is already listed in $translations_file"
  fi
done