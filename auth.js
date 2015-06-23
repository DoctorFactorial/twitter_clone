var _ = require('lodash')
	, passport = require('passport')
	, fixtures = require('./fixtures')
	, LocalStrategy = require('passport-local').Strategy
  , conn = require('./db')

// Maintain persistent login sessions
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
	conn.model('User').findOne({ id: id }, done)
})

// Local authentication strategy
function verify(username, password, done) {
  conn.model('User').findOne({email: username}, function (err, user) {
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }

    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' }) 
    }
 
    done(null, user)
  })
}

passport.use(new LocalStrategy(verify))

module.exports = passport