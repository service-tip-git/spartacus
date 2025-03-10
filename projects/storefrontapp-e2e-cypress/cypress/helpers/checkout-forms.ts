/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeepPartial } from './form';

export interface Address {
  line1: string;
  line2?: string;
  country: string;
  state?: string;
  postal: string;
  city: string;
}

export interface AddressData {
  firstName: string;
  lastName: string;
  phone: string;
  cellphone: string;
  address: Address;
}

export interface PaymentDetails {
  fullName: string;
  payment: {
    card: string;
    number: string;
    expires: {
      month: string;
      year: string;
    };
    cvv: string;
  };
}

export function fillShippingAddress(
  shippingAddress: Partial<AddressData>,
  submitForm: boolean = true
) {
  cy.wait(3000);
  cy.get('button.btn-primary').should('be.visible');
  cy.get('cx-address-form').within(() => {
    if (shippingAddress) {
      shippingAddress?.address?.country &&
        cy
          .get('.country-select[formcontrolname="isocode"]')
          .ngSelect(shippingAddress.address.country);
      cy.get('[formcontrolname="titleCode"]').ngSelect('Mr');
      shippingAddress?.firstName &&
        cy
          .get('[formcontrolname="firstName"]')
          .clear()
          .type(shippingAddress.firstName);

      shippingAddress?.lastName &&
        cy
          .get('[formcontrolname="lastName"]')
          .clear()
          .type(shippingAddress.lastName);
      shippingAddress?.address?.line1 &&
        cy
          .get('[formcontrolname="line1"]')
          .clear()
          .type(shippingAddress.address.line1);
      shippingAddress?.address?.line2 &&
        cy
          .get('[formcontrolname="line2"]')
          .clear()
          .type(shippingAddress.address.line2);
      shippingAddress?.address?.city &&
        cy
          .get('[formcontrolname="town"]')
          .clear()
          .type(shippingAddress.address.city);
      shippingAddress?.address?.state &&
        cy
          .get('.region-select[formcontrolname="isocode"]')
          .ngSelect(shippingAddress.address.state);
      shippingAddress?.address?.postal &&
        cy
          .get('[formcontrolname="postalCode"]')
          .clear()
          .type(shippingAddress.address.postal);
      shippingAddress?.phone &&
        cy.get('[formcontrolname="phone"]').clear().type(shippingAddress.phone);
    }
    if (submitForm) {
      cy.get('button.btn-primary').click();
    }
  });
}

export function fillBillingAddress(billingAddress: AddressData) {
  cy.get('.cx-payment-form-billing').within(() => {
    cy.get('input[type="checkbox"]').click();
    cy.get('[bindvalue="isocode"]').ngSelect(billingAddress.address.country);
    cy.get('[formcontrolname="firstName"]')
      .clear()
      .type(billingAddress.firstName);
    cy.get('[formcontrolname="lastName"]')
      .clear()
      .type(billingAddress.lastName);
    cy.get('[formcontrolname="line1"]')
      .clear()
      .type(billingAddress.address.line1);
    if (billingAddress.address.line2) {
      cy.get('[formcontrolname="line2"]')
        .clear()
        .type(billingAddress.address.line2);
    }
    cy.get('[formcontrolname="town"]')
      .clear()
      .type(billingAddress.address.city);
    if (billingAddress.address.state) {
      cy.get('[formcontrolname="isocodeShort"]').ngSelect(
        billingAddress.address.state
      );
    }
    cy.get('[formcontrolname="postalCode"]')
      .clear()
      .type(billingAddress.address.postal);
  });
}

export function fillPaymentDetails(
  paymentDetails: DeepPartial<PaymentDetails>,
  billingAddress?: AddressData,
  submitForm: boolean = true
) {
  cy.get('cx-payment-form').within(() => {
    if (paymentDetails) {
      paymentDetails?.payment?.card &&
        cy.get('[bindValue="code"]').ngSelect(paymentDetails.payment.card);
      paymentDetails?.fullName &&
        cy
          .get('[formcontrolname="accountHolderName"]')
          .clear()
          .type(paymentDetails.fullName);
      paymentDetails?.payment?.number &&
        cy
          .get('[formcontrolname="cardNumber"]')
          .clear()
          .type(paymentDetails.payment.number);
      paymentDetails?.payment?.expires?.month &&
        cy
          .get('[formcontrolname="expiryMonth"]')
          .ngSelect(paymentDetails.payment.expires.month);
      paymentDetails?.payment?.expires?.year &&
        cy
          .get('[formcontrolname="expiryYear"]')
          .ngSelect(paymentDetails.payment.expires.year);
      paymentDetails?.payment?.cvv &&
        cy
          .get('[formcontrolname="cvn"]')
          .clear()
          .type(paymentDetails.payment.cvv);
    }
    if (billingAddress) {
      fillBillingAddress(billingAddress);
    } else {
      cy.get('input.form-check-input').check();
    }

    if (submitForm) {
      /**
       * TODO: remove when we find out what happened to the delivery address not setting instantly like before.
       * It takes time for the delivery address to set.
       * Was reported in the ec-spartacus-release https://sap-cx.slack.com/archives/GLJ5MR1LL/p1586937731001500
       */
      cy.wait(3000);
      cy.get('button.btn.btn-block.btn-primary')
        .should('be.enabled')
        .contains('Continue')
        .click();
    }
  });
}
