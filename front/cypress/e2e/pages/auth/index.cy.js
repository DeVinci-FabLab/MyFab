/// <reference types="cypress" />
const path = require("path");

describe("Page auth/index", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth/", {
      failOnStatusCode: false,
    });
  });

  it("Correct password (Admin)", () => {
    cy.get(".email").type("admin@admin.com");
    cy.get(".password").type("admin");
    cy.get(".login-button").click();

    cy.contains("Gestion des demandes");
    cy.location("href").should(
      "eq",
      "http://" + path.normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel/admin").replace(/\\/g, "/")
    );
    cy.getCookie("jwt").should("have.property", "expiry");
  });

  it("Correct password (User)", () => {
    cy.get(".email").type("user@user.com");
    cy.get(".password").type("user");
    cy.get(".rememberMe-button").click();
    cy.get(".login-button").click();

    cy.contains("Panel de demande");
    cy.location("href").should(
      "eq",
      "http://" + path.normalize("localhost:3000/" + Cypress.env().BASE_PATH + "/panel").replace(/\\/g, "/")
    );
    cy.getCookie("jwt").then((cookie) => {
      expect(cookie).to.not.be.null;
      expect(cookie.expiry).to.be.undefined;
    });
  });

  it("Wrong Password", () => {
    cy.get(".email").type("nothing@nothing.com");
    cy.get(".password").type("Wrong password");
    cy.get(".login-button").click();

    cy.contains("Impossible de vous connecter");
  });

  it("Toast error", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth?error=true", {
      failOnStatusCode: false,
    });

    cy.contains("Il y a une erreur");
  });

  it("Toast mail OK", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth?mail=ok", {
      failOnStatusCode: false,
    });

    cy.contains("Votre e-mail a été vérifié");
  });

  it("Toast mail KO", () => {
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/auth?mail=ko", {
      failOnStatusCode: false,
    });

    cy.contains("vérification de votre e-mail");
  });
});
