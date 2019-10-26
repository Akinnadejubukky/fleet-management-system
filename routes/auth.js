const express = require('express');

const bcrypt = require('bcryptjs');

const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('auth/login');
});
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    res.redirect('auth/signup');
  }
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    return res.redirect('auth/login');
  } else {
    req.session.isLoggedIn = true;
    req.session.user = foundUser;
    await req.session.save();
    return res.redirect('/');
  }
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { email, companyName, password } = req.body;
  let foundUser = await User.findOne({
    email: email
  });
  if (foundUser) {
    //TODO; remember to add flash message
    return res.redirect('/');
  } else {
    let hashedPwd = await bcrypt.hash(password, 12);
    if (hashedPwd) {
      const newUser = new User({
        companyName,
        email,
        password: hashedPwd
      });
      await newUser.save();
      return res.redirect('/');
    }
  }
});

module.exports = router;
