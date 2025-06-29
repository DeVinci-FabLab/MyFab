/// <reference types="cypress" />
const path = require("path");

describe("Page auth/index", () => {
  beforeEach(() => {
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth/register/",
      {
        failOnStatusCode: false,
      },
    );
  });

  it("Create user", () => {
    cy.get(".lastname").type("test");
    cy.get(".firstname").type("test");
    cy.get(".email").type("test@test.com");
    cy.get(".password1").type("test");
    cy.get(".password2").type("test");
    cy.get(".submit-button").click();

    cy.contains("Votre compte a été créé avec succès");
  });

  it("Correction of password", () => {
    cy.get(".lastname").type("test");
    cy.get(".firstname").type("test");
    cy.get(".email").type("test@test.com");
    cy.get(".password1").type("test");
    cy.get(".password2").type("wrongpassword");
    cy.get(".submit-button").click();
    cy.contains("Vos mots de passes ne correspondent pas");

    cy.get(".password1").type("{selectAll}test{enter}");
    cy.get(".password2").type("{selectAll}test{enter}");
    cy.contains("Votre compte a été créé avec succès");
  });
});
