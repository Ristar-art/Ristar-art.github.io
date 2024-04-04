// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const path = require('path');
// const crypto = require("crypto");

// // Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// // Parse application/json
// app.use(bodyParser.json());

// // Serve static files from the 'public' folder
// app.use(express.static(path.join(__dirname, 'public')));

// const generateSignature = (data, passPhrase = null) => {
//     // Create parameter string
//     let pfOutput = "";
//     for (let key in data) {
//         if (data.hasOwnProperty(key)) {
//             if (data[key] !== "") {
//                 pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
//             }
//         }
//     }

//     // Remove last ampersand
//     let getString = pfOutput.slice(0, -1);
//     if (passPhrase !== null) {
//         getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
//     }

//     // Generate the secure signature using MD5 hash
//     const signature = crypto.createHash("md5").update(getString).digest("hex");

//     return signature;
// };

// app.post('/pay', (req, res) => {
//     const data = req.body;
//     console.log("Payment data: ", data);

//     // Generate the secure signature
//     const signature = generateSignature(data, "maluti");
//     data.signature = signature;

//     axios.post('https://sandbox.payfast.co.za/eng/process', data)
//         .then(response => {
//             // Assuming the payment was successful, redirect to the PayFast payment gateway
//             res.redirect(response.data.url); // Redirect to the PayFast payment gateway URL

//             // After payment processing on PayFast, the user will be redirected back to the return URL
//         })
//         .catch(error => {
//             // Handle different types of errors
//             if (error.response) {
//                 console.error('Payment error:', error.response.data);
//                 res.status(500).send({ message: 'Payment failed. Please try again later.' });
//             } else if (error.request) {
//                 console.error('No response received:', error.request);
//                 res.status(500).send({ message: 'No response received from the payment gateway. Please try again later.' });
//             } else {
//                 console.error('Error', error.message);
//                 res.status(500).send({ message: 'An error occurred while processing your payment. Please try again later.' });
//             }
//         });
// });

// app.listen(3000, () => console.log('Server started on port 3000'));

const express = require('express');
const fs = require('fs');
// const generateSignature = require('./generateSignature'); // Import the generateSignature function/
// server.js
const axios = require('axios');

const generateSignature = require('./generateSignature');


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  const html = fs.readFileSync('index.html', 'utf8');
  res.send(html);
});

app.post('/pay', (req, res) => {
  const { amount, item_name } = req.body; // Extract amount and item_name from the request body
   console.log('amount, item_name is ',amount, item_name)
  // Generate the secure signature using the imported generateSignature function
  const signature = generateSignature(amount, item_name);
console.log('signature is ',signature)
  // Assuming you have a form in your index.html that submits data to the server
  // Make use of the generated signature and other payment data as needed
  // ...

  // Make a POST request to the PayFast payment gateway
  axios.post('https://sandbox.payfast.co.za/eng/process', { amount, item_name })
    .then(response => {
      // Assuming the payment was successful, redirect to the PayFast payment gateway
      res.redirect(response.data.url); // Redirect to the PayFast payment gateway URL
    })
    .catch(error => {
      // Handle payment errors
      console.error('Payment error:', error);
      res.status(500).send({ message: 'Payment failed. Please try again later.' });
    });
});

app.listen(port, () => {
  console.log(`PayFast payment gateway listening at http://localhost:${port}`);
});
