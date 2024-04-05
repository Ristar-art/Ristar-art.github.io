const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors"); // Import the cors middleware

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

app.listen(port, () => {
  console.log(`PayFast payment gateway listening at http://localhost:${port}`);
});
