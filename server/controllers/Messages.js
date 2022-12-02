const models = require('../models');
const MessageModel = require('../models/Messages');

const { Messages } = models;

const createMessage = async (req, res) => {
  const content = `${req.body.content}`;
  const username = `${req.body.username}`;
  const channel = `${req.body.channel}`;
  try {
    const newMessage = new Messages({ content, username, channel });
    await newMessage.save();
    return res.status(201);
  } catch (e) {
    return res.status(400).json({ error: 'Something went wrong, please try again' });
  }
};

const fetchMessage = async (req, res) => {
  const { channel } = req.query;
  try {
    const messagesArr = await MessageModel.findByChannel(channel);
    return res.status(200).json({ messagesArr });
  } catch (e) {
    return res.status(400).json(e, 'something went wrong fetching message history');
  }
};

module.exports = {
  createMessage,
  fetchMessage,
};
