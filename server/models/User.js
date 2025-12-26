const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true},
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true,
           match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'] },
    password: { type: String, required: function() { return this.provider === 'local'; }, minlength: 6 },
    role: { type: String, enum: ['admin', 'scolarite', 'student'], default: 'student' },
    provider: { type: String, enum: ['local', 'google', 'github', 'linkedin'], default: 'local' },
    profileImage: { type: String, default: null },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
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

  // Methode pour mettre a jour la dernière connexion
  UserSchema.methods.updateLastLogin = function() {
    this.lastLogin = Date.now();
    return this.save();
  };


module.exports = mongoose.model('User', UserSchema);
