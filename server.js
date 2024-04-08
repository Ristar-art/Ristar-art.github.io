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
  console.log("side ", siteCode);
  const inputString = `${siteCode}${countryCode}${currencyCode}${amount}${transactionReference}${bankReference}${cancelUrl}${errorUrl}${successUrl}${notifyUrl}${isTest}${privateKey}`;

  const calculatedHashResult = generateRequestHashCheck(inputString);
  console.log(`Hashcheck: ${calculatedHashResult}`);
}

function generateRequestHashCheck(inputString) {
  const stringToHash = inputString.toLowerCase();
  console.log(`Before Hashcheck: ${stringToHash}`);
  return getSha512Hash(stringToHash);
}

function getSha512Hash(stringToHash) {
  const hash = crypto.createHash("sha512");
  hash.update(stringToHash);
  return hash.digest("hex");
}

app.post("/RequestHash", (req, res) => {
  console.log('this being done');
  // Assuming req.body contains the data for which signature needs to be generated
  const data = req.body;
  console.log('data is ', data);
  // Access private key
  const privateKey = process.env.PRIVATE_KEY;
  const isTest = true;

  // Assuming passphrase is sent in the request body as well
  // const passPhrase = req.body.passphrase;
  console.log("my data", data);
  const { siteCode, countryCode, currencyCode, amount, transactionReference, bankReference, cancelUrl, errorUrl, successUrl, notifyUrl } = data;
  generateRequestHash(siteCode, countryCode, currencyCode, amount, transactionReference, bankReference, cancelUrl, errorUrl, successUrl, notifyUrl, privateKey);

  //const signature = generateSignature(data, passPhrase);

  res.json({ data: data, signature: signature });
});


app.listen(port, () => {
  console.log(`PayFast payment gateway listening at http://localhost:${port}`);
});
