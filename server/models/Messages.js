const mongoose = require('mongoose');

let MessageModel = {};

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
  channel: {
    type: String,
    required: true,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  content: doc.content,
  user: doc.user,
  createdDate: doc.createdDate,
});

MessageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    username: mongoose.Types.ObjectId(ownerId),
  };

  return MessageModel.find(search).select('content username createdDate channel').lean().exec(callback);
};

MessageSchema.statics.findByChannel = (query) => MessageModel.find({ channel: query }).select('content username').lean();

MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
