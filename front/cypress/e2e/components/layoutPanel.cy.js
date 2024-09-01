/// <reference types="cypress" />
const path = require("path");

describe("Components layoutPanel", () => {
  it("Test nav-small to panel/", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/",
      {
        failOnStatusCode: false,
      },
    );

    cy.get(".open-layout-button").click();
    cy.get(".my-demand-button-small").click();

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel")
          .replace(/\\/g, "/"),
    );
  });

  it("Test nav-large to panel/", () => {
    cy.viewport(1920, 1080);
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin/",
      {
        failOnStatusCode: false,
      },
    );

    cy.get(".my-demand-button-large").click();

    cy.location("href").should(
      "eq",
      "http://" +
        path
          .normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel")
          .replace(/\\/g, "/"),
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
      "http://" +
        path
          .normalize(
            "localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin",
          )
          .replace(/\\/g, "/"),
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
      "http://" +
        path
          .normalize(
            "localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin",
          )
          .replace(/\\/g, "/"),
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
      "http://" +
        path
          .normalize(
            "localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
          )
          .replace(/\\/g, "/"),
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
      "http://" +
        path
          .normalize(
            "localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
          )
          .replace(/\\/g, "/"),
    );
  });
});

describe("Test change school", () => {
  it("Test change school and year", () => {
    cy.setCookie("jwt", "user_test_school_panel");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".school-select").select("Ecole1");
    cy.get(".year-select").select("1");
    cy.get(".approve-button").first().click();

    cy.contains("Votre école et année ont été enregistrées");
  });

  it("Test no school", () => {
    cy.setCookie("jwt", "user_test_school_panel");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".year-select").select("1");
    cy.get(".approve-button").first().click();

    cy.contains("Vous devez sélectionner une école");
  });

  it("Test no year", () => {
    cy.setCookie("jwt", "user_test_school_panel");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/", {
      failOnStatusCode: false,
    });

    cy.get(".school-select").select("Ecole1");
    cy.get(".approve-button").first().click();

    cy.contains("Vous devez sélectionner une année");
  });
});
