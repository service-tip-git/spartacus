/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { user, getSampleUser, SampleUser } from '../sample-data/checkout-flow';
import { login, register } from './auth-forms';
import { waitForPage } from './checkout-flow';
import * as alerts from './global-message';

export const userGreetSelector = 'cx-login .cx-login-greet';
export const loginLinkSelector = 'cx-login [role="link"]';

export const defaultUser = {
  name: 'test-user-with-orders@sap.cx.com',
  password: 'pw4all',
};

/**
 * Use only if you already are on the `/login` page.
 * Redirects to `/register` page and registers the user.
 *
 * @param uniqueUser if true creates a unique user, otherwise the default sample user is used.
 * @returns Newly registered user
 */
export function registerUserFromLoginPage(uniqueUser?: boolean) {
  const registerPage = waitForPage('/login/register', 'getRegisterPage');
  cy.get('cx-page-layout > cx-page-slot > cx-login-register')
    .findByText('Register')
    .click();
  cy.wait(`@${registerPage}`).its('response.statusCode').should('eq', 200);

  const loginUser = uniqueUser ? getSampleUser() : user;
  register(loginUser);
  return loginUser;
}

/**
 * Use only if you are outside of `/login` page.
 * Redirects to `/login` page, then uses `registerUserFromLoginPage()` helper function.
 *
 * @param uniqueUser if true creates a unique user, otherwise the default sample user is used.
 * @returns Newly registered user
 */
export function registerUser(uniqueUser?: boolean) {
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.get(loginLinkSelector).click();
  cy.wait(`@${loginPage}`).its('response.statusCode').should('eq', 200);

  return registerUserFromLoginPage(uniqueUser);
}

export function signOutUser() {
  cy.selectUserMenuOption({
    option: 'Sign Out',
  });

  cy.get(userGreetSelector).should('not.exist');
}

export function loginUser() {
  login(user.email, user.password);
}

export function loginWithBadCredentialsFromLoginPage() {
  listenForTokenAuthenticationRequest();

  login(user.email, 'Password321');

  cy.wait('@tokenAuthentication').its('response.statusCode').should('eq', 400);

  cy.get(userGreetSelector).should('not.exist');

  alerts
    .getErrorAlert()
    .should('contain', 'Bad credentials. Please login again');
}

export function loginWithBadCredentials() {
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.get(loginLinkSelector).click();
  cy.wait(`@${loginPage}`).its('response.statusCode').should('eq', 200);

  loginWithBadCredentialsFromLoginPage();
}

export function loginAsDefaultUser() {
  const loginPage = waitForPage('/login', 'getLoginPage');
  cy.get(loginLinkSelector).click();
  cy.wait(`@${loginPage}`).its('response.statusCode').should('eq', 200);

  login(defaultUser.name, defaultUser.password);
}

export function listenForTokenRevocationRequest(): string {
  const aliasName = 'tokenRevocation';
  cy.intercept({
    method: 'POST',
    path: '/authorizationserver/oauth/revoke',
  }).as(aliasName);

  return `@${aliasName}`;
}

export function listenForTokenAuthenticationRequest(): string {
  const aliasName = 'tokenAuthentication';
  cy.intercept({
    method: 'POST',
    path: '/authorizationserver/oauth/token',
  }).as(aliasName);

  return `@${aliasName}`;
}

/**
 * If the singed-in was successful, the user should be redirected to the home page.
 * Thus, this method verifies whether the home page is displayed and
 * the name of the signed-in user is visible next to the mini cart.
 *
 * @param user - logged-in user.
 */
export function checkUserIsSignedIn(user: SampleUser) {
  const homePage = waitForPage('homepage', 'getHomePage');
  cy.wait(`@${homePage}`).its('response.statusCode').should('eq', 200);
  cy.get(userGreetSelector).should('exist');
  cy.get(userGreetSelector).should('contain', user.fullName);
}
