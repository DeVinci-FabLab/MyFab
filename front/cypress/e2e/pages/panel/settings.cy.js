/// <reference types="cypress" />
const path = require("path");

describe("Page panel/admin", () => {
  it("No cookie", () => {
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/settings",
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

  it("Change with good password", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/settings",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".actual-password-input").type("Good-password");
    cy.get(".new-password-input").type("New-password");
    cy.get(".confirm-new-password-input").type("New-password");
    cy.get(".validate-button").click();

    cy.contains("Votre mot de passe a été modifié !");
  });

  it("Change with wrong password", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/settings",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".actual-password-input").type("Wrong-password");
    cy.get(".new-password-input").type("New-password");
    cy.get(".confirm-new-password-input").type("New-password");
    cy.get(".validate-button").click();

    cy.contains("Votre mot de passe actuel est incorrect");
  });

  it("Change with different password", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/settings",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".actual-password-input").type("Good-password");
    cy.get(".new-password-input").type("New-password");
    cy.get(".confirm-new-password-input").type("New-different-password");
    cy.get(".validate-button").click();

    cy.contains("Vos mots de passes ne sont pas identiques");
  });
});
