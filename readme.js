// On Video 13
// database for this app is hosted on mlab called node-rest-shop
// Authentication

// Can't use a session because REST APIs are stateless
// Mobiles may not support sessions
// Instead return a token, an object containing a signature
// Stored token is sent to authorize subsequent request and access protected routes
// We use node-jsonwebtoken
// No log out route. There is no session we need to clear

// Node.bcryt.js for hashing passwords

// This app uses a reg ex to validate email address is valid in the user model
