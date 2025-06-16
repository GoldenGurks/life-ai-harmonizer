
import React from 'react';
import Layout from '@/components/Layout';
import ReturningUserDashboard from '@/components/dashboard/ReturningUserDashboard';

/**
 * Home/Dashboard page component for returning users
 * Shows personalized weekly plan, nutrition progress, and trending recipes
 */
const Index = () => {
  return (
    <Layout>
      <ReturningUserDashboard />
    </Layout>
  );
};

export default Index;
