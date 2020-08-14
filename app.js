const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// The express.static grabs uses all the static files within the folder public.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function() {
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
    const url = "https://us17.api.mailchimp.com/3.0/lists/b31a2f81ec";
    const options = {
        method: "POST",
        auth: "ariana:664cff50dbe1238f9564562c44d55777-us17"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.send("Successfully subscribed!");
        } else {
            res.send("There was an error while signing up, please try again.")
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});
