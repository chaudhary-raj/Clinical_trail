const passport = require('passport');

/**
 * @desc  Middleware to protect routes via Passport JWT
 *        Attaches authenticated user to req.user
 */
const protect = passport.authenticate('jwt', { session: false });

module.exports = { protect };
