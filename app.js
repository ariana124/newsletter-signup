const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

// The express.static grabs uses all the static files within the folder public.
app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});

// When we request the home route from our server we deliver the signup page.
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});
