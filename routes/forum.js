// Forum router
const express = require('express');
const router = express.Router();
const { redirectLogin } = require('../middleware/redirectlogin.js');

// Forum route - get all posts
router.get('/', (req, res, next) => {
    let sqlquery = "SELECT * FROM posts";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("forum.ejs", { climbs: result });
        }
    });
});

// Create post form
router.get('/createpost', redirectLogin, (req, res, next) => {
    res.render("createpost.ejs");
});

// Create post handler
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
            res.redirect('/forum');
        }
    });
});

// Reply to post form
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

// Reply to post handler
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
            return res.redirect('/forum');
        });
    });
});

module.exports = router;