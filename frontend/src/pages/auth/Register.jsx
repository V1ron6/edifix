import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/api/auth/register', form, { auth: false });
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;
      login(token, user);
      notifySuccess('Welcome to Edifix!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      notifyError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Create Account</h1>
        <Input
          id="username"
          label="Username"
          placeholder="learner123"
          value={form.username}
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Account'}</Button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
}
