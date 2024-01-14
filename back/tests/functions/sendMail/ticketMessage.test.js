// Import necessary modules and functions
const sendMail = require("../../../functions/sendMail/index");

// Mock the nodemailer transporter
jest.mock("../../../functions/sendMail/index");

// Mock the sendMail function
const sendMailMock = jest.fn().mockResolvedValue(true);

beforeEach(() => {
  jest.clearAllMocks(); // Réinitialiser les appels de toutes les fonctions mocks avant chaque test
});

describe("sendTicketMessageMail function", () => {
  it("should send a new message email (id < 10)", async () => {
    sendMail.sendMail.mockImplementation(sendMailMock);

    const {
      sendTicketMessageMail,
    } = require("../../../functions/sendMail/ticketMessage");

    // Mock necessary data
    const userMail = "user@example.com";
    const ticketId = 2;
    const messages = [
      {
        userName: "l_eg",
        content:
          "Bonjour, je parle dans les tests de messages, personne ne va tomber sur ces messages",
        creationDate: new Date(2022, 4, 5, 16, 23),
        isApplicant: 1,
      },
      {
        userName: "Cody",
        content:
          "La probalité que quelqu'un tombe dessus est faible, mais regarde une nouvelle personne est en train de nous lire. Bonjour à toi !",
        creationDate: new Date(2015, 8, 29, 0, 16),
        isApplicant: 0,
      },
    ];

    // Call the function
    const result = await sendTicketMessageMail({
      userMail,
      ticketId,
      messages,
    });

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });

  it("should send a new message email (id < 100)", async () => {
    sendMail.sendMail.mockImplementation(sendMailMock);

    const {
      sendTicketMessageMail,
    } = require("../../../functions/sendMail/ticketMessage");

    // Mock necessary data
    const userMail = "user@example.com";
    const ticketId = 42;
    const messages = [
      {
        userName: "l_eg",
        content:
          "Bonjour, je parle dans les tests de messages, personne ne va tomber sur ces messages",
        creationDate: new Date(2022, 4, 5, 16, 23),
        isApplicant: 1,
      },
      {
        userName: "Cody",
        content:
          "La probalité que quelqu'un tombe dessus est faible, mais regarde une nouvelle personne est en train de nous lire. Bonjour à toi !",
        creationDate: new Date(2015, 8, 29, 0, 16),
        isApplicant: 0,
      },
    ];

    // Call the function
    const result = await sendTicketMessageMail({
      userMail,
      ticketId,
      messages,
    });

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });

  it("should send a new message email (id < 1000)", async () => {
    sendMail.sendMail.mockImplementation(sendMailMock);

    const {
      sendTicketMessageMail,
    } = require("../../../functions/sendMail/ticketMessage");

    // Mock necessary data
    const userMail = "user@example.com";
    const ticketId = 212;
    const messages = [
      {
        userName: "l_eg",
        content:
          "Bonjour, je parle dans les tests de messages, personne ne va tomber sur ces messages",
        creationDate: new Date(2022, 4, 5, 16, 23),
        isApplicant: 1,
      },
      {
        userName: "Cody",
        content:
          "La probalité que quelqu'un tombe dessus est faible, mais regarde une nouvelle personne est en train de nous lire. Bonjour à toi !",
        creationDate: new Date(2015, 8, 29, 0, 16),
        isApplicant: 0,
      },
    ];

    // Call the function
    const result = await sendTicketMessageMail({
      userMail,
      ticketId,
      messages,
    });

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });

  it("should send a new message email (id > 1000)", async () => {
    sendMail.sendMail.mockImplementation(sendMailMock);

    const {
      sendTicketMessageMail,
    } = require("../../../functions/sendMail/ticketMessage");

    // Mock necessary data
    const userMail = "user@example.com";
    const ticketId = 2224;
    const messages = [
      {
        userName: "l_eg",
        content:
          "Bonjour, je parle dans les tests de messages, personne ne va tomber sur ces messages",
        creationDate: new Date(2022, 4, 5, 16, 23),
        isApplicant: 1,
      },
      {
        userName: "Cody",
        content:
          "La probalité que quelqu'un tombe dessus est faible, mais regarde une nouvelle personne est en train de nous lire. Bonjour à toi !",
        creationDate: new Date(2015, 8, 29, 0, 16),
        isApplicant: 0,
      },
    ];

    // Call the function
    const result = await sendTicketMessageMail({
      userMail,
      ticketId,
      messages,
    });

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });
});
