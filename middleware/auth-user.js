'use strict';

const auth = require('basic-auth');
const { Users } = require('../models');
const bcrypt = require('bcryptjs');


exports.authenticateUser = async (req, res, next) => {
     
    let message; //store message to display 
    
    const credentials = auth(req);

    if (credentials) {
        const user = await Users.findOne({ where: {emailAddress: credentials.name} });
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if (authenticated) { // If the passwords match 
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                
                // Store the user on the Request Object.
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = `Auth header not found`;
    }

    if (message) {
        console.warn(message);
        res.status(401).json( {message: 'Access Denied' });
    } else {
        next();
    }
};