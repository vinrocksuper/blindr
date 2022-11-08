const mongoose = require('mongoose');
const _ = require('underscore');

let ProfileModel = {};

const setName = (name) => _.escape(name).trim();

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 18,
    immutable: true,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  prompts: {
    type: String[9], // TODO make this dynamic
    required: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
});

ProfileSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

ProfileSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return ProfileModel.find(search).select('name age description prompts').lean().exec(callback);
};

ProfileModel = mongoose.model('Profile', ProfileSchema);

module.exports = ProfileModel;
