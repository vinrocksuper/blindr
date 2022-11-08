const models = require('../models');
const { makeProfile } = require('./Profile');

const { Account } = models;

const loginPage = (req, res) => res.render('login', { csrfToken: req.csrfToken() });

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields required' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/profile' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const age = `${req.body.age}`;
  if (!username || !pass || !pass2 || !age) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    console.log(req.body);
    return await makeProfile(req, res);
    // return
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  getToken,
};
