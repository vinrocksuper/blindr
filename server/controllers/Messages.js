const models = require('../models');

const { Messages } = models;

const createMessage = async (req, res) => {
  const content = `${req.body.content}`;
  const username = `${req.body.username};`;
  try {
    const newMessage = new Messages({ content, username });
    await newMessage.save();
    return res.status(201);
  } catch (e) {
    return res.status(400).json({ error: 'Something went wrong, please try again' });
  }
};

module.exports = {
  createMessage,
};
