const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [bookSchema]
  }

    type Book {
    bookId: String
    authors: [authors]
    description: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
  }


`;

module.exports = typeDefs;