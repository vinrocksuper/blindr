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

  return MessageModel.find(search).select('content username createdDate').lean().exec(callback);
};

MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
