const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors"); // Import the cors middleware
require('dotenv').config();

const app = express();
const port = 3000;

const generateSignature = (data, passPhrase = null) => {
  // Create parameter string
  let pfOutput = "";
  for (let key in data) {
    if(data.hasOwnProperty(key)){
      if (data[key] !== "") {
        pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
      }
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  if (passPhrase !== null) {
    getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(getString).digest("hex");
}; 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post("/hashData", (req, res) => {
  // Assuming req.body contains the data for which signature needs to be generated
  const data = req.body;
  
  // Assuming passphrase is sent in the request body as well
  // const passPhrase = req.body.passphrase;
  
  const signature = generateSignature(data);
  //const signature = generateSignature(data, passPhrase);
  
  res.json({ signature: signature });
});

// app.get("/", (req, res) => {
//   const html = fs.readFileSync("index.html", "utf8");
//   res.send(html);
// });

//this is the code for ozow intergration
function generateRequestHash(siteCode, countryCode, currencyCode, amount, transactionReference, bankReference, cancelUrl, errorUrl, successUrl, notifyUrl, privateKey) {
  const inputString = `${siteCode}${countryCode}${currencyCode}${amount}${transactionReference}${bankReference}${cancelUrl}${errorUrl}${successUrl}${notifyUrl}${privateKey}`;
  const calculatedHashResult = generateRequestHashCheck(inputString);
  console.log(`Hashcheck: ${calculatedHashResult}`);
  return calculatedHashResult;
}
function generateRequestHashCheck(inputString) {
  const stringToHash = inputString.toLowerCase();
  console.log(`Before Hashcheck: ${stringToHash}`);
  return getSha512Hash(stringToHash);
}
function getSha512Hash(stringToHash) {
  const hash = crypto.createHash("sha512");
  hash.update(stringToHash);
  const hashDigest = hash.digest("hex");
  console.log("hash.digest(hex) is ", hashDigest)
  return hashDigest;
}

app.post("/request-hash", (req, res) => {
  const ozowData = req.body;
  const privateKey = process.env.PRIVATE_KEY;
  const { siteCode, countryCode, currencyCode, amount, transactionReference, bankReference, cancelUrl, errorUrl, successUrl, notifyUrl } = ozowData;
  const hash = generateRequestHash(siteCode, countryCode, currencyCode, amount, transactionReference, bankReference, cancelUrl, errorUrl, successUrl, notifyUrl, privateKey);
 console.log("generateRequestHash is ",generateRequestHash)
  res.json({ hash: hash });
});


app.post("/checkout", async (req, res) => {
  try {
      const ozowData = req.body;
      const options = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'ApiKey': process.env.API_KEY,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(ozowData)
      };
      const response = await fetch('https://stagingapi.ozow.com/PostPaymentRequest', options);
      if (!response.ok) {
          throw new Error("Failed to initiate checkout");
      }
      const paymentUrl = await response.text();
      res.json({ paymentUrl: paymentUrl });
  } catch (error) {
      console.error("Error during checkout:", error.message);
      res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`PayFast payment gateway listening at http://localhost:${port}`);
});