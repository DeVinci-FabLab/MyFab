// Import necessary modules and functions
const nodemailer = require("nodemailer");

// Mock the nodemailer transporter
jest.mock("nodemailer");

// Mock the sendMail function
const sendMailMock = jest.fn().mockResolvedValue(true);

beforeEach(() => {
  jest.clearAllMocks(); // Réinitialiser les appels de toutes les fonctions mocks avant chaque test
});

describe("sendForgetPasswordMail function", () => {
  it("should send a forget password email", async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const { sendForgetPasswordMail } = require("../../functions/sendMail");

    // Mock necessary data
    const userMail = "user@example.com";
    const firstName = "John";
    const token = "yourToken";

    // Call the function
    const result = await sendForgetPasswordMail(userMail, firstName, token);

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: `DeVinci FabLab<${process.env.MAIL_USER}>`,
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });
});

describe("sendRegisterMail function", () => {
  it("should send a forget password email", async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const { sendRegisterMail } = require("../../functions/sendMail");

    // Mock necessary data
    const userMail = "user@example.com";
    const firstName = "John";
    const token = "yourToken";

    // Call the function
    const result = await sendRegisterMail(userMail, firstName, token);

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: `DeVinci FabLab<${process.env.MAIL_USER}>`,
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });
});

describe("sendMail function", () => {
  it("should send a forget password email", async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const { sendMail } = require("../../functions/sendMail");

    // Mock necessary data
    const userMail = "user@example.com";
    const firstName = "John";
    const token = "yourToken";

    // Call the function
    const result = await sendMail(userMail, firstName, token);

    // Assertions
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: `DeVinci FabLab<${process.env.MAIL_USER}>`,
        to: userMail,
        subject: expect.any(String),
        text: expect.any(String),
        html: expect.any(String),
      })
    );
  });
});
