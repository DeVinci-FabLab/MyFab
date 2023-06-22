/// <reference types="cypress" />

describe("Components navbarAdmin", () => {
  it("Test nav to panel/admin/history", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin", {
      failOnStatusCode: false,
    });

    cy.get(".goTo-history-button").click();
    cy.location("href").should("eq", "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/history");
  });

  it("Test nav to panel/admin", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/history", {
      failOnStatusCode: false,
    });

    cy.get(".goTo-tickets-button").click();
    cy.location("href").should("eq", "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin");
  });
});
