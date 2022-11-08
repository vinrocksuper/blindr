const models = require('../models');
const ProfileModel = require('../models/Profile');

const { Profile } = models;

const makeProfile = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'both name and age are required' });
  }
  const profileData = {
    name: req.body.name,
    age: req.body.age,
    user: req.session.account._id,
  };
  try {
    const newProfile = new Profile(profileData);
    await newProfile.save();
    return res.status(201).json({ name: newProfile.name, age: newProfile.age });
  } catch (err) {
    return res.status(400).json({ error: 'An error occurred', code: err.code });
  }
};

const profilePage = (req, res) => res.render('app');
const getProfile = (req, res) => ProfileModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    return res.status(400).json({ error: 'an error has occurred!', code: err.code });
  }
  return res.json({ profile: docs });
});

module.exports = {
  profilePage,
  makeProfile,
  getProfile,
};
