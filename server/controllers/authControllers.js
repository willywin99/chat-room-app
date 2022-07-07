const User = require('../models/User');

module.exports.signup = async (req, res) => {
  console.log('req.body', req.body);
  const {name, email, password} = req.body;
  try {
    const user = await User.create({name, email, password});
    res.status(201).json({user});
  } catch (error) {
    console.log(error);
    res.status(400).send('Fail to create user');
  }
}

module.exports.login = (req, res) => {
  res.send('login');
}

module.exports.logout = (req, res) => {
  res.send('logout');
}