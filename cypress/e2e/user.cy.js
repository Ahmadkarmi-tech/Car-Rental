describe('user', () => {
  it('check', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('Sign up').click();
    
    let email = 'ahmad55@gmail.com';
    cy.get('#firstName').type('ahmad');
    cy.get('#lastName').type('karmi');
    cy.get('#email').type(email);
    cy.get('#phoneNumber').type('0591234567');
    cy.get('#password').type('123456');
    cy.get('#confirmPassword').type('123456');
    cy.get('#dateOfBirth').type('2000-05-15');
    cy.get('#licenseNumber').type('DL12345678');

    cy.get('#login-btn').click();

    cy.contains('Login').click();
    cy.get('#email').type(email);
    cy.get('#password').type('123456');
    cy.get('button[type="submit"]').click();

    cy.contains('.card', 'Rented').click();
    cy.contains('.card', 'Available').click({ force: true });

    let carName;

    cy.get('[data-testid="selected-car-name"]')
    .invoke('text')
    .then((text) => {
        carName = text.trim();

        cy.log(carName);
        cy.wrap(carName).as('carName');
    });

    cy.get('.rent-button').click();
    cy.get('#FromDate').type('2026-09-10');
    cy.get('#ToDate').type('2026-09-11');
    cy.get('.RentButton').click();
    cy.contains('📋 History').click();
    cy.get('a[href="/History"]').click();

    cy.get('@carName').then((carName) => {
        cy.get('.history-table tbody tr')
            .last()
            .find('td')
            .eq(1)
            .should('have.text', carName);
    });

  })
})
