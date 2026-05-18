import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/ngo/dashboard', label: 'Browse food', icon: '🔍', end: true },
  { to: '/reservations', label: 'My reservations', icon: '📋' },
  { to: '/foods', label: 'All listings', icon: '🥫' },
];

function NgoDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', location: '', urgency: '', search: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.search) params.append('search', filters.search);
      const { data } = await API.get(`/foods?${params.toString()}`);
      setFoods(data);
    } catch {
      showToast('Failed to load food listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReserve = async (food) => {
    if (!user.isVerified) {
      showToast('Your NGO account must be verified by admin before reserving', 'error');
      return;
    }
    try {
      await API.post('/reserve', { foodId: food._id });
      showToast('Reservation submitted! Awaiting donor approval.');
      navigate('/reservations');
    } catch (err) {
      showToast(err.response?.data?.message || 'Reservation failed', 'error');
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <DashboardLayout
      title="NGO Dashboard"
      subtitle={user?.organizationName || 'Find food donations near you'}
      links={links}
    >
      {!user.isVerified && <VerificationBanner />}

      <div className="stats-row">
        <StatCard icon="🌱" label="Food saved (your impact)" value={user?.foodSavedCount || 0} accent="green" />
        <StatCard icon="📦" label="Available nearby" value={foods.length} accent="orange" />
      </div>

      <section className="panel">
        <h2>Search & filter</h2>
        <form className="filter-bar" onSubmit={handleFilter}>
          <input
            placeholder="Search food or store..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All categories</option>
            <option value="packaged">Packaged</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
            <option value="produce">Produce</option>
            <option value="beverages">Beverages</option>
            <option value="frozen">Frozen</option>
          </select>
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <select
            value={filters.urgency}
            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
          >
            <option value="">All urgency</option>
            <option value="safe">Safe</option>
            <option value="near">Near expiry</option>
            <option value="urgent">Urgent pickup</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Apply
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Available donations</h2>
        {loading ? (
          <div className="page-center">
            <LoadingSpinner />
          </div>
        ) : foods.length === 0 ? (
          <p className="muted">No matching food listings right now. Check back soon!</p>
        ) : (
          <div className="cards-grid">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} showActions onReserve={handleReserve} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

function VerificationBanner() {
  return (
    <div className="alert alert-warning">
      Your NGO account is pending admin verification. You can browse listings but cannot reserve
      until verified.
    </div>
  );
}

export default NgoDashboard;
