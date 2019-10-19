// const ENV        = process.env.ENV || "development";
require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const pg = require("pg");
const app = express();
const client = new pg.Client(process.env.PGDBURL);
client.connect();

app.get("/", function(req, res) {
	res.send("Hello!");
});

app.get("/users", function(req, res) {
	client.query(`SELECT * FROM users`, (error, result) => {
		if (error) {
			res.json("Something went wrong when fetching your data... ");
		}
		res.json(result.rows);
	});
});

app.post("/satellites", function(req, res) {
	// Only user 1 exists
	const satelliteParams = [
		req.params.name,
		req.params.description,
		req.params.sat_id
	];
	client
		.query(
			`INSERT INTO satellites (name, description, sat_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
			satelliteParams
		)
		.then((error, result) => {
			if (error) {
				res.json("Something went wrong when saving your data... ");
			}
			res.json(result.rows);
		});
});

app.get("/satellites", function(req, res) {
	client.query(`SELECT * FROM satellites`, (error, result) => {
		if (error) {
			res.json("Something went wrong when fetching your data... ");
		}
		res.json(result.rows);
	});
});

app.listen(PORT || 8000, () => {
	console.log("Server has started!");
});
