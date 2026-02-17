import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/ui';
import Input from '../../components/ui/Input';
import { LogIn, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md" padding="p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b5f97]/10">
            <LogIn size={24} className="text-[#5b5f97]" />
          </div>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#a0a0b8]">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            icon={Mail}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b5f97]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] py-2.5 pl-9 pr-10 text-sm text-[#e0e0e0] placeholder-[#5b5f97]/60 outline-none transition-colors duration-200 focus:border-[#5b5f97] focus:shadow-[0_0_0_3px_rgba(91,95,151,0.1)]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#5b5f97] transition hover:text-[#b8b8d1]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            loading={submitting}
            icon={LogIn}
            className="w-full"
            size="lg"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#a0a0b8]">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[#5b5f97] transition hover:text-[#b8b8d1]">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
