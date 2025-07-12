const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: null },
  profilePhoto: { type: String, default: null },
  isPublic: { type: Boolean, default: true },
  skillsOffered: { type: [String], default: [] },
  skillsWanted: { type: [String], default: [] },
  availability: { type: [String], default: [] },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  ratings: [{
    rating: { type: Number },
    comment: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);