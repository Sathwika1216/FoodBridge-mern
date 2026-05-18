import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    organizationName: '',
    location: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      showToast('Please fill required fields', 'error');
      return;
    }
    if (form.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const data = await register(form);
      showToast('Account created successfully!');
      if (data.role === 'donor') navigate('/donor/dashboard');
      else navigate('/ngo/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1>Join FoodBridge</h1>
        <p className="auth-sub">Reduce waste. Feed communities.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <label>
              Full name *
              <input value={form.name} onChange={update('name')} required />
            </label>
            <label>
              Email *
              <input type="email" value={form.email} onChange={update('email')} required />
            </label>
          </div>
          <label>
            Password * (min 6 characters)
            <input type="password" value={form.password} onChange={update('password')} required />
          </label>
          <label>
            I am a *
            <select value={form.role} onChange={update('role')}>
              <option value="donor">Food Donor (Store / Business)</option>
              <option value="ngo">NGO / Charity Receiver</option>
            </select>
          </label>
          <label>
            Organization / Store name
            <input value={form.organizationName} onChange={update('organizationName')} />
          </label>
          <div className="form-row">
            <label>
              Location / City
              <input value={form.location} onChange={update('location')} placeholder="City, Area" />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={update('phone')} />
            </label>
          </div>
          <div className="policy-note">
            <strong>Platform rules:</strong> Only sealed/unopened packaged food and safe raw
            non-expired items. No opened, homemade, or cooked leftovers.
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? <LoadingSpinner size="sm" label="" /> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
