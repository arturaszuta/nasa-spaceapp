// const ENV        = process.env.ENV || "development";
const PORT = process.env.PORT;
const express = require("express");
const app = express();

app.get("/", function(req, res) {
	res.send("Hello!");
});

app.get("/user/1", function(req, res) {
	//change route to /user/:userid when auth is setup
	res.send("pull from db and display users here");
});

app.get("/user/1/satellites", function(req, res) {
	//change route to /user/:userid/satellites when auth is setup
	res.send("pull from db and display satellites belonging to user 1");
});

app.post("/user/1/satellites", function(req, res) {
	//change route to /user/:userid/satellites when auth is setup
	res.send({ message: "success", status: 200 });
});

app.listen(PORT || 8000, () => {
	console.log("Server has started!");
});
