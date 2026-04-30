import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '../../components/ui';
import Input from '../../components/ui/Input';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, Code, CheckCircle2, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const BENEFITS = [
  { icon: Sparkles, text: 'Access all courses for free' },
  { icon: Code, text: 'Practice with code playground' },
  { icon: Shield, text: 'Track your learning progress' },
  { icon: Zap, text: 'Earn badges and achievements' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = form;
    if (!password) return { width: '0%', color: '#2a2a4a', label: '' };
    if (password.length < 6) return { width: '33%', color: '#e74c3c', label: 'Weak' };
    if (password.length < 10) return { width: '66%', color: '#f39c12', label: 'Medium' };
    return { width: '100%', color: '#2ecc71', label: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

  return (
<<<<<<< HEAD
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-[#2a2a4a] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Left Panel - Benefits */}
          <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2ecc71]/5 rounded-full blur-2xl"></div>
            
=======
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-lg border-l-2 border-l-[#5b5f97]" padding="p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5b5f97]/20 to-[#7c3aed]/10 shadow-[0_0_20px_rgba(91,95,151,0.15)]">
            <UserPlus size={26} className="text-[#5b5f97]" />
          </div>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">Create an account</h1>
          <p className="mt-1 text-sm text-[#a0a0b8]">Start your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="johndoe"
            icon={User}
          />

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
              
              <Badge variant="success" className="mb-4">Free Forever</Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Start your web development journey today</h2>
              <p className="text-[#a0a0b8] text-lg">Join thousands of learners mastering HTML, CSS, JavaScript, and more.</p>
            </div>
            
            <div className="relative space-y-3 mt-8">
              <p className="text-sm font-medium text-[#b8b8d1] mb-4">What you'll get:</p>
              {BENEFITS.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#0f0f1a]/50 backdrop-blur border border-[#2a2a4a]">
                  <div className="p-2 bg-[#2ecc71]/20 rounded-lg">
                    <benefit.icon size={16} className="text-[#2ecc71]" />
                  </div>
                  <p className="text-[#b8b8d1]">{benefit.text}</p>
                </div>
              ))}
            </div>
            
            <div className="relative mt-8 pt-6 border-t border-[#2a2a4a] flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5b5f97] to-[#b8b8d1] border-2 border-[#1a1a2e] flex items-center justify-center text-xs font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#a0a0b8]">Join <span className="text-[#b8b8d1] font-medium">2,500+</span> learners</p>
            </div>
          </div>
          
          {/* Right Panel - Registration Form */}
          <div className="bg-[#0f0f1a] p-8 sm:p-10 flex flex-col justify-center">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="p-2 bg-[#5b5f97]/20 rounded-xl">
                <Code size={20} className="text-[#b8b8d1]" />
              </div>
              <span className="text-lg font-bold text-white">Edifix</span>
            </div>
            
            <div className="mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2ecc71]/20 to-[#2ecc71]/5 mb-4">
                <UserPlus size={24} className="text-[#2ecc71]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
              <p className="mt-2 text-[#a0a0b8]">It only takes a minute to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="johndoe"
                icon={User}
              />

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
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#5b5f97] transition hover:text-[#b8b8d1] hover:bg-[#5b5f97]/10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#a0a0b8]">Password strength</span>
                      <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 bg-[#2a2a4a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}></div>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                icon={Lock}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={submitting}
                  icon={ArrowRight}
                  className="w-full !py-3"
                  size="lg"
                >
                  {submitting ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
            </form>
            
            <p className="mt-4 text-xs text-center text-[#5b5f97]">
              By signing up, you agree to our Terms of Service
            </p>
            
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#2a2a4a]"></div>
              <span className="text-xs text-[#5b5f97]">Already a member?</span>
              <div className="h-px flex-1 bg-[#2a2a4a]"></div>
            </div>

            <p className="mt-4 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 font-medium text-[#5b5f97] transition hover:text-[#b8b8d1] group">
                Sign in to your account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
