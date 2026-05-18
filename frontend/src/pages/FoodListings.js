import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import FoodCard from '../components/FoodCard';
import SkeletonCard from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function FoodListings() {
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
      Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
      const { data } = await API.get(`/foods?${params.toString()}`);
      setFoods(data);
    } catch {
      showToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReserve = async (food) => {
    if (user.role !== 'ngo') {
      showToast('Only NGOs can reserve food', 'error');
      return;
    }
    try {
      await API.post('/reserve', { foodId: food._id });
      showToast('Reservation submitted!');
      navigate('/reservations');
    } catch (err) {
      showToast(err.response?.data?.message || 'Reservation failed', 'error');
    }
  };

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Food Listings</h1>
        <p>Browse safe surplus food available for donation pickup</p>
      </div>

      <form
        className="filter-bar"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          placeholder="Search..."
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
          <option value="urgent">Urgent</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
      </form>

      {loading ? (
        <LoadingGrid />
      ) : (
        <div className="cards-grid">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              showActions={user?.role === 'ngo'}
              onReserve={user?.role === 'ngo' ? handleReserve : undefined}
            />
          ))}
        </div>
      )}
      {!loading && foods.length === 0 && (
        <p className="muted page-center">No listings match your filters.</p>
      )}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="cards-grid">
      {[1, 2, 3].map((n) => (
        <SkeletonCard key={n} />
      ))}
    </div>
  );
}

export default FoodListings;
