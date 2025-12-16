const redirectLogin = (req, res, next) => {
    console.log(req.session.userID);
    if (!req.session.userID) {
        const basePath = process.env.HEALTH_BASE_PATH || '/';
        res.redirect(`${basePath}login`) // redirect to the login page
    } else {
        next(); // move to the next middleware function
    }
}

module.exports = { redirectLogin };