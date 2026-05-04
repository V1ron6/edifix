import { useState } from 'react';
import Avatar from '../../components/shared/Avatar';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '',
    notificationsEnabled: user?.notificationsEnabled ?? true,
    emailRemindersEnabled: user?.emailRemindersEnabled ?? true,
  });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put('/api/auth/profile', profile);
      const nextUser = response.user || response.data || user;
      setUser(nextUser);
      notifySuccess('Profile updated.');
    } catch (error) {
      notifyError(error.message);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    try {
      await api.put('/api/auth/password', password);
      notifySuccess('Password changed.');
      setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <main className="page-main">
      <section className="card">
        <Avatar username={user?.username || 'U'} src={user?.avatar} size={68} />
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
        <p>{user?.role}</p>
      </section>

      <form className="card" onSubmit={updateProfile}>
        <h3>Edit Profile</h3>
        <Input id="username" label="Username" value={profile.username} onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))} />
        <Input id="avatar" label="Avatar URL" value={profile.avatar} onChange={(e) => setProfile((prev) => ({ ...prev, avatar: e.target.value }))} />
        <label>
          <input type="checkbox" checked={profile.notificationsEnabled} onChange={(e) => setProfile((prev) => ({ ...prev, notificationsEnabled: e.target.checked }))} />
          Notifications enabled
        </label>
        <label>
          <input type="checkbox" checked={profile.emailRemindersEnabled} onChange={(e) => setProfile((prev) => ({ ...prev, emailRemindersEnabled: e.target.checked }))} />
          Email reminders enabled
        </label>
        <Button type="submit">Save Profile</Button>
      </form>

      <form className="card" onSubmit={updatePassword}>
        <h3>Change Password</h3>
        <Input id="currentPassword" label="Current password" type="password" value={password.currentPassword} onChange={(e) => setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))} />
        <Input id="newPassword" label="New password" type="password" value={password.newPassword} onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))} />
        <Input id="confirmNewPassword" label="Confirm password" type="password" value={password.confirmNewPassword} onChange={(e) => setPassword((prev) => ({ ...prev, confirmNewPassword: e.target.value }))} />
        <Button type="submit" variant="secondary">Change Password</Button>
      </form>
    </main>
  );
}
