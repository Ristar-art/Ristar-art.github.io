const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const crypto = require("crypto");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Signature generation
const generateAPISignature = (data, passPhrase = null) => {
    let ordered_data = {};
    Object.keys(data).sort().forEach(key => {
        ordered_data[key] = data[key];
    });
    data = ordered_data;

    let getString = '';
    for (let key in data) {
        if (key !== 'testing') { // Exclude 'testing' parameter in test mode
            getString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g,'+') + '&';
        }
    }

    getString = getString.substring(0, getString.length - 1);
    if (passPhrase !== null) {getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;}

    return crypto.createHash("md5").update(getString).digest("hex");
}

app.post('/pay', (req, res) => {
    const data = req.body;
    console.log("Payment data: ", data);

    // Generate the API signature
    const passPhrase = "f103e22c0418655fb03991538c51bfd5"; // Replace with your actual passphrase
    data.signature = generateAPISignature(data, passPhrase);
    console.log("data.signature is ",data.signature)
    axios.post('https://sandbox.payfast.co.za​/eng/process', data)
        .then(response => {
            // Assuming the payment was successful, redirect to the return URL
            res.redirect(data.return_url);
        })
        .catch(error => {
            // Handle different types of errors
            if (error.response) {
                console.error('Payment error:', error.response.data);
                res.status(500).send({ message: 'Payment failed. Please try again later.' });
            } else if (error.request) {
                console.error('No response received:', error.request);
                res.status(500).send({ message: 'No response received from the payment gateway. Please try again later.' });
            } else {
                console.error('Error', error.message);
                res.status(500).send({ message: 'An error occurred while processing your payment. Please try again later.' });
            }
        });
});

app.listen(3000, () => console.log('Server started on port 3000'));
