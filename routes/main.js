// New router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { redirectLogin } = require('../middleware/redirectlogin.js');

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
                    res.redirect('./');
                    db.query("INSERT INTO audit (username, datetime, success, eventType) VALUES (?, NOW(), 1, 'login')", [username], (err, result) => {
                        if (err) {
                            next(err)
                        }
                        else {
                            console.log('Successful login attempt logged.')
                            console.log('User logged in:', req.session.userID);
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
                        // Check for duplicate username or email error
                        if (err.code === 'ER_DUP_ENTRY') {
                            const dupError = err.message.includes('username') ? 
                                'Username already exists' : 'Email already exists';
                            res.render('register.ejs', { errors: [{ msg: dupError }] });
                        } else {
                            next(err);
                        }
                    } else {
                        console.log('User registered.');
                        res.render('registered.ejs');
                    }
                })
            })
        }
    }
);

// Forum route
router.get('/forum', (req, res, next) => {
    let sqlquery = "SELECT * FROM posts";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("forum.ejs", { climbs: result });
        }
    });
});

// create post route
router.get('/createpost', redirectLogin, (req, res, next) => {
    res.render("createpost.ejs");
});

router.post('/posted', redirectLogin, (req, res, next) => {
    const title = req.sanitize(req.body.title);
    const content = req.sanitize(req.body.content);

    const sqlquery = "INSERT INTO posts (user_id, title, content, created, parentpost) VALUES (?, ?, ?, NOW(), NULL)";

    db.query(sqlquery, [req.session.userID, title, content], (err, result) => {
        if (err) {
            console.log('Database error:', err);
            next(err);
        } else {
            console.log('Post added to database.');
            res.redirect('./forum');
        }
    });
});

// reply post route
router.get('/replypost/:id', redirectLogin, (req, res, next) => {
    let postId = req.params.id;
    let sqlquery = "SELECT * FROM posts WHERE id = ?";

    db.query(sqlquery, [postId], (err, result) => {
        if (err) {
            next(err);
        } else if (result.length === 0) {
            res.send('Post not found.');
        } else {
            res.render("replypost.ejs", { parentPost: result[0] });
        }
    });
});

router.post('/replyposted/:id', redirectLogin, (req, res, next) => {
    const parentPostId = req.params.id;
    const content = req.sanitize(req.body.content);

    const getParentSql = "SELECT title FROM posts WHERE id = ? LIMIT 1";
    db.query(getParentSql, [parentPostId], (err, rows) => {
        if (err) {
            console.log('Database error (fetch parent):', err);
            return next(err);
        }
        if (!rows || rows.length === 0) {
            return res.status(404).send('Parent post not found.');
        }

        const replyTitle = `Reply to ${rows[0].title}`;
        const insertSql = "INSERT INTO posts (user_id, title, content, created, parentpost) VALUES (?, ?, ?, NOW(), ?)";
        db.query(insertSql, [req.session.userID, replyTitle, content, parentPostId], (err2) => {
            if (err2) {
                console.log('Database error (insert reply):', err2);
                return next(err2);
            }
            console.log('Reply post added to database.');
            return res.redirect('./forum');
        });
    });
});


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

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
        console.log('User logged out.');
        res.redirect('./login');
    
    })
})



module.exports = router;