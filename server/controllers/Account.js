const models = require('../models');

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

    return res.json({ redirect: '/app' });
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
    return res.json({ redirect: '/editProfile' });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const homePage = (req, res) => { res.render('app', { csrfToken: req.csrfToken() }); };

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const getUsername = (req, res) => {
  Account.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'an error has occurred!', code: err.code });
    }

    return res.json({ docs });
  });
};

const passwordHelper = async (req, oldPass) => {
  const isMatching = await Account.checkPass(req.session.account._id, oldPass);

  return isMatching;
};

const editPassword = async (req, res) => {
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;
  const toCompare = await passwordHelper(req, oldPass);

  if (!toCompare) {
    return res.status(401).json({ error: 'Incorrect Password' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(newPass);
    Account.updateOne({ user: req.session.account._id }, { password: hash }, (err, docs) => {
      if (err) console.log(err);
      else {
        console.log('updated password: ', docs, hash);
      }
    });
    return res.status(200).json({ message: 'success' });
  } catch (e) {
    return res.status(400).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  loginPage,
  homePage,
  logout,
  login,
  signup,
  getToken,
  getUsername,
  editPassword,
};
