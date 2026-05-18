import { useEffect, useState } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

function Notifications() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await API.get('/notifications');
      setItems(data);
    } catch {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    load();
  };

  const markAll = async () => {
    await API.put('/notifications/read-all');
    load();
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
      <div className="page-header row-between">
        <div>
          <h1>Notifications</h1>
          <p>Reservations, new food alerts, and updates</p>
        </div>
        {items.some((n) => !n.read) && (
          <button type="button" className="btn btn-outline" onClick={markAll}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {items.length === 0 ? (
          <p className="muted">No notifications yet.</p>
        ) : (
          items.map((n) => (
            <article
              key={n._id}
              className={`notification-item ${n.read ? 'read' : 'unread'}`}
              onClick={() => !n.read && markRead(n._id)}
              onKeyDown={(e) => e.key === 'Enter' && !n.read && markRead(n._id)}
              role="button"
              tabIndex={0}
            >
              <span className={`notif-type notif-${n.type}`}>{n.type}</span>
              <div>
                <h3>{n.title}</h3>
                <p>{n.message}</p>
                <time>{new Date(n.createdAt).toLocaleString()}</time>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
