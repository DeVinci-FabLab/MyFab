/// <reference types="cypress" />

describe("Page legals", () => {
  it("Load page", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/legals", {
      failOnStatusCode: false,
    });
  });
});
