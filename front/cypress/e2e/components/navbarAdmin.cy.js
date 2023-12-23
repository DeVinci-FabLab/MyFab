/// <reference types="cypress" />
const path = require("path");

describe("Components navbarAdmin", () => {
  it("Test nav to panel/admin/history", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin", {
      failOnStatusCode: false,
    });

    cy.get(".goTo-history-button").click();
    cy.location("href").should(
      "eq",
      "http://" +
        path.normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/history").replace(/\\/g, "/")
    );
  });

  it("Test nav to panel/admin", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/history", {
      failOnStatusCode: false,
    });

    cy.get(".goTo-tickets-button").click();
    cy.location("href").should(
      "eq",
      "http://" + path.normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin").replace(/\\/g, "/")
    );
  });
});
