const mongoose = require('mongoose');

let ProfileModel = {};

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: function omitEmptyString(v) { // copied from https://github.com/Automattic/mongoose/issues/10924
      console.log(v);
      if (this instanceof mongoose.Query /* only run on queries */ && v === '') {
        return undefined;
      }
      return v;
    },
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
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  premium: {
    type: Boolean,
    default: false,
    setDefaultsOnInsert: false,
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
  premium: doc.premium,
});

ProfileSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    user: mongoose.Types.ObjectId(ownerId),
  };

  return ProfileModel.find(search).select('name age description premium').lean().exec(callback);
};

ProfileModel = mongoose.model('Profile', ProfileSchema);

module.exports = ProfileModel;
