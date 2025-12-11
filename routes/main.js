// New router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// Home route
router.get('/', (req, res, next) => {
    res.render("index.ejs");
});

// About route
router.get('/about', (req, res, next) => {
    res.render("about.ejs");
});

// Login route
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function(req, res, next) {
    let username = req.sanitize(req.body.username);
    let password = req.sanitize(req.body.password);

    let sqlquery = "SELECT password_hash FROM users WHERE username= ? OR email= ?"
    // execute query
    db.query(sqlquery, [username, username], (err, result) => {
        if (err) {
            next(err);
        } else if (result.length === 0){ // if the username or email does not exist, send error message and log failed attempt
            res.send('Username or email not found.');
            console.log(result);
            db.query("INSERT INTO audit (username, datetime, success, eventType) VALUES (?, NOW(), 0, 'incorrect username/email')", [username], (err, result) => {
                if (err) {
                    next(err)
                }
                else {
                    console.log('Failed login attempt logged. Incorrect username/email.')
                }
            });
        } else { // else hash and compare the submitted password to the stored hashed password
            bcrypt.compare(password, result[0].password_hash, function(err, result) {
                if (err) {
                    next(err);
                } else if (result == true) { // it match, log successful attempt
                    req.session.userID = username; // create session variable
                    // res.send("You are now logged in.")
                    res.redirect('/');
                    db.query("INSERT INTO audit (username, datetime, success, eventType) VALUES (?, NOW(), 1, 'login')", [username], (err, result) => {
                        if (err) {
                            next(err)
                        }
                        else {
                            console.log('Successful login attempt logged.')
                        }
                    });
                } else { // if the password does not match, log failed attempt
                    res.send('Login failed, incorrect password.')
                    db.query("INSERT INTO audit (username, datetime, success, eventType) VALUES (?, NOW(), 0, 'incorrect password')", [username], (err, result) => {
                        if (err) {
                            next(err)
                        }
                        else {
                            console.log('Failed login attempt logged. Incorrect password.')
                        }
                    });
                }
            })
        }
    })
});

// Register route
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

router.post('/registered',
    [check("email").isEmail(),
    check("username").isLength({min: 3, max: 50}),
    check("password").isLength({min: 8})
    ],
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            res.render('register.ejs', { errors: errors.array() })
        } else {
            // Hash
            const saltRounds = 10;
            const plainPassword = req.sanitize(req.body.password);

            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
                // Store hashedPassword in db
                let username = req.sanitize(req.body.username);
                let email = req.sanitize(req.body.email);
                // query
                let sqlquery = "INSERT INTO users (username, email, password_hash, created) VALUES (?, ?, ?, NOW())";

                // execute sql query to insert new user
                db.query(sqlquery, [username, email, hashedPassword], function (err, results) {
                    if (err) {
                        console.log('Database error:', err);
                        next(err);
                    } else {
                        console.log('User registered.');
                        res.render('registered.ejs');
                    }
                })
            })
        }
    }
);

router.get('/audit', function(req, res, next) {
    let sqlquery = "SELECT * FROM audit"; // query database to get all the audit logs
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        else {
            console.log(result);
            res.render("auditlog.ejs", {auditlogs: result})
        }
    });
});



module.exports = router;