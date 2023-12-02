/// <reference types="cypress" />

describe("Page 404", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/404", {
      failOnStatusCode: false,
    });
  });

  it("Go back to auth", () => {
    cy.get(".back-button").first().click();
    cy.get(".login-button", {
      timeout: 10000,
    }).should("be.visible");
    cy.location("href").should("eq", "http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth");
  });
});
