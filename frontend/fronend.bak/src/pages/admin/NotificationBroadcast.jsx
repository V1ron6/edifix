import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../../components/ui';
import { TextArea, Select } from '../../components/ui/Input';
import {
  ArrowLeft, Bell, Send, Users, Shield, Megaphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NOTIFICATION_TYPES = [
  { value: 'system', label: 'System Announcement' },
  { value: 'new_course', label: 'New Course' },
  { value: 'new_feature', label: 'New Feature' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'promotion', label: 'Promotion' },
];

export default function NotificationBroadcast() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    type: 'system',
    title: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      await adminAPI.broadcastNotification(form);
      toast.success('Notification broadcast sent!');
      setForm({ type: 'system', title: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Shield size={48} className="mb-4 text-[#e74c3c]" />
        <h1 className="text-xl font-bold text-[#b8b8d1]">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link 
          to="/admin" 
          className="mb-2 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]"
        >
          <ArrowLeft size={14} /> Back to Admin
        </Link>
        <h1 className="text-2xl font-bold text-[#b8b8d1]">Broadcast Notification</h1>
        <p className="mt-1 text-sm text-[#a0a0b8]">Send a notification to all users</p>
      </div>

      {/* Warning */}
      <Card className="border-[#f39c12]/30 bg-[#f39c12]/5">
        <div className="flex items-start gap-3">
          <Megaphone size={20} className="mt-0.5 shrink-0 text-[#f39c12]" />
          <div>
            <p className="text-sm font-medium text-[#f39c12]">Broadcast to All Users</p>
            <p className="mt-1 text-xs text-[#a0a0b8]">
              This will send a notification to every registered user. Use this feature responsibly.
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="space-y-5">
          <Select
            label="Notification Type"
            options={NOTIFICATION_TYPES}
            value={form.type}
            onChange={handleChange('type')}
            className="w-full"
          />

          <Input
            label="Title"
            placeholder="e.g., New Course Available!"
            icon={Bell}
            value={form.title}
            onChange={handleChange('title')}
            error={errors.title}
          />

          <TextArea
            label="Message"
            placeholder="Write your notification message..."
            rows={4}
            value={form.message}
            onChange={handleChange('message')}
            error={errors.message}
          />

          <div className="flex justify-end gap-3 border-t border-[#2a2a4a] pt-5">
            <Link to="/admin">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" icon={Send} loading={sending}>
              Send Broadcast
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
