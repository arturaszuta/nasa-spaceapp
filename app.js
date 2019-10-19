// const ENV        = process.env.ENV || "development";
require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const pg = require("pg");
const app = express();
// const client = new pg.Client(
// 	"postgres://fqshkgbg:fJ75kAwSrulU6C8oOy6LEfALxzFx-wSb@salt.db.elephantsql.com:5432/fqshkgbg"
// );
const client = new pg.Client(process.env.PGDBURL);
client.connect();

app.get("/", function(req, res) {
	res.send("Hello!");
});

app.get("/users", function(req, res) {
	client.query(`SELECT * FROM users`, (error, result) => {
		res.json(result.rows);
	});
});

app.get("/user/:id", function(req, res) {
	//change route to /user/:userid when auth is setup
	res.send("pull from db and display users here");
});

app.get("/user/1/satellites", function(req, res) {
	//change route to /user/:userid/satellites when auth is setup
	res.send("pull from db and display satellites belonging to user 1");
});

app.post("/user/:user_id/satellites", function(req, res) {
	const newSatellite = [
		params.name,
		params.timestamp,
		params.description,
		user_id
	];
	return pool
		.query(
			`
    INSERT INTO satellites (name, created_at, description, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`,
			newSatellite
		)
		.then(res => {
			res.send({ message: "success", status: 200 });
		});
});

app.listen(PORT || 8000, () => {
	console.log("Server has started!");
});
