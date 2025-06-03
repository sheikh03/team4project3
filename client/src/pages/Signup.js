import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { signToken } from '../utils/auth'; // helper to store token

const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

function Signup({ navigate }) {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [addUser, { data, loading, error }] = useMutation(ADD_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState }
      });
      const token = data.addUser.token;
      signToken(token);
      // after signup, redirect to dashboard
      window.location.assign('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="auth-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleFormSubmit} className="auth-form">
        <input
          name="username"
          type="text"
          placeholder="Your username"
          value={formState.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={formState.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="******"
          value={formState.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          Sign Up
        </button>
      </form>
      {error && <p className="error-text">{error.message}</p>}
    </section>
  );
}

export default Signup;
