const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find({});
    }
  },

    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },

    Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const isPasswordCorrect = await user.isCorrectPassword(password);

      if (!isPasswordCorrect) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
     addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        ).populate('savedBooks');

        return user;
      }

      throw new AuthenticationError('Not logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');

        return user;
      }

      throw new AuthenticationError('Not logged in!');
    },
  }
};

module.exports = resolvers;