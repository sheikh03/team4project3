require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const mongoose = require('mongoose');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Once the DB connection is open:
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌍 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
