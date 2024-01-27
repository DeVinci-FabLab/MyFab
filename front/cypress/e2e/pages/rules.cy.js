/// <reference types="cypress" />
const path = require("path");

describe("Page rules", () => {
  it("Redirect from /panel", () => {
    cy.setCookie("jwt", "user_need_to_accept_rule");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel", {
      failOnStatusCode: false,
    });

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/rules")
          .replace(/\\/g, "/")
    );
  });

  it("Redirect from /panel/admin", () => {
    cy.setCookie("jwt", "user_need_to_accept_rule");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin",
      {
        failOnStatusCode: false,
      }
    );

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/rules")
          .replace(/\\/g, "/")
    );
  });

  it("Valid rules", () => {
    cy.setCookie("jwt", "user_need_to_accept_rule");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/rules", {
      failOnStatusCode: false,
    });

    cy.get(".accept-button").click();
    cy.location("href", { timeout: 10000 }).should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel")
          .replace(/\\/g, "/")
    );
  });

  it("Random user", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/rules", {
      failOnStatusCode: false,
    });

    cy.get(".back-button").click();
    cy.location("href", { timeout: 10000 }).should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/auth")
          .replace(/\\/g, "/")
    );
  });
});
