// Import express, ejs, mysql, session, path, express-sanitizer, and dotenv
var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql2');
var session = require('express-session');
const path = require('path');
const expressSanitiser = require('express-sanitizer');
require('dotenv').config();

// Create an express app object
const app = express();
const port = process.env.PORT || 8000;

// Create a session
app.use(session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialised: false,
    cookie: {
        expires: 6000000
    }
}))

// Create an input sanitiser
app.use(expressSanitiser());

// Define the database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST ||'localhost',
    user: process.env.DB_USER || 'big_boulder_app' ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'big_boulder',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
});
global.db = db;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up body parser
app.use(express.urlencoded({ extended: true }));

// Set up public folder for static assets
app.use(express.static(path.join(__dirname, 'public')));

// Define app-specific data
app.locals.appName = "Big Boulder";

// Load routes
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

// Load routes for climbs
const climbRoutes = require('./routes/climbs');
app.use('/climbs', climbRoutes);

// Start the web app listening
app.listen(port, () => console.log(`App listening on port ${port}`));