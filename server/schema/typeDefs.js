const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    location: String
    company: String
    token: String
    createdAt: Date
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Get currently logged‐in user
    me: User

    # Get any user by ID or username
    user(id: ID, username: String): User

    # Get all users
    users: [User!]!
  }

  type Mutation {
    # Create a new user (signup)
    addUser(username: String!, email: String!, password: String!): AuthPayload!

    # Login (returns auth token + user)
    login(email: String!, password: String!): AuthPayload!

    # Update user profile (must be authenticated)
    updateUser(
      username: String
      email: String
      password: String
      location: String
      company: String
    ): User!

    # Delete own account (authenticated)
    deleteUser: Boolean!
  }
`;

module.exports = typeDefs;
