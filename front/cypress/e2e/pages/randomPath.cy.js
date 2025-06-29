/// <reference types="cypress" />
const path = require("path");

describe("Page random", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/pageRandom",
      { failOnStatusCode: false },
    );
  });

  it("Go back to auth", () => {
    cy.get(".back-button").first().click();
    cy.get(".login-button", {
      timeout: 10000,
    }).should("be.visible");
    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/auth")
          .replace(/\\/g, "/"),
    );
  });
});
