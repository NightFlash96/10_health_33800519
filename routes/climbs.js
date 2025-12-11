// New router
const express = require('express');
const router = express.Router();

// Climb sessions page
router.get('/sessions', (req, res, next) => {
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
router.get('/add', (req, res, next) => {
    res.render("add_climb.ejs");
});

module.exports = router;