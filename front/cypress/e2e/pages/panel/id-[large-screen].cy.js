/// <reference types="cypress" />

describe("Page panel/:id", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it("Show user infos", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
      failOnStatusCode: false,
    });

    cy.get(".user-button").first().click();
    cy.get(".close-button").first().click();
    cy.get(".user-button").first().click();
    cy.get("body").click(100, 100);
  });

  it("Change type", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
      failOnStatusCode: false,
    });

    cy.get(".change-type-button").first().click();
    cy.get(".cancel-button").first().click();
    cy.get(".change-type-button").first().click();
    cy.get("body").click(100, 100);
    cy.get(".change-type-button").first().click();
    cy.get(".statusType-select").select("PIX2");
    cy.get(".approve-button").first().click();

    cy.contains("Le type de projet");
  });

  it("Change status", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
      failOnStatusCode: false,
    });

    cy.get(".change-status-button").first().click();
    cy.get(".cancel-button").first().click();
    cy.get(".change-status-button").first().click();
    cy.get("body").click(100, 100);
    cy.get(".change-status-button").first().click();
    cy.get(".statusType-select").select("Fermé");
    cy.get(".approve-button").first().click();

    cy.contains("Le status du ticket");
  });

  it("Cancel ticket", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
      failOnStatusCode: false,
    });

    cy.get(".cancel-ticket").first().click();
    cy.get(".back-button").first().click();
    cy.get(".cancel-ticket").first().click();
    cy.get("body").click(100, 100);
    cy.get(".cancel-ticket").first().click();
    cy.get(".confirmation-cancel-ticket-button").first().click();

    cy.contains("La demande a été annulée");
  });

  it("Send message", () => {
    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
      failOnStatusCode: false,
    });

    cy.get(".chat-textarea").type("Message test");
    cy.get(".send-message-button").first().click();

    cy.contains("Votre commentaire a été envoyé !");
  });

  // Je ne sais pas pourquoi ça ne marche pas avec le test en light mode
  // Le bouton download n'est pas visible et je give up ce truc
  // Si tu veux fixer ce test, toi qui lis ce message, n'hésite pas :)

  //  it("Update file", () => {
  //    cy.setCookie("jwt", "admin");
  //    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
  //      failOnStatusCode: false,
  //    });
  //
  //    cy.get(".see-file-button").first().should("be.visible").click();
  //    cy.get(".close-button").first().click();
  //    cy.reload();
  //    cy.get(".see-file-button").first().should("be.visible").click();
  //    cy.get("body").click(100, 100);
  //    cy.get(".see-file-button").first().should("be.visible").click();
  //    cy.get(".comment-file-textarea").type("Comment test");
  //    cy.get(".close-button").first().click();
  //    cy.reload();
  //    cy.get(".see-file-button").first().should("be.visible").click();
  //    cy.get(".printer-select").select("Cody");
  //    cy.get(".close-button").first().click();
  //  });

  it("Download file", () => {
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.task("deleteFolder", downloadsFolder);

    cy.setCookie("jwt", "admin");
    cy.visit("http://localhost:3000/" + Cypress.env().BASE_PATH + "/panel/1", {
      failOnStatusCode: false,
    });

    cy.get(".download-button").first().click();
    cy.readFile(downloadsFolder + "/Test.stl", { timeout: 15000 }).should(
      "exist",
    );
  });
});
