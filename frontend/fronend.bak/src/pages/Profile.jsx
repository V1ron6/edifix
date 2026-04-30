import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, progressAPI } from '../services/api';
import { Card, Button, Avatar, TabGroup, Badge } from '../components/ui';
import Input from '../components/ui/Input';
import { User, Save, Lock, Eye, EyeOff, Shield, Bell as BellIcon, Mail, Settings, Award, Calendar, TrendingUp, BookOpen, Flame, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '',
    notificationsEnabled: user?.notificationsEnabled ?? true,
    emailRemindersEnabled: user?.emailRemindersEnabled ?? true,
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch user stats
    progressAPI.getOverview()
      .then(({ data }) => setStats(data.data))
      .catch(() => {});
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profile);
      updateUser(data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const memberDays = user?.createdAt 
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        {/* Profile Banner */}
        <div className="h-24 bg-gradient-to-r from-[#5b5f97]/30 to-[#b8b8d1]/20"></div>
        
        <div className="relative px-8 pb-8 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="relative">
              <Avatar src={profile.avatar} username={user?.username} size="xl" className="ring-4 ring-[#0f0f1a] w-24 h-24" />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#2ecc71] rounded-full border-2 border-[#0f0f1a]">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{user?.username || 'User'}</h1>
                <Badge variant="info" className="text-xs">
                  <Award size={12} className="mr-1" /> Member
                </Badge>
              </div>
              <p className="text-sm text-[#a0a0b8]">{user?.email}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-[#5b5f97]">
                  <Calendar size={14} />
                  Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
                <span className="flex items-center gap-1.5 text-[#a0a0b8]">
                  <TrendingUp size={14} className="text-[#2ecc71]" />
                  {memberDays} days learning
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-[#0f0f1a]/50 backdrop-blur rounded-xl border border-[#2a2a4a]">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-[#5b5f97]" />
                  <span className="text-xs text-[#a0a0b8]">Courses</span>
                </div>
                <p className="text-2xl font-bold text-[#b8b8d1]">{stats.enrolledCourses || 0}</p>
              </div>
              <div className="p-4 bg-[#0f0f1a]/50 backdrop-blur rounded-xl border border-[#2a2a4a]">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-[#2ecc71]" />
                  <span className="text-xs text-[#a0a0b8]">Completed</span>
                </div>
                <p className="text-2xl font-bold text-[#2ecc71]">{stats.completedLessons || 0}</p>
              </div>
              <div className="p-4 bg-[#0f0f1a]/50 backdrop-blur rounded-xl border border-[#2a2a4a]">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-[#f39c12]" />
                  <span className="text-xs text-[#a0a0b8]">Streak</span>
                </div>
                <p className="text-2xl font-bold text-[#f39c12]">{stats.currentStreak || 0}<span className="text-sm ml-1">days</span></p>
              </div>
              <div className="p-4 bg-[#0f0f1a]/50 backdrop-blur rounded-xl border border-[#2a2a4a]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-[#3498db]" />
                  <span className="text-xs text-[#a0a0b8]">Progress</span>
                </div>
                <p className="text-2xl font-bold text-[#3498db]">{stats.overallProgress || 0}<span className="text-sm ml-1">%</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <TabGroup
        tabs={[
          { value: 'profile', label: 'Profile', icon: User },
          { value: 'password', label: 'Security', icon: Shield },
          { value: 'preferences', label: 'Preferences', icon: Settings },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'profile' && (
        <Card padding="p-6">
          <div className="flex items-center gap-2 mb-6">
            <User size={20} className="text-[#5b5f97]" />
            <h2 className="text-lg font-semibold text-[#b8b8d1]">Profile Information</h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                icon={Mail}
                hint="Email cannot be changed"
              />
              <Input
                label="Username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                icon={User}
              />
            </div>
            <Input
              label="Avatar URL"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              hint="Enter a URL to an image for your profile picture"
            />

            {profile.avatar && (
              <div className="flex items-center gap-4 p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a4a]">
                <Avatar src={profile.avatar} username={profile.username} size="lg" />
                <div>
                  <p className="text-sm font-medium text-[#b8b8d1]">Preview</p>
                  <p className="text-xs text-[#a0a0b8]">This is how your avatar will appear</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[#2a2a4a]">
              <Button type="submit" loading={saving} icon={Save}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {tab === 'password' && (
        <Card padding="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-[#5b5f97]" />
            <h2 className="text-lg font-semibold text-[#b8b8d1]">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <Input
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
              icon={Lock}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                icon={Lock}
                hint="Minimum 6 characters"
              />
              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
                icon={Lock}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#a0a0b8] cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 rounded accent-[#5b5f97]"
              />
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPassword ? 'Hide' : 'Show'} passwords
            </label>
            <div className="flex justify-end pt-4 border-t border-[#2a2a4a]">
              <Button type="submit" loading={saving} icon={Lock}>
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {tab === 'preferences' && (
        <Card padding="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={20} className="text-[#5b5f97]" />
            <h2 className="text-lg font-semibold text-[#b8b8d1]">Notification Preferences</h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] hover:border-[#5b5f97]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#5b5f97]/20 rounded-lg">
                    <BellIcon size={18} className="text-[#5b5f97]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#b8b8d1]">In-app Notifications</p>
                    <p className="text-xs text-[#a0a0b8]">Receive notifications within the app</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notificationsEnabled}
                    onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2a2a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b5f97]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] hover:border-[#5b5f97]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#5b5f97]/20 rounded-lg">
                    <Mail size={18} className="text-[#5b5f97]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#b8b8d1]">Email Reminders</p>
                    <p className="text-xs text-[#a0a0b8]">Receive reminder emails for your learning schedule</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.emailRemindersEnabled}
                    onChange={(e) => setProfile({ ...profile, emailRemindersEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2a2a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b5f97]"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#2a2a4a]">
              <Button type="submit" loading={saving} icon={Save}>
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
