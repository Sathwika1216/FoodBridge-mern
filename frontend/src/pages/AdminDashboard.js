import { useEffect, useState } from 'react';
import API from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const links = [{ to: '/admin/dashboard', label: 'Admin panel', icon: '⚙️', end: true }];

function AdminDashboard() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        API.get('/users'),
        API.get('/admin/analytics'),
      ]);
      setUsers(usersRes.data);
      setAnalytics(analyticsRes.data);
    } catch {
      showToast('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (id) => {
    try {
      await API.put(`/verify-user/${id}`);
      showToast('NGO verified');
      load();
    } catch {
      showToast('Verification failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform management" links={links}>
      <div className="stats-row">
        <StatCard icon="👥" label="Total users" value={analytics?.totalUsers || 0} />
        <StatCard icon="🥫" label="Listings" value={analytics?.totalListings || 0} accent="green" />
        <StatCard icon="📋" label="Reservations" value={analytics?.totalReservations || 0} accent="orange" />
        <StatCard icon="🌱" label="Food saved" value={analytics?.totalFoodSaved || 0} accent="green" />
      </div>

      <section className="panel">
        <h2>User management</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Location</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.location || '—'}</td>
                  <td>{u.isVerified ? '✅' : '⏳'}</td>
                  <td>
                    {u.role === 'ngo' && !u.isVerified && (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => verify(u._id)}>
                        Verify NGO
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;
