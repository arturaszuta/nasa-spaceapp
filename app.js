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

app.post("/user/1/satellites", function(req, mainresponse) {

  const params = req.body;
  console.log('this are the params', params);
  console.log('this are the req', req);

  
	const satelliteParams = [
		params.name,
		params.description,
		params.year_launched,
    params.sat_id
  ];
  
  client.query(`
    SELECT * FROM satellites WHERE sat_id = $1;
    `,[params.sat_id]
  ).then((res) => {
    if(!res.rows[0]) {

      client.query(`
      INSERT INTO satellites (name, description, year_launched, sat_id) VALUES ($1,$2,$3, $4);`, satelliteParams).then((res) => {
        client.query(`
        INSERT INTO user_satellites (user_id, satellite_id) VALUES ($1, $2);`, [1, params.sat_id])
        mainresponse.json('Created satellite and added it to favorites!')
      })
    } else {
      client.query(`
        SELECT * FROM user_satellites WHERE satellite_id = $1
      `, [params.sat_id]).then((res) => {
        if(!res.rows[0]) {
          client.query(`
          INSERT INTO user_satellites (user_id, satellite_id) VALUES ($1, $2);`, [1, params.sat_id]).then((res) => {
            mainresponse.json('Added satellite to favorites!')
          })
        } else {
          mainresponse.json("This satellite is already favoured!")
        }
      })
    }


  })
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
