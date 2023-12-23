/// <reference types="cypress" />

describe("Page youClickedOnTheLogo", () => {
  beforeEach(() => {});

  it("Test redirection", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/youClickedOnTheLogo", {
      failOnStatusCode: false,
    });
    cy.location("href").should("eq", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });
});
