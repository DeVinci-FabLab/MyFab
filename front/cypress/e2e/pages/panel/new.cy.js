/// <reference types="cypress" />
const path = require("path");
import "cypress-file-upload";

describe("Page panel/new", () => {
  it("No cookie", () => {
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/new",
      {
        failOnStatusCode: false,
      },
    );

    cy.location("pathname").should(
      "eq",
      path.normalize(Cypress.env().BASE_PATH + "/auth").replace(/\\/g, "/"),
    );
  });

  it("Create ticket", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/new",
      {
        failOnStatusCode: false,
      },
    );

    cy.get(".description-textarea").type(
      "Yo je suis Cody et je savais pas quoi écrire en description pour le test End to End, donc j'écris ce qu'il me passe par la tête en plus il est 00:30 tout pile donc je réfléchis pas trop.",
    );
    cy.get(".projectType-select").select("Autre");
    cy.get(".material-select").select("FDM");
    cy.get(".group-number-input").type("212");
    cy.get("#file-upload").attachFile("test.stl");
    cy.get(".submit-button").click();
  });

  it("Form incomplete", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/new",
      {
        failOnStatusCode: false,
      },
    );

    cy.get(".projectType-select").select("Autre");
    cy.get(".group-number-input").type("212");
    cy.get(".submit-button").click();
    cy.contains("Tous les champs ne sont pas");
  });

  it("Group is NaN", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/new",
      {
        failOnStatusCode: false,
      },
    );

    cy.get(".group-number-input").type("NaN");
    cy.get(".group-number-input").should("have.value", "");
  });

  it("Group change with arrow", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/new",
      {
        failOnStatusCode: false,
      },
    );

    cy.get(".group-number-input").type(
      "{uparrow}{uparrow}{uparrow}{uparrow}{uparrow}",
    );
    cy.get(".group-number-input").should("have.value", 5);
    cy.get(".group-number-input").type("{downarrow}{downarrow}");
    cy.get(".group-number-input").should("have.value", 3);
  });
});
