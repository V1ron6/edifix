import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { PageHeader, Card, Button, Avatar, TabGroup } from '../components/ui';
import Input from '../components/ui/Input';
import { User, Save, Lock, Eye, EyeOff, Shield, Bell as BellIcon, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

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

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar src={profile.avatar} username={user?.username} size="xl" />
        <div>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">{user?.username || 'User'}</h1>
          <p className="text-sm text-[#a0a0b8]">{user?.email}</p>
          <p className="mt-1 text-xs text-[#5b5f97]">
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      <TabGroup
        tabs={[
          { value: 'profile', label: 'Profile' },
          { value: 'password', label: 'Security' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'profile' ? (
        <Card padding="p-6">
          <form onSubmit={handleProfileSave} className="space-y-5">
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              icon={Mail}
            />
            <Input
              label="Username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              icon={User}
            />
            <Input
              label="Avatar URL"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />

            <div className="space-y-3 rounded-lg bg-[#1a1a2e] p-4">
              <p className="mb-2 text-sm font-medium text-[#b8b8d1]">Preferences</p>
              <label className="flex items-center gap-3 text-sm text-[#a0a0b8]">
                <input
                  type="checkbox"
                  checked={profile.notificationsEnabled}
                  onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5b5f97]"
                />
                <BellIcon size={14} className="text-[#5b5f97]" />
                Enable in-app notifications
              </label>
              <label className="flex items-center gap-3 text-sm text-[#a0a0b8]">
                <input
                  type="checkbox"
                  checked={profile.emailRemindersEnabled}
                  onChange={(e) => setProfile({ ...profile, emailRemindersEnabled: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#5b5f97]"
                />
                <Mail size={14} className="text-[#5b5f97]" />
                Enable email reminders
              </label>
            </div>

            <Button type="submit" loading={saving} icon={Save}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      ) : (
        <Card padding="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Shield size={18} className="text-[#5b5f97]" />
            <h2 className="font-semibold text-[#b8b8d1]">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Input
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#a0a0b8]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 rounded accent-[#5b5f97]"
              />
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPassword ? 'Hide' : 'Show'} passwords
            </label>
            <Button type="submit" loading={saving} icon={Lock}>
              {saving ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
