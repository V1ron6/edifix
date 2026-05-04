import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const [form, setForm] = useState({ email: '', password: '' });
	const [submitting, setSubmitting] = useState(false);

	const redirectTo = location.state?.from || '/dashboard';

	const onSubmit = async (event) => {
		event.preventDefault();
		setSubmitting(true);
		try {
			const response = await api.post('/api/auth/login', form, { auth: false });
			const token = response.token || response.data?.token;
			const user = response.user || response.data?.user;
			login(token, user);
			notifySuccess('Welcome back!');
			navigate(redirectTo, { replace: true });
		} catch (error) {
			notifyError(error.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<main className="auth-page">
			<form className="auth-card" onSubmit={onSubmit}>
				<h1>Edifix</h1>
				<Input
					id="email"
					label="Email"
					type="email"
					placeholder="you@example.com"
					value={form.email}
					onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
					required
				/>
				<Input
					id="password"
					label="Password"
					type="password"
					placeholder="••••••••"
					value={form.password}
					onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
					required
				/>
				<Button type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</Button>
				<p>Need an account? <Link to="/register">Register</Link></p>
			</form>
		</main>
	);
}