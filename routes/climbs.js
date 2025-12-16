// Climb router
const express = require('express');
const router = express.Router();
const { redirectLogin } = require('../middleware/redirectlogin.js');

// Climb sessions page
router.get('/sessions', redirectLogin, (req, res, next) => {
    let sqlquery = "SELECT * FROM climbs WHERE user_id = ?";

    db.query(sqlquery, [req.session.userID], (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("sessions.ejs", { climbs: result });
        }
    });
});

// add climb page
router.get('/add', redirectLogin, (req, res, next) => {
    res.render("addclimb.ejs");
});

router.post('/climb_added', redirectLogin, (req, res, next) => {
    let name = req.sanitize(req.body.name);
    let difficulty = req.sanitize(req.body.difficulty);

    let sqlquery = "INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES (?, ?, ?, NOW())";

    db.query(sqlquery, [req.session.userID, name, difficulty], (err, result) => {
        if (err) {
            console.log('Database error:', err);
            next(err);
        } else {
            console.log('Climb added to database.');
            res.render("climbadded.ejs");
        }
    });
});

module.exports = router;