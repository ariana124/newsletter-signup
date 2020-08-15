const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();

const app = express();

// The express.static grabs uses all the static files within the folder public.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000 || process.env.PORT, function() {
    console.log("Server is running on port 3000.");
});

// When we request the home route from our server we deliver the signup page.
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const apiKey = process.env.API_KEY;
    const listId = process.env.LIST_ID;
    const dc = process.env.DC;
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: `ariana:${apiKey}`
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});
