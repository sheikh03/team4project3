const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+@.+\..+/, 'Must use a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    location: {
      type: String
    },
    company: {
      type: String
    }
    // ... any other user fields
  },
  {
    toJSON: {
      virtuals: true
    },
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    // bcrypt
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Compare incoming plaintext password with hashed
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
