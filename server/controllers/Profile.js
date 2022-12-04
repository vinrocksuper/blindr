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
    description: req.body.desc,
    user: req.session.account._id,
  };
  try {
    const newProfile = new Profile(profileData);
    await newProfile.save();
    return res.json({ redirect: '/profile' });
  } catch (err) {
    return res.status(400).json({ error: 'An error occurred', code: err.code });
  }
};

const editProfile = async (req, res) => {
  const profileData = {};
  if (req.body.name !== ' ' && req.body.name) {
    profileData.name = req.body.name;
  }
  if (req.body.desc) {
    profileData.description = req.body.desc;
  }
  if (req.body.premium) {
    profileData.premium = req.body.premium;
  }
  try {
    Profile.updateOne(
      { user: req.session.account._id },
      profileData,
      (err, docs) => {
        if (err) console.log(err);
        else {
          console.log('updated docs: ', docs);
        }
      },
    );
    return res.status(200).json({
      name: profileData.name,
      description: profileData.description,
      premium: profileData.premium,
    });
  } catch (e) {
    return res.status(400).json({ error: 'An error has occurred' });
  }
};

const profilePage = (req, res) => res.render('profile');
const editProfilePage = (req, res) => res.render('ftue');
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
  editProfile,
  editProfilePage,
};
