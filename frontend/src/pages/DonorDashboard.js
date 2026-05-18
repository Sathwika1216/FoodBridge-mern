import { useEffect, useState } from 'react';
import API from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/donor/dashboard', label: 'Overview', icon: '📊', end: true },
  { to: '/foods', label: 'All Listings', icon: '🥫' },
  { to: '/reservations', label: 'Reservations', icon: '📋' },
];

const emptyForm = {
  foodName: '',
  category: 'packaged',
  quantity: '',
  unit: 'items',
  expiryDate: '',
  pickupLocation: '',
  storeName: '',
  contactPhone: '',
  imageUrl: '',
  isAvailable: true,
};

function DonorDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const [statsRes, foodsRes] = await Promise.all([
        API.get('/foods/stats/summary'),
        API.get(`/foods?donorId=${user._id}`),
      ]);
      setStats(statsRes.data);
      setFoods(foodsRes.data);
    } catch {
      showToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      if (editingId) {
        await API.put(`/foods/${editingId}`, payload);
        showToast('Listing updated');
      } else {
        await API.post('/foods', payload);
        showToast('Food listing created');
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setForm({
      foodName: food.foodName,
      category: food.category,
      quantity: food.quantity,
      unit: food.unit,
      expiryDate: food.expiryDate?.slice(0, 10),
      pickupLocation: food.pickupLocation,
      storeName: food.storeName,
      contactPhone: food.contactPhone,
      imageUrl: food.imageUrl || '',
      isAvailable: food.isAvailable,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (food) => {
    if (!window.confirm(`Remove "${food.foodName}"?`)) return;
    try {
      await API.delete(`/foods/${food._id}`);
      showToast('Listing removed');
      load();
    } catch {
      showToast('Failed to remove listing', 'error');
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
    <DashboardLayout
      title="Donor Dashboard"
      subtitle={user?.organizationName || 'Manage your food donations'}
      links={links}
    >
      <div className="stats-row">
        <StatCard icon="🥫" label="Total donations" value={stats?.totalDonations || 0} accent="green" />
        <StatCard icon="✅" label="Available" value={stats?.available || 0} />
        <StatCard icon="📦" label="Reserved" value={stats?.reserved || 0} accent="orange" />
        <StatCard icon="🌱" label="Food saved (units)" value={stats?.totalFoodSaved || 0} accent="green" />
      </div>

      <section className="panel">
        <h2>{editingId ? 'Edit listing' : 'Add food donation'}</h2>
        <p className="panel-note">Only sealed/unopened packaged or safe raw non-expired food.</p>
        <form className="food-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Food name *
              <input value={form.foodName} onChange={update('foodName')} required />
            </label>
            <label>
              Category *
              <select value={form.category} onChange={update('category')}>
                <option value="packaged">Packaged</option>
                <option value="dairy">Dairy</option>
                <option value="bakery">Bakery</option>
                <option value="produce">Produce</option>
                <option value="beverages">Beverages</option>
                <option value="frozen">Frozen</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Quantity *
              <input type="number" min="1" value={form.quantity} onChange={update('quantity')} required />
            </label>
            <label>
              Unit
              <input value={form.unit} onChange={update('unit')} placeholder="items, kg, boxes" />
            </label>
            <label>
              Expiry date *
              <input type="date" value={form.expiryDate} onChange={update('expiryDate')} required />
            </label>
            <label>
              Pickup location *
              <input value={form.pickupLocation} onChange={update('pickupLocation')} required />
            </label>
            <label>
              Store name *
              <input value={form.storeName} onChange={update('storeName')} required />
            </label>
            <label>
              Contact phone *
              <input value={form.contactPhone} onChange={update('contactPhone')} required />
            </label>
            <label className="span-2">
              Image URL (optional)
              <input value={form.imageUrl} onChange={update('imageUrl')} placeholder="https://..." />
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isAvailable} onChange={update('isAvailable')} />
              Available for reservation
            </label>
          </div>
          <FormActions
            editingId={editingId}
            submitting={submitting}
            onCancel={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          />
        </form>
      </section>

      <section className="panel">
        <h2>Your listings</h2>
        {foods.length === 0 ? (
          <p className="muted">No listings yet. Add your first donation above.</p>
        ) : (
          <div className="cards-grid">
            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                showActions
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

function FormActions({ editingId, submitting, onCancel }) {
  return (
    <div className="form-actions">
      {editingId && (
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel edit
        </button>
      )}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving...' : editingId ? 'Update listing' : 'Publish listing'}
      </button>
    </div>
  );
}

export default DonorDashboard;
