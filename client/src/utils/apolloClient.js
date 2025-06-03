import {
    ApolloClient,
    InMemoryCache,
    createHttpLink
  } from '@apollo/client';
  import { setContext } from '@apollo/client/link/context';
  
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  });
  
  // Attach JWT (if present) to each request’s headers
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  
  export default client;  