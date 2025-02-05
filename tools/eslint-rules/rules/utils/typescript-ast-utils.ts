/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as ts from 'typescript';

/**
 * Checks if a given node is an interface declaration with a specific name
 * @param node - The TypeScript node to check
 * @param interfaceName - The name of the interface to check for
 * @returns True if the node is an interface declaration with the specified name
 */
export function isInterfaceWithName(
  node: ts.Node,
  interfaceName: string
): boolean {
  if (!ts.isInterfaceDeclaration(node)) {
    return false;
  }
  return node.name.text === interfaceName;
}

/**
 * Checks if a modifier is an access modifier (public, private, protected)
 * @param modifier - The modifier to check
 * @returns True if the modifier is an access modifier
 */
export function isAccessModifier(modifier: ts.ModifierLike): boolean {
  const accessModifiers = [
    ts.SyntaxKind.PublicKeyword,
    ts.SyntaxKind.PrivateKeyword,
    ts.SyntaxKind.ProtectedKeyword,
  ];
  return accessModifiers.includes(modifier.kind);
}

/**
 * Checks if a given parameter is a class property parameter (has access modifier)
 * @param param - The parameter node to check
 * @param propertyName - The name of the property to check for
 * @returns True if the parameter is a class property with the specified name
 */
export function isClassPropertyParameter(
  param: ts.ParameterDeclaration,
  propertyName: string
): boolean {
  if (!ts.isParameter(param)) {
    return false;
  }

  if (!param.modifiers?.some(isAccessModifier)) {
    return false;
  }

  if (!ts.isIdentifier(param.name)) {
    return false;
  }

  return param.name.text === propertyName;
}

/**
 * Checks if a property declaration has an initializer or definite assignment assertion
 * @param member - The class member to check
 * @param propertyName - The name of the property to check for
 * @returns True if the property is initialized or has definite assignment
 */
export function hasPropertyInitialization(
  member: ts.ClassElement,
  propertyName: string
): boolean {
  if (!ts.isPropertyDeclaration(member)) {
    return false;
  }

  if (!ts.isIdentifier(member.name)) {
    return false;
  }

  if (member.name.text !== propertyName) {
    return false;
  }

  return !!(member.initializer || member.exclamationToken);
}

/**
 * Checks if a statement is a property assignment
 * @param stmt - The statement to check
 * @param propertyName - The name of the property to check for
 * @returns True if the statement assigns to the specified property
 */
export function isPropertyAssignment(
  stmt: ts.Statement,
  propertyName: string
): boolean {
  if (!ts.isExpressionStatement(stmt)) {
    return false;
  }

  const expr = stmt.expression;
  if (!ts.isBinaryExpression(expr)) {
    return false;
  }

  if (expr.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
    return false;
  }

  if (!ts.isPropertyAccessExpression(expr.left)) {
    return false;
  }

  if (!ts.isIdentifier(expr.left.name)) {
    return false;
  }

  return expr.left.name.text === propertyName;
}

/**
 * Checks if a type implements a specific interface directly or through inheritance
 * @param type - The TypeScript type to check
 * @param interfaceName - The name of the interface to check for
 * @param checker - TypeScript type checker instance
 * @returns True if the type implements the interface
 */
export function implementsInterface(
  type: ts.Type,
  interfaceName: string,
  checker: ts.TypeChecker
): boolean {
  if (!type.isClass()) {
    return false;
  }

  const symbol = type.getSymbol();
  if (!symbol) {
    return false;
  }

  // Check if the type directly implements interface through properties
  const interfaces = type
    .getProperties()
    .map((prop) => prop.declarations?.[0]?.parent)
    .filter((parent): parent is ts.Node => parent !== undefined);

  if (interfaces.some((iface) => isInterfaceWithName(iface, interfaceName))) {
    return true;
  }

  // Check if any interface in the heritage chain matches
  if (symbol.declarations?.[0]) {
    const declaration = symbol.declarations[0];
    if (ts.isClassDeclaration(declaration) && declaration.heritageClauses) {
      const implementsInterface = declaration.heritageClauses.some((clause) => {
        if (clause.token !== ts.SyntaxKind.ImplementsKeyword) {
          return false;
        }
        return clause.types.some((type) => {
          const typeSymbol = checker.getSymbolAtLocation(type.expression);
          return typeSymbol?.getName() === interfaceName;
        });
      });

      if (implementsInterface) {
        return true;
      }
    }
  }

  // Check base class recursively
  const baseTypes = type.getBaseTypes();
  if (!baseTypes) {
    return false;
  }

  return baseTypes.some((baseType) =>
    implementsInterface(baseType, interfaceName, checker)
  );
}

/**
 * Checks if a property is definitely initialized in the class or its parent classes
 * @param classType - The TypeScript type representing the class
 * @param propertyName - The name of the property to check
 * @returns True if the property is definitely initialized
 */
export function isPropertyInitialized(
  classType: ts.Type,
  propertyName: string
): boolean {
  const symbol = classType.getSymbol();
  if (!symbol?.declarations?.[0]) {
    // Check parent class if no declarations in current class
    const baseTypes = classType.getBaseTypes();
    if (!baseTypes) {
      return false;
    }
    return baseTypes.some((baseType) =>
      isPropertyInitialized(baseType, propertyName)
    );
  }

  const declaration = symbol.declarations[0];
  if (!ts.isClassDeclaration(declaration)) {
    return false;
  }

  // Check for property declaration with initializer
  if (
    declaration.members.some((member) =>
      hasPropertyInitialization(member, propertyName)
    )
  ) {
    return true;
  }

  // Check all constructors, including deprecated ones
  const constructors = declaration.members.filter(ts.isConstructorDeclaration);

  // Check each constructor
  for (const constructor of constructors) {
    // Check constructor parameters for parameter properties
    if (
      constructor.parameters.some((param) =>
        isClassPropertyParameter(param, propertyName)
      )
    ) {
      return true;
    }

    // Check constructor body for assignments
    if (
      constructor.body?.statements.some((stmt) =>
        isPropertyAssignment(stmt, propertyName)
      )
    ) {
      return true;
    }
  }

  // Check parent class
  const baseTypes = classType.getBaseTypes();
  if (!baseTypes) {
    return false;
  }

  return baseTypes.some((baseType) =>
    isPropertyInitialized(baseType, propertyName)
  );
}
