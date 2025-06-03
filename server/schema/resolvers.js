const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // "me" returns current user, if token is valid
    me: async (parent, args, context) => {
      if (context.user) {
        const foundUser = await User.findById(context.user._id);
        return foundUser;
      }
      throw new AuthenticationError('Not authenticated');
    },
    // get a user by ID or username
    user: async (parent, { id, username }) => {
      if (id) {
        return User.findById(id);
      }
      if (username) {
        return User.findOne({ username });
      }
      return null;
    },
    // get all users
    users: async () => {
      return User.find({})
        .sort({ createdAt: -1 });
    }
  },

  Mutation: {
    // Signup: create user, sign JWT, return payload
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // Login: verify email + password, sign JWT, return payload
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }
      const valid = await user.isCorrectPassword(password);
      if (!valid) {
        throw new AuthenticationError('Incorrect password');
      }
      const token = signToken(user);
      return { token, user };
    },
    // Update user (authenticated)
    updateUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      // Only allow updating certain fields
      const { username, email, password, location, company } = args;
      const updates = {};
      if (username) updates.username = username;
      if (email) updates.email = email;
      if (password) updates.password = password;
      if (location) updates.location = location;
      if (company) updates.company = company;

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        updates,
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    // Delete own account
    deleteUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      const result = await User.findByIdAndDelete(context.user._id);
      return !!result;
    }
  }
};

module.exports = resolvers;
