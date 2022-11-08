const models = require('../models');
const domoModel = require('../models/Domo');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'both name and age are required' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };
  console.log(domoData);
  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    // return res.json({ redirect: '/maker' });
    return res.status(201).json({ name: newDomo.name, age: newDomo.age });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const makerPage = (req, res) => res.render('app');
const getDomos = (req, res) => domoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error has occurred!' });
  }
  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
