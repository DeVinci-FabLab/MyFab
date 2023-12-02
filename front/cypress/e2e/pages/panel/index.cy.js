/// <reference types="cypress" />

describe("Page panel/admin", () => {
  it("No cookie", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel", {
      failOnStatusCode: false,
    });

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth"
    );
  });

  it("Test nav buttons", () => {
    cy.setCookie("jwt", "user");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel", {
      failOnStatusCode: false,
    });

    cy.contains("Page 1");
    cy.get(".next-page-button").click();
    cy.contains("Page 2");
    cy.get(".next-page-button").click();
    cy.contains("Page 2");
    cy.get(".prev-page-button").click();
    cy.contains("Page 1");
    cy.get(".prev-page-button").click();
    cy.contains("Page 1");
  });

  it("Open ticket", () => {
    cy.setCookie("jwt", "user");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel", {
      failOnStatusCode: false,
    });

    cy.get(".ticket-element").first().click();
    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1"
    );
  });

  it("Delete ticket", () => {
    cy.setCookie("jwt", "user");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel", {
      failOnStatusCode: false,
    });

    cy.get(".open-delete-button").first().click();
    cy.get(".delete-button").first().click();

    cy.contains("a été supprimé.");
  });

  it("Open FAQ", () => {
    cy.setCookie("jwt", "user");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel", {
      failOnStatusCode: false,
    });

    cy.get(".faq-button").each(($btn, index) => {
      cy.wrap($btn).click();
    });
  });
});
