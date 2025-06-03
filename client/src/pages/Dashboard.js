import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      location
      company
    }
  }
`;

function Dashboard() {
  const { loading, error, data } = useQuery(GET_ME);

  if (loading) return <p>Loading your data…</p>;
  if (error) return <p>Error loading data</p>;

  const user = data.me;

  return (
    <section className="dashboard-page">
      <h1>Welcome, {user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Location: {user.location}</p>
      <p>Company: {user.company}</p>
      {/* You can add more features: e.g. render posts, tasks, a form to update profile, etc. */}
    </section>
  );
}

export default Dashboard;
