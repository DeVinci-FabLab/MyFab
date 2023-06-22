/// <reference types="cypress" />

describe("Components tablesAdmin", () => {
  it("Test nav buttons", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin",
      {
        failOnStatusCode: false,
      }
    );

    cy.contains("Etudiant 1");
    cy.get(".next-page-button").click();
    cy.contains("Secondes");
    cy.get(".next-page-button").click();
    cy.contains("Secondes");
    cy.get(".prev-page-button").click();
    cy.contains("Etudiant 1");
    cy.get(".prev-page-button").click();
    cy.contains("Etudiant 1");
  });

  it("Open tickets", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".ticket-element").first().click();
    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1"
    );
  });
});
