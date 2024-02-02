/// <reference types="cypress" />
const path = require("path");

describe("Page panel/newSuccess", () => {
  it("No cookie", () => {
    cy.visit(
      "http://localhost:3000/" +
        Cypress.env().BASE_PATH +
        "/panel/newSuccess/?id=1",
      {
        failOnStatusCode: false,
      }
    );

    cy.location("pathname").should(
      "eq",
      path.normalize(Cypress.env().BASE_PATH + "/auth").replace(/\\/g, "/")
    );
  });

  it("Set message to ticket", () => {
    cy.setCookie("jwt", "user");
    cy.visit(
      "http://localhost:3000/" +
        Cypress.env().BASE_PATH +
        "/panel/newSuccess/?id=1",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".file-button").click();
    cy.get(".comment-textarea").type(
      "Salut il est 10h pile quand j'écris ce message"
    );
    cy.get(".close-button").click();
    cy.contains("Le commentaire du fichier a été enregistré");
  });

  it("Validate ticket", () => {
    cy.setCookie("jwt", "user");
    cy.visit(
      "http://localhost:3000/" +
        Cypress.env().BASE_PATH +
        "/panel/newSuccess/?id=1",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".continue-button").click();

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1")
          .replace(/\\/g, "/")
    );
  });
});
