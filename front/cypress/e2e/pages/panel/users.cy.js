/// <reference types="cypress" />
const path = require("path");

describe("Page panel/admin", () => {
  it("No cookie", () => {
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/auth")
          .replace(/\\/g, "/")
    );
  });

  it("User is not allowed", () => {
    cy.setCookie("jwt", "user");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.contains("La page que vous recherchez actuellement n'existe pas");
  });

  it("Check page loading", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );
  });
});