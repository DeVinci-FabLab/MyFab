const axios = require("axios");

module.exports.sendApiRequest = sendApiRequest;
async function sendApiRequest(url) {
  try {
    await axios.get(url);
    return true;
  } catch (error) {
    return false;
  }
}
