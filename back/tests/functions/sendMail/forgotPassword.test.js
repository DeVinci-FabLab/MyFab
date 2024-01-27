// Import necessary modules and functions
const sendMail = require("../../../functions/sendMail/index");

// Mock the nodemailer transporter
jest.mock("../../../functions/sendMail/index");

// Mock the sendMail function
const sendMailMock = jest.fn().mockResolvedValue(true);

beforeEach(() => {
  jest.clearAllMocks(); // Reset all mock function calls before each test
});

describe("sendForgetPasswordMail function", () => {
  it("should send a forget password email", async () => {
    sendMail.sendMail.mockImplementation(sendMailMock);

    const {
      sendForgetPasswordMail,
    } = require("../../../functions/sendMail/forgotPassword");

    // Mock necessary data
    const userMail = "user@example.com";
    const firstName = "John";
    const token = "yourToken";

    // Call the function
    const result = await sendForgetPasswordMail({
      userMail,
      firstName,
      token,
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
