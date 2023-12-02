/// <reference types="cypress" />

describe("Component tablesUserAdmin", () => {
  it("Open close popup", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".user-2").click();
    cy.get(".validate-button").first().click();
    cy.get(".user-2").click();
    cy.get("body").click(100, 100);
  });

  it("Add role", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".user-2").click();
    cy.get(".add-role-button").first().click();
    cy.contains("a été ajouté");
  });

  it("Remove role", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".user-3").click();
    cy.get(".remove-role-button").first().click();
    cy.contains("a été supprimé");
  });

  it("Can't remove active user", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".user-0").click();
    cy.get(".add-role-button").should("have.length", 0);
    cy.get(".remove-role-button").should("have.length", 0);
  });

  it("Can't add/remove active user", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".user-0").click();
    cy.get(".add-role-button").should("have.length", 0);
    cy.get(".remove-role-button").should("have.length", 0);
  });

  it("Can't add/remove protected roles", () => {
    cy.setCookie("jwt", "modo");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".user-3").click();
    cy.get(".add-role-button").as("buttonsAddRole");
    cy.get(".remove-role-button").as("buttonsRemoveRole");

    cy.get("@buttonsAddRole")
      .its("length")
      .then((lengthAddRole) => {
        cy.get(".available-role").its("length").should("gt", lengthAddRole);
      });

    cy.get("@buttonsRemoveRole")
      .its("length")
      .then((lengthRemoveRole) => {
        cy.get(".user-role").its("length").should("gt", lengthRemoveRole);
      });
  });

  it("Search user (click)", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".search-input").type("Target user");
    cy.get(".search-validation-button").click();
    cy.contains("found");
  });

  it("Search user (enter)", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.get(".search-input").type("Target user{enter}");
    cy.contains("found");
  });

  it("Test nav buttons", () => {
    cy.setCookie("jwt", "admin");
    cy.visit(
      "http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/users",
      {
        failOnStatusCode: false,
      }
    );

    cy.contains("etudiant1@test.com");
    cy.get(".next-page-button").click();
    cy.contains("etudiant3@test.com");
    cy.get(".next-page-button").click();
    cy.contains("etudiant3@test.com");
    cy.get(".prev-page-button").click();
    cy.contains("etudiant1@test.com");
    cy.get(".prev-page-button").click();
    cy.contains("etudiant1@test.com");
  });
});
