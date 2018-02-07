const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
  // Check to see if the email already exists in the database
  User.find({ email: req.body.email })
    .exec()
    // user is an array
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  // Find gets an array
  User.find({ email: req.body.email })
    .exec()
    // users is an array
    .then(user => {
      // If we have no user
      if (user.length < 1) {
        return res.status(401).json({ message: 'Auth Failed' });
      }
      // If we have a user
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        // comparison fails
        if (err) {
          res.status(401).json({ message: 'Auth failed' });
        }
        // If password is correct
        if (result) {
          // we omit the callback (last argument) and sign it to a constant token
          const token = jwt.sign(
            { email: user[0].email, userId: user[0]._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          );
          return res
            .status(200)
            .json({ message: 'Auth successful', token: token });
        }
        res.status(401).json({ message: 'Auth failed' });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
