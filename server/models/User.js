const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['admin', 'scolarite', 'student'], default: 'student' },
    oauthId: { type: String, unique: true, sparse: true },
    oauthProvider: { type: String, enum: ['google', 'oauth2', 'github', null], default: null }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function save(next) {
  try {
    // Ne hasher le mot de passe que s'il est modifié ET qu'il existe
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
