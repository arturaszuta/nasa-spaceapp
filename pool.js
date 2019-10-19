const pgp = require('pg-promise')(/* initialization options */);

// const cn = {
//     host: process.env.PGHOST, // server name or IP address;
//     port: process.env.PGPORT,
//     database: process.env.PGDATABASE,
//     user: process.env.PGUSER,
//     password: process.env.PGPASSWORD
// };

// alternative:
var cn = process.env.PGDBURL;

const db = pgp(cn); // database instance;

// select and return a single user name from id:
db.one('SELECT * FROM users;')
    .then(user => {
        console.log(user); // print user name;
    })
    .catch(error => {
        console.log(error); // print the error;
    });

// alternative - new ES7 syntax with 'await':
// await db.one('SELECT name FROM users WHERE id = $1', [123]);