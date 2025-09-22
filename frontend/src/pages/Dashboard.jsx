import React from 'react';
import StatsWidget from '../components/Features/StatsWidget';
import ComplianceStatus from '../components/Features/ComplianceStatus';
import RecentActivity from '../components/Features/RecentActivity';
import QuickActions from '../components/Features/QuickActions';
import { TrendingUp, FileCheck, Clock, Shield } from 'lucide-react';
import './Dashboard.css';
import { useAuth } from '../utils/auth';

const Dashboard = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user || !userProfile) {
    return <div>Please log in to view the dashboard.</div>;
  }

  const { stats, name } = userProfile;

  const dashboardStats = stats || {
    totalTests: 0,
    testsThisMonth: 0,
    averageTime: '0s',
    complianceRate: 0,
  };

  const complianceStats = {
    overall: { percentage: 0, total: 0, compliant: 0, color: '#2563eb', description: 'Overall compliance status' },
    device: { percentage: 0, total: 0, compliant: 0, color: '#10b981', description: 'Medical device compliance' },
  };

  const recentActivity = []; // Assuming recentActivity is fetched elsewhere or is empty initially

  const statsData = [
    {
      id: 'total',
      title: 'Total Test Cases',
      value: dashboardStats.totalTests,
      change: '+12%', // Placeholder, ideally calculated
      trend: 'up',    // Placeholder, ideally calculated
      icon: FileCheck,
      color: '#2563eb'
    },
    {
      id: 'monthly',
      title: 'This Month',
      value: dashboardStats.testsThisMonth,
      change: '+23%', // Placeholder
      trend: 'up',    // Placeholder
      icon: TrendingUp,
      color: '#10b981'
    },
    {
      id: 'avgtime',
      title: 'Avg. Generation Time',
      value: dashboardStats.averageTime,
      change: '-15%', // Placeholder
      trend: 'down',   // Placeholder
      icon: Clock,
      color: '#f59e0b'
    },
    {
      id: 'compliance',
      title: 'Compliance Rate',
      value: `${dashboardStats.complianceRate}%`,
      change: '+5%',  // Placeholder
      trend: 'up',     // Placeholder
      icon: Shield,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="dashboard fade-in">
      <div className="dashboard__header">
        <h1 className="dashboard__title">
          Welcome back, {name ? name.split(' ')[0] : 'User'}! 👋
        </h1>
        <p className="dashboard__subtitle">
          Here's an overview of your healthcare test case generation activity
        </p>
      </div>

      <QuickActions />

      <div className="dashboard__stats">
        <h2 className="dashboard__section-title">Overview</h2>
        <div className="dashboard__stats-grid">
          {statsData.map((stat) => (
            <StatsWidget key={stat.id} {...stat} />
          ))}
        </div>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__compliance">
          <h2 className="dashboard__section-title">Compliance Status</h2>
          <div className="dashboard__compliance-grid">
            {Object.entries(complianceStats).map(([key, data]) => (
              <ComplianceStatus
                key={key}
                title={data.title || key}
                percentage={data.percentage}
                total={data.total}
                compliant={data.compliant}
                color={data.color}
                description={data.description}
              />
            ))}
          </div>
        </div>

        <div className="dashboard__activity">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard
