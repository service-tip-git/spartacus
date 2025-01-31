/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as asm from '../../../helpers/asm';
import { login } from '../../../helpers/auth-forms';
import * as checkout from '../../../helpers/checkout-flow';
import * as customerTicketing from '../../../helpers/customer-ticketing/customer-ticketing';
import { signOutUser } from '../../../helpers/login';
import { doPlaceOrder } from '../../../helpers/order-history';
import * as savedCart from '../../../helpers/saved-cart';
import * as sampleData from '../../../sample-data/saved-cart';

import { getSampleUser } from '../../../sample-data/checkout-flow';

import {
  emulateCustomerPrepare,
  getCurrentCartIdAndAddProducts,
  getCustomerId,
  getInactiveCartIdAndAddProducts,
} from '../../../helpers/asm';

const agentToken = {
  userName: 'asagent',
  pwd: 'pw4all',
};

context('Assisted Service Module', () => {
  describe('Customer Support Agent - Emulation&deeplink', () => {
    it('should emulate customer with deeplink before agent login (CXSPA-3113)', () => {
      const customer = getSampleUser();
      cy.log('--> Register new user');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customer);

      getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
        (customerId) => {
          cy.visit('/assisted-service/emulate?customerId=' + customerId);
          asm.agentLogin(agentToken.userName, agentToken.pwd);

          cy.log('--> Should has assignCart');
          cy.get('.cx-asm-assignCart').should('exist');
        }
      );
    });

    it('should emulate customer and navigate to order with deeplink before agent login (CXSPA-3263)', () => {
      const customer = getSampleUser();

      cy.log('--> Agent logging in with deeplink');
      cy.visit('/');

      cy.log('--> Register user');
      checkout.registerUser(false, customer);

      login(customer.email, customer.password);
      cy.get('cx-login .cx-login-greet').should('be.visible');

      doPlaceOrder().then((orderData: any) => {
        signOutUser();

        const orderId = orderData.body.code;

        getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
          (customerId) => {
            cy.visit(
              '/assisted-service/emulate?customerId=' +
                customerId +
                '&orderId=' +
                orderId
            );
            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            asm.agentLogin(agentToken.userName, agentToken.pwd);

            cy.log('--> Should has assignCart');
            cy.get('.cx-asm-assignCart').should('exist');

            cy.url().should('contain', 'order/' + orderId);
          }
        );
      });
    });

    it('should emulate customer and navigate to support ticket with deeplink before agent login (CXSPA-3263)', () => {
      const testTicketDetails = {
        subject: 'Testing',
        message: 'I am testing asm deep linking.',
        ticketCategory: {
          id: 'ENQUIRY',
          name: 'Complaint',
        },
      };

      const customer = getSampleUser();

      cy.log('--> Agent logging in with deeplink');
      cy.visit('/');

      cy.log('--> Register user');
      checkout.registerUser(false, customer);

      login(customer.email, customer.password);
      cy.get('cx-login .cx-login-greet').should('be.visible');

      customerTicketing.visitElectronicTicketListingPage();
      customerTicketing.createTicket(testTicketDetails);
      customerTicketing.verifyTicketListingTableContent();
      customerTicketing
        .getIdInRow(1)
        .invoke('text')
        .then((text) => {
          const ticketId = text.trim();
          signOutUser();

          getCustomerId(
            agentToken.userName,
            agentToken.pwd,
            customer.email
          ).then((customerId) => {
            cy.visit(
              '/assisted-service/emulate?customerId=' +
                customerId +
                '&ticketId=' +
                ticketId
            );
            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            asm.agentLogin(agentToken.userName, agentToken.pwd);

            cy.log('--> Should has assignCart');
            cy.get('.cx-asm-assignCart').should('exist');

            cy.url().should('contain', 'support-ticket/' + ticketId);
          });
        });
    });

    it('should emulate customer and navigate to saved cart with deeplink before agent login (CXSPA-3263)', () => {
      const customer = getSampleUser();

      cy.visit('/');

      cy.log('--> Register user');
      checkout.registerUser(false, customer);

      login(customer.email, customer.password);
      cy.get('cx-login .cx-login-greet').should('be.visible');

      savedCart.addProductToCart(sampleData.products[2], 2);
      cy.intercept('save?saveCartName=test1*');
      savedCart.saveActiveCart(false);

      cy.visit('my-account/saved-carts');

      cy.get('td.cx-saved-cart-list-cart-id').then((els) => {
        const savedCartId = els[0].innerText;

        signOutUser();

        cy.log('--> Agent logging in with deeplink');

        getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
          (customerId) => {
            cy.visit(
              '/assisted-service/emulate?customerId=' +
                customerId +
                '&cartId=' +
                savedCartId +
                '&cartType=saved'
            );

            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            asm.agentLogin(agentToken.userName, agentToken.pwd);

            cy.log('--> Should has assignCart');
            cy.get('.cx-asm-assignCart').should('exist');

            cy.url().should('contain', 'saved-cart/' + savedCartId);
          }
        );
      });
    });

    it('should emulate customer with deeplink after agent login (CXSPA-3113)', () => {
      const customer = getSampleUser();
      cy.log('--> Register new user');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customer);

      cy.visit('/?asm=true');
      asm.agentLogin(agentToken.userName, agentToken.pwd);
      // get customerId via token
      getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
        (customerId) => {
          cy.visit('/assisted-service/emulate?customerId=' + customerId);

          cy.log('--> Should has assignCart');
          cy.get('.cx-asm-assignCart').should('exist');
        }
      );
    });

    it('should switched emulated customer with deeplink when click switch customer after agent login (CXSPA-3380)', () => {
      const customerOld = getSampleUser();
      cy.log('--> Register new user1');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customerOld);

      const customerNew = getSampleUser();
      cy.log('--> Register new user2');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customerNew);

      cy.visit('/?asm=true');
      asm.agentLogin(agentToken.userName, agentToken.pwd);
      // get customerId via token
      getCustomerId(
        agentToken.userName,
        agentToken.pwd,
        customerOld.email
      ).then((customerOldId) => {
        cy.visit('/assisted-service/emulate?customerId=' + customerOldId);

        cy.log('--> Should has emulated old customer');
        cy.get('.cx-asm-customerInfo .cx-asm-name').should(
          'have.text',
          customerOld.fullName
        );
        cy.get('.cx-asm-customerInfo .cx-asm-uid').should(
          'have.text',
          customerOld.email
        );

        getCustomerId(
          agentToken.userName,
          agentToken.pwd,
          customerNew.email
        ).then((customerNewId) => {
          cy.visit('/assisted-service/emulate?customerId=' + customerNewId);

          cy.log('--> Switch emulated customer dialog should be exist');
          cy.get('cx-asm-switch-customer-dialog').should('exist');

          cy.log('--> Click switch button to switch to emulate new customer');
          cy.get('cx-asm-switch-customer-dialog .cx-dialog-footer .btn-primary')
            .should('exist')
            .click();

          cy.log('--> Should has emulated new customer');
          cy.get('.cx-asm-customerInfo .cx-asm-name').should(
            'have.text',
            customerNew.fullName
          );
          cy.get('.cx-asm-customerInfo .cx-asm-uid').should(
            'have.text',
            customerNew.email
          );
        });
      });
    });

    it('should not to switch emulated customer with deeplink when click cancel after agent login (CXSPA-3380)', () => {
      const customerA = getSampleUser();
      cy.log('--> Register new user1');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customerA);

      const customerB = getSampleUser();
      cy.log('--> Register new user2');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customerB);

      cy.visit('/?asm=true');
      asm.agentLogin(agentToken.userName, agentToken.pwd);
      // get customerId via token
      getCustomerId(agentToken.userName, agentToken.pwd, customerA.email).then(
        (customerId1) => {
          cy.visit('/assisted-service/emulate?customerId=' + customerId1);

          cy.log('--> Should has emulated customerA');
          cy.get('.cx-asm-customerInfo .cx-asm-name').should(
            'have.text',
            customerA.fullName
          );
          cy.get('.cx-asm-customerInfo .cx-asm-uid').should(
            'have.text',
            customerA.email
          );

          getCustomerId(
            agentToken.userName,
            agentToken.pwd,
            customerB.email
          ).then((customerId2) => {
            cy.visit('/assisted-service/emulate?customerId=' + customerId2);

            cy.log('--> Switch emulated customer dialog should be exist');
            cy.get('cx-asm-switch-customer-dialog').should('exist');

            cy.log('--> Click cancel button to not switch customer');
            cy.get(
              'cx-asm-switch-customer-dialog .cx-dialog-footer .btn-secondary'
            ).should('exist');
            cy.findByText(/Cancel/i).click();

            cy.log('--> Should still emulated customerA');
            cy.get('.cx-asm-customerInfo .cx-asm-name').should(
              'have.text',
              customerA.fullName
            );
            cy.get('.cx-asm-customerInfo .cx-asm-uid').should(
              'have.text',
              customerA.email
            );
          });
        }
      );
    });

    it('should diaplay global error with deeplink when the switched customerId not exist after agent login (CXSPA-3380)', () => {
      const customer = getSampleUser();
      cy.log('--> Register new user1');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customer);

      cy.visit('/?asm=true');
      asm.agentLogin(agentToken.userName, agentToken.pwd);
      // get customerId via token
      getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
        (customerId1) => {
          cy.visit('/assisted-service/emulate?customerId=' + customerId1);

          cy.log('--> Should has emulated customerA');
          cy.get('.cx-asm-customerInfo .cx-asm-name').should(
            'have.text',
            customer.fullName
          );
          cy.get('.cx-asm-customerInfo .cx-asm-uid').should(
            'have.text',
            customer.email
          );

          cy.visit('/assisted-service/emulate?customerId=notexist');
          cy.log('--> global error message should be display');
          cy.get('cx-global-message .alert-danger').should('be.visible');
        }
      );
    });

    it('should emulate customer and navigate to order with deeplink after agent login (CXSPA-3263)', () => {
      const customer = getSampleUser();

      cy.visit('/?asm=true');

      cy.log('--> Register user');
      checkout.registerUser(false, customer);

      login(customer.email, customer.password);
      cy.get('cx-login .cx-login-greet').should('be.visible');

      doPlaceOrder().then((orderData: any) => {
        signOutUser();

        const orderId = orderData.body.code;

        cy.log('--> login as agent');
        asm.agentLogin(agentToken.userName, agentToken.pwd);

        cy.log('--> Agent visting URL with deeplink');

        getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
          (customerId) => {
            cy.visit(
              '/assisted-service/emulate?customerId=' +
                customerId +
                '&orderId=' +
                orderId
            );
            cy.log('--> Should has assignCart');
            cy.get('.cx-asm-assignCart').should('exist');

            cy.get('cx-asm-main-ui').should('be.visible');
            cy.get('cx-asm-main-ui').should('exist');

            cy.url().should('contain', 'order/' + orderId);
          }
        );
      });
    });

    it('should emulate customer and navigate to support ticket with deeplink after agent login (CXSPA-3263)', () => {
      const testTicketDetails = {
        subject: 'Testing',
        message: 'I am testing asm deep linking.',
        ticketCategory: {
          id: 'ENQUIRY',
          name: 'Complaint',
        },
      };

      const customer = getSampleUser();

      cy.visit('/?asm=true');

      cy.log('--> Register user');
      checkout.registerUser(false, customer);

      login(customer.email, customer.password);
      cy.get('cx-login .cx-login-greet').should('be.visible');

      customerTicketing.visitElectronicTicketListingPage();
      customerTicketing.createTicket(testTicketDetails);
      customerTicketing.verifyTicketListingTableContent();
      customerTicketing
        .getIdInRow(1)
        .invoke('text')
        .then((text) => {
          const ticketId = text.trim();
          signOutUser();

          cy.log('--> login as agent');
          asm.agentLogin(agentToken.userName, agentToken.pwd);

          cy.log('--> Agent visting URL with deeplink');

          getCustomerId(
            agentToken.userName,
            agentToken.pwd,
            customer.email
          ).then((customerId) => {
            cy.visit(
              '/assisted-service/emulate?customerId=' +
                customerId +
                '&ticketId=' +
                ticketId
            );

            cy.log('--> Should has assignCart');
            cy.get('.cx-asm-assignCart').should('exist');

            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            cy.url().should('contain', 'support-ticket/' + ticketId);
          });
        });
    });

    it('should emulate customer and navigate to saved cart with deeplink after agent login (CXSPA-3263)', () => {
      const customer = getSampleUser();

      cy.visit('/?asm=true');

      cy.log('--> Register user');
      checkout.registerUser(false, customer);

      login(customer.email, customer.password);
      cy.get('cx-login .cx-login-greet').should('be.visible');

      savedCart.addProductToCart(sampleData.products[2], 2);
      cy.intercept('save?saveCartName=test1*');
      savedCart.saveActiveCart(false);

      cy.visit('my-account/saved-carts');

      cy.get('td.cx-saved-cart-list-cart-id').then((els) => {
        const savedCartId = els[0].innerText;

        signOutUser();

        asm.agentLogin(agentToken.userName, agentToken.pwd);

        cy.log('--> Agent logging in with deeplink');

        getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
          (customerId) => {
            cy.visit(
              '/assisted-service/emulate?customerId=' +
                customerId +
                '&cartId=' +
                savedCartId +
                '&cartType=saved'
            );

            cy.log('--> Should has assignCart');
            cy.get('.cx-asm-assignCart').should('exist');

            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            cy.url().should('contain', 'saved-cart/' + savedCartId);
          }
        );
      });
    });

    it('should emulate customer and navigate to active cart with deeplink after agent login (CXSPA-3507)', () => {
      const customer = emulateCustomerPrepare(
        agentToken.userName,
        agentToken.pwd
      );

      cy.log('--> Agent logging in with deeplink');
      getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
        (customerId) => {
          getCurrentCartIdAndAddProducts(
            customer.email,
            customer.password,
            '1934793',
            '2'
          ).then((activeCartId) => {
            cy.visit(
              `/assisted-service/emulate?customerId=${customerId}&cartId=${activeCartId}&cartType=active`
            );

            cy.log('--> set input should be active cart id');
            cy.get(
              'cx-customer-emulation input[formcontrolname="cartNumber"]'
            ).should('have.value', activeCartId);

            cy.log('--> the message strip should be display');
            cy.get('cx-asm-save-cart-dialog .cx-message-info button cx-icon')
              .should('exist')
              .click();

            cy.log('--> Should navigate to current cart page');
            cy.get('.cart-details-wrapper .cx-total').should(
              'have.text',
              `  Cart #${activeCartId} `
            );

            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            cy.url().should('contain', '/cart');
          });
        }
      );
    });

    it('should emulate customer and navigate to active cart with deeplink ticketId and active cartId after agent login (CXSPA-3507)', () => {
      const customer = emulateCustomerPrepare(
        agentToken.userName,
        agentToken.pwd
      );

      cy.log('--> Agent logging in with deeplink');
      getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
        (customerId) => {
          getCurrentCartIdAndAddProducts(
            customer.email,
            customer.password,
            '1934793',
            '2'
          ).then((activeCartId) => {
            cy.visit(
              `/assisted-service/emulate?customerId=${customerId}&ticketId=00000008&cartId=${activeCartId}&cartType=active`
            );

            cy.log('--> set input should be active cart id');
            cy.get(
              'cx-customer-emulation input[formcontrolname="cartNumber"]'
            ).should('have.value', activeCartId);

            cy.log('--> the message strip should be display');
            cy.get('cx-asm-save-cart-dialog .cx-message-info button cx-icon')
              .should('exist')
              .click();

            cy.log('--> Should navigate to current cart page');
            cy.get('.cart-details-wrapper .cx-total').should(
              'have.text',
              `  Cart #${activeCartId} `
            );

            cy.get('cx-asm-main-ui').should('exist');
            cy.get('cx-asm-main-ui').should('be.visible');

            cy.url().should('contain', '/cart');
          });
        }
      );
    });

    it('should not emulate customer if uid is invalid - end emulation session is expected (CXSPA-3113)', () => {
      const customer = getSampleUser();
      cy.log('--> Register new user');
      cy.visit('/?asm=true');
      checkout.registerUser(false, customer);

      cy.log('--> login as agent');
      cy.visit('/?asm=true');
      asm.agentLogin(agentToken.userName, agentToken.pwd);
      // get customerId via token
      getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
        (customerId) => {
          cy.visit(
            '/assisted-service/emulate?customerId=' + customerId + 'invalid end'
          );

          cy.log('--> Should not has assignCart');
          cy.get('.cx-asm-assignCart').should('not.exist');
        }
      );
    });

    it('should save inactive cart in deeplink after agent login (CXSPA-3278)', () => {
      let customer = emulateCustomerPrepare(
        agentToken.userName,
        agentToken.pwd
      );
      getInactiveCartIdAndAddProducts(
        customer.email,
        customer.password,
        '1934793',
        '2'
      ).then((inactiveCartId) => {
        // get customerId via token
        getCustomerId(agentToken.userName, agentToken.pwd, customer.email).then(
          (customerId) => {
            cy.visit(
              `/assisted-service/emulate?customerId=${customerId}&cartId=${inactiveCartId}&cartType=inactive`
            );

            cy.log(
              '--> Should has assign inactive cart to input and display alert info'
            );
            cy.get('.cx-asm-assignCart', { timeout: 15000 }).should('exist');
            cy.get('button[id=asm-save-inactive-cart-btn]').should('exist');
            cy.get(
              'cx-customer-emulation input[formcontrolname="cartNumber"]'
            ).should('have.value', inactiveCartId);
            cy.get('cx-asm-main-ui cx-message').should('exist');

            cy.log('--> Click save button the dialog shold display');
            cy.get('button[id=asm-save-inactive-cart-btn]').click();
            cy.get('cx-asm-save-cart-dialog').should('exist');
            cy.get('cx-asm-save-cart-dialog .cx-message-info button cx-icon')
              .should('exist')
              .click();
            cy.get('.cx-dialog-item.item-right-text').should(
              'have.text',
              ` ${inactiveCartId}  2  $199.70 `
            );
            cy.get('button[id=asm-save-cart-dialog-btn]')
              .should('be.enabled')
              .click();

            cy.log(
              '--> Click save button will navigate to the cart detail page'
            );

            cy.get('.cx-card-label').should('contain', inactiveCartId);
            cy.get('cx-saved-cart-details-action .btn-primary').should(
              'be.enabled'
            );
            cy.url().should('include', 'saved-cart');
            cy.url().should('include', inactiveCartId);
          }
        );
      });
    });

    it('should not save empty inactive cart in deeplink after agent login (CXSPA-3278)', () => {
      let customer = emulateCustomerPrepare(
        agentToken.userName,
        agentToken.pwd
      );
      getInactiveCartIdAndAddProducts(customer.email, customer.password).then(
        (inactiveCartId) => {
          cy.log('--> create inactive cart');
          // get customerId via token
          getCustomerId(
            agentToken.userName,
            agentToken.pwd,
            customer.email
          ).then((customerId) => {
            cy.visit(
              `/assisted-service/emulate?customerId=${customerId}&cartId=${inactiveCartId}&cartType=inactive`
            );

            cy.log(
              '--> Should has assign inactive cart to input and display alert info'
            );
            cy.get('.cx-asm-assignCart', { timeout: 15000 }).should('exist');
            cy.get('button[id=asm-save-inactive-cart-btn]').should('exist');
            cy.get(
              'cx-customer-emulation input[formcontrolname="cartNumber"]'
            ).should('have.value', inactiveCartId);
            cy.get('cx-asm-main-ui cx-message').should('exist');

            cy.log(
              '--> Click save button the dialog shold display, but the save button is disable'
            );
            cy.get('button[id=asm-save-inactive-cart-btn]').click();
            cy.get('cx-asm-save-cart-dialog').should('exist');
            cy.get('cx-asm-save-cart-dialog .cx-message-warning button cx-icon')
              .should('exist')
              .click();
            cy.get('.cx-dialog-item.item-right-text').should(
              'have.text',
              ` ${inactiveCartId}  0  $0.00 `
            );
            cy.get('button[id=asm-save-cart-dialog-btn]').should('be.disabled');
            cy.findByText(/Cancel/i).click();
          });
        }
      );
    });
  });
});
