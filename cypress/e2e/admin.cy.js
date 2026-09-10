describe('admin', () => {
  it('check', () => {
    cy.visit('http://localhost:5173/');

    cy.get('#email').type('Admin@gmail.com');
    cy.get('#password').type('123456');
    cy.get('button[type="submit"]').click();

    cy.get('.add-car').first().click();


    cy.get('#brand').type('Range Rover');
    cy.get('#model').type('Sport');
    cy.get('#year').type('2024');
    cy.get('#type').type('Luxury SUV');
    cy.get('#transmission').type('Automatic');
    cy.get('#fuel').type('Gasoline');
    cy.get('#seats').type('5');
    cy.get('#doors').type('4');
    cy.get('#pricePerDay').type('180');
    cy.get('#location').type('New York');
    cy.get('#mileage').type('5100');
    cy.get('#image').selectFile('cypress/fixtures/car.webp', {
        force: true});
    cy.get('#AddNewCarToList').click();
    cy.get('dialog.addCarDialog[open]').find('.close-dialog').click();
    cy.contains('.card h3', 'Range Rover Sport').should('exist');
    cy.contains('.card', 'Range Rover Sport').click({ force: true });
    cy.get('.edit-button').click();
    cy.get('.addCarDialog:visible').find('#doors').clear().type('5');
    cy.get('.addCarDialog:visible').find('#AddNewCarToList').click();
    cy.get('dialog.addCarDialog[open]').find('.close-dialog').click();
    cy.contains('.card', 'Range Rover Sport').click({ force: true });
    cy.get('.remove-button').click();
  })
})
