// Import necessary modules and functions
const sendMail = require("../../../functions/sendMail/index");

// Mock the nodemailer transporter
jest.mock("../../../functions/sendMail/index");

// Mock the sendMail function
const sendMailMock = jest.fn().mockResolvedValue(true);

beforeEach(() => {
  jest.clearAllMocks(); // Réinitialiser les appels de toutes les fonctions mocks avant chaque test
});

describe("sendMail function", () => {
  it("should send a forget password email", async () => {
    sendMail.sendMail.mockImplementation(sendMailMock);

    const { sendSampleMail } = require("../../../functions/sendMail/sample");

    // Mock necessary data
    const userMail = "user@example.com";
    const text = "Bonjour ceci est un test de mail";

    // Call the function
    const result = await sendSampleMail({
      userMail,
      text,
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
