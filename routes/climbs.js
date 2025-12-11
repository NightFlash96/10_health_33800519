// New router
const express = require('express');
const router = express.Router();
const { redirectLogin } = require('../middleware/redirectlogin.js');

// Climb sessions page
router.get('/sessions', redirectLogin, (req, res, next) => {
    let sqlquery = "SELECT * FROM climbs";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("sessions.ejs", { climbs: result });
        }
    });
});

// add climb page
router.get('/add', redirectLogin, (req, res, next) => {
    res.render("add_climb.ejs");
});

module.exports = router;