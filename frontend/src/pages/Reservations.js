import { useEffect, useState } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import UrgencyBadge from '../components/UrgencyBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/expiry';

function Reservations() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await API.get('/reservations');
      setItems(data);
    } catch {
      showToast('Failed to load reservations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (id) => {
    try {
      await API.put(`/approve/${id}`);
      showToast('Reservation approved');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const complete = async (id) => {
    try {
      await API.put(`/reservations/${id}/complete`);
      showToast('Pickup marked complete — food saved!');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not complete', 'error');
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
    <div className="page container">
      <div className="page-header">
        <h1>Reservations</h1>
        <p>Track pickup requests and approvals</p>
      </div>

      {items.length === 0 ? (
        <p className="muted">No reservations yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Store</th>
                <th>Expiry</th>
                <th>Pickup</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r._id}>
                  <td>
                    <strong>{r.foodListing?.foodName}</strong>
                    <br />
                    <UrgencyBadge
                      expiryDate={r.foodListing?.expiryDate}
                      level={r.foodListing?.urgencyLevel}
                    />
                  </td>
                  <td>{r.foodListing?.storeName}</td>
                  <td>{formatDate(r.foodListing?.expiryDate)}</td>
                  <td>{r.foodListing?.pickupLocation}</td>
                  <td>
                    <span className={`status-pill status-${r.status}`}>{r.status}</span>
                  </td>
                  <td className="table-actions">
                    {user.role === 'donor' && r.status === 'pending' && (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => approve(r._id)}>
                        Approve
                      </button>
                    )}
                    {r.status === 'approved' && (
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => complete(r._id)}>
                        Mark picked up
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reservations;
