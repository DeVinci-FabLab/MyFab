/// <reference types="cypress" />
const path = require("path");

describe("Page panel/tokenView", () => {
  it("No cookie", () => {
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/tokenView",
      {
        failOnStatusCode: false,
      },
    );

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/auth")
          .replace(/\\/g, "/"),
    );
  });

  it("Check page loading", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/tokenView",
      {
        failOnStatusCode: false,
      },
    );

    cy.contains("Token");
  });
});
