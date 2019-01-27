const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

//since heroku configures the environment variable port we need to pass it
const port = process.env.PORT || 3000;

var app = express();

//this statement says that handlebar will look for partials from this location
//partials are used for common templates such as headers and footers
hbs.registerPartials(__dirname + "/views/partials");

//hbs.registerHelper takes in two arguments - name of the helper, helper function
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", str => {
  return str.toUpperCase();
});

//app.use is used to register middleware - code wont move until you specify next() here
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = now + ": " + req.url + " " + req.method;
  fs.appendFile("server.log", log + "\n", err => {
    if (err) {
      console.log("unable to append to server log");
    }
  });

  next();
});

//middleware to render a maintenance page
app.use((req, res, next) => {
  res.render("maintenance.hbs");
});

//this middleware allows you to load static html files easily
app.use(express.static(__dirname + "/public"));

//to use handlebar as rendering engine
app.set("view engine", "hbs");

app.get("/", function(req, res) {
  // res.send({
  //   name: "sachin",
  //   likes: ["Biking", "Cities"]
  // });
  res.render("home.hbs", {
    pageTitle: "Home page",
    welcomeMessage: "Welcome to my first hbs app"
  });
});

app.get("/about", (req, res) => {
  //res.send("About page");
  res.render("about.hbs", {
    pageTitle: "About page"
  });
});

app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Unable to handle the request"
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
