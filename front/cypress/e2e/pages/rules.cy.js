/// <reference types="cypress" />

describe("Page rules", () => {
  it("Load page", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/rules", {
      failOnStatusCode: false,
    });
  });
});
