// Import necessary modules and functions
const nodemailer = require("nodemailer");
const fs = require("fs");

// Mock the nodemailer transporter and fs
jest.mock("nodemailer");
jest.mock("fs");

// Mock the sendMail function
const sendMailMock = jest.fn().mockResolvedValue(true);
const writeMailContentMock = jest.fn().mockResolvedValue(true);

beforeEach(() => {
  jest.clearAllMocks(); // Réinitialiser les appels de toutes les fonctions mocks avant chaque test
});

describe("sendRegisterMail function", () => {
  it("should send a email", async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const { sendMail } = require("../../../functions/sendMail/");

    // Mock necessary data
    const userMail = "user@example.com";

    // Call the function
    const result = await sendMail({
      to: userMail,
      subject: "Jest is working ?",
      text: "Hello, I am the senate",
      html: "<p>Hello, I am the senate</p>",
    });

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

  it("should export mail content in html file", async () => {
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    fs.writeFileSync.mockImplementation(writeMailContentMock);

    const { sendMail } = require("../../../functions/sendMail/");

    // Mock necessary data
    const userMail = "user@example.com";
    const testFile = "test.html";

    // Call the function
    const result = await sendMail({
      to: userMail,
      subject: "Jest is working ?",
      text: "Hello, I am the senate",
      html: "<p>Hello, I am the senate</p>",
      testFile,
    });

    // Assertions
    expect(result).toBe(true);
    expect(writeMailContentMock).toHaveBeenCalledTimes(1);

    expect(writeMailContentMock).toHaveBeenCalledWith(
      "./data/" + testFile,
      expect.any(String)
    );
  });
});
