import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/ui';
import Input from '../../components/ui/Input';
import { LogIn, Eye, EyeOff, Mail, Lock, BookOpen, Code, Trophy, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: BookOpen, title: 'Interactive Courses', desc: 'Learn web development step by step' },
  { icon: Code, title: 'Code Playground', desc: 'Practice coding in real-time' },
  { icon: Trophy, title: 'Take Exams', desc: 'Test your knowledge and earn badges' },
  { icon: Flame, title: 'Track Streaks', desc: 'Build consistency with daily streaks' },
];

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
<<<<<<< HEAD
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-[#2a2a4a] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Left Panel - Features */}
          <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
            
=======
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-lg border-l-2 border-l-[#5b5f97]" padding="p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5b5f97]/20 to-[#7c3aed]/10 shadow-[0_0_20px_rgba(91,95,151,0.15)]">
            <LogIn size={26} className="text-[#5b5f97]" />
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
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
            <div className="relative">
              <Link to="/" className="flex items-center gap-2 mb-12">
                <div className="p-2 bg-[#5b5f97]/20 rounded-xl">
                  <Code size={24} className="text-[#b8b8d1]" />
                </div>
                <span className="text-xl font-bold text-white">Edifix</span>
              </Link>
              
              <h2 className="text-3xl font-bold text-white mb-4">Welcome back to your learning journey</h2>
              <p className="text-[#a0a0b8] text-lg">Continue where you left off and keep building your skills.</p>
            </div>
            
            <div className="relative space-y-4 mt-8">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f1a]/50 backdrop-blur border border-[#2a2a4a] hover:border-[#5b5f97]/30 transition-colors group">
                  <div className="p-2.5 bg-[#5b5f97]/20 rounded-xl group-hover:bg-[#5b5f97]/30 transition-colors">
                    <feature.icon size={20} className="text-[#b8b8d1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#b8b8d1]">{feature.title}</p>
                    <p className="text-sm text-[#a0a0b8]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative mt-8 pt-6 border-t border-[#2a2a4a]">
              <p className="text-sm text-[#5b5f97]">Trusted by thousands of learners worldwide</p>
            </div>
          </div>
          
          {/* Right Panel - Login Form */}
          <div className="bg-[#0f0f1a] p-8 sm:p-12 flex flex-col justify-center">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="p-2 bg-[#5b5f97]/20 rounded-xl">
                <Code size={20} className="text-[#b8b8d1]" />
              </div>
              <span className="text-lg font-bold text-white">Edifix</span>
            </div>
            
            <div className="mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5b5f97]/20 to-[#5b5f97]/5 mb-4">
                <LogIn size={24} className="text-[#5b5f97]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Sign in to your account</h1>
              <p className="mt-2 text-[#a0a0b8]">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                icon={Mail}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-[#a0a0b8]">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b5f97]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] py-3 pl-11 pr-12 text-sm text-[#e0e0e0] placeholder-[#5b5f97]/60 outline-none transition-all duration-200 focus:border-[#5b5f97] focus:ring-2 focus:ring-[#5b5f97]/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#5b5f97] transition hover:text-[#b8b8d1] hover:bg-[#5b5f97]/10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                loading={submitting}
                icon={ArrowRight}
                className="w-full !py-3"
                size="lg"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#2a2a4a]"></div>
              <span className="text-xs text-[#5b5f97]">New to Edifix?</span>
              <div className="h-px flex-1 bg-[#2a2a4a]"></div>
            </div>

            <p className="mt-6 text-center">
              <Link to="/register" className="inline-flex items-center gap-2 font-medium text-[#5b5f97] transition hover:text-[#b8b8d1] group">
                Create an account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
