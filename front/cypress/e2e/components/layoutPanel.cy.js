/// <reference types="cypress" />

describe("Components layoutPanel", () => {
  it("Test nav-small to panel/", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".open-layout-button").click();
    cy.get(".my-demand-button-small").click();

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel"
    );
  });

  it("Test nav-large to panel/", () => {
    cy.viewport(1920, 1080);
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".my-demand-button-large").click();

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel"
    );
  });

  it("Test nav-small to panel/admin", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".open-layout-button").click();
    cy.get(".users-demand-button-small").click();

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin"
    );
  });

  it("Test nav-large to panel/admin", () => {
    cy.viewport(1920, 1080);
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".users-demand-button-large").click();

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin"
    );
  });

  it("Test nav-small to panel/users", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".open-layout-button").click();
    cy.get(".users-button-small").click();

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users"
    );
  });

  it("Test nav-large to panel/users", () => {
    cy.viewport(1920, 1080);
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".users-button-large").click();

    cy.location("href").should(
      "eq",
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users"
    );
  });
});
