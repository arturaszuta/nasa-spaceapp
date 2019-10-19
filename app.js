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

app.get("/satellites", function(req, res) {
	client.query(`SELECT * FROM satellites`, (error, result) => {
		if (error) {
			res.json("Something went wrong when fetching your data... ");
		}
		res.json(result.rows);
	});
});

app.post("/user/1/satellites", function(req, response) {
	// Only user 1 exists
	// const user_id = req.params.user_id;
	const params = req.query;
	const satelliteParams = [
		params.name,
		params.description,
		params.year_launched,
		params.sat_id
	];
	console.log(">>>>>>>>>>>>>", satelliteParams);
	client
		.query(
			`SELECT * FROM satellites
      JOIN user_satellites ON user_satellites.satellite_id = satellites.sat_id
      JOIN users ON user_satellites.user_id = users.id
      WHERE sat_id = $1 AND user_id = $2;
    `,
			[params.sat_id, 1]
		)
		.then((err, res) => {
			console.log(">>>>>>>>>>>>>", res);
			if (err) {
				response.json({
					status: "error",
					error: err
				});
			}
			if (res) {
				return res.json({
					status: "duplicate",
					msg: "You've already added this satellite"
				});
			} else {
				client
					.query(
						`INSERT INTO satellites (name, description, year_launched, sat_id)
          VALUES ($1, $2, $3, $4)
          RETURNING *`,
						satelliteParams
					)
					.then((error, response) => {
						if (error) {
							throw new Error("You suck :P");
						}
						client
							.query(
								`INSERT INTO user_satellites (user_id, satellite_id)
            VALUES ($1, $2)
            RETURNING *`,
								[1, params.sat_id]
							)
							.then((error, response) => {
								if (!error) {
									response.json(response.rows[0]);
								}
							});
					});
			}
		});
});

// User's satellites
app.get("/user/1/satellites", function(req, res) {
	// const user_id = req.params.user_id;
	client.query(
		`
        SELECT * FROM satellites 
        JOIN user_satellites ON satellites.id = user_satellites.satellite_id
        WHERE user_satellites.user_id = 1
        ;`,
		(error, result) => {
			if (error) {
				res.json("Something went wrong when fetching your data... ", error);
			}
			res.json(result.rows);
		}
	);
});

app.listen(PORT || 8000, () => {
	console.log("Server has started!");
});
