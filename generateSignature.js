const crypto = require("crypto");
console.log("this is happening")
const generateSignature = (data, passPhrase = null) => {
  let pfOutput = "";
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (data[key] !== "") {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
      }
    }
  }

  let getString = pfOutput.slice(0, -1);
  if (passPhrase !== null) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(getString).digest("hex");
};

module.exports = generateSignature;
