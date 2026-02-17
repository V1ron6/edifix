import { useState, useEffect } from 'react';
import { reminderAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Button, EmptyState, Badge } from '../components/ui';
import Input, { TextArea } from '../components/ui/Input';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Clock, X, Calendar, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', message: '', reminderTime: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5], type: 'study', sendEmail: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReminders = async () => {
    try {
      const { data } = await reminderAPI.getAll();
      setReminders(data.data || []);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReminders(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSubmitting(true);
    try {
      await reminderAPI.create({
        ...form,
        reminderTime: form.reminderTime + ':00',
      });
      toast.success('Reminder created');
      setShowForm(false);
      setForm({ title: '', message: '', reminderTime: '09:00', daysOfWeek: [1, 2, 3, 4, 5], type: 'study', sendEmail: false });
      fetchReminders();
    } catch {
      toast.error('Failed to create reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await reminderAPI.toggle(id);
      fetchReminders();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const handleDelete = async (id) => {
    try {
      await reminderAPI.delete(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      toast.success('Reminder deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }));
  };

  if (loading) return <LoadingScreen main="Loading reminders" secondary="Fetching your schedule" />;

  const activeCount = reminders.filter((r) => r.isActive).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Reminders"
        description={`${activeCount} active reminder${activeCount !== 1 ? 's' : ''}`}
        actions={
          <Button
            icon={showForm ? X : Plus}
            variant={showForm ? 'secondary' : 'primary'}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'New Reminder'}
          </Button>
        }
      />

      {/* Create Form */}
      {showForm && (
        <Card highlight padding="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Daily Study Reminder"
              required
            />
            <Input
              label="Message (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Time to learn something new"
            />
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">Time</label>
                <input
                  type="time"
                  value={form.reminderTime}
                  onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
                  className="rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] px-4 py-2.5 text-sm text-[#e0e0e0] outline-none transition focus:border-[#5b5f97]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">Days</label>
                <div className="flex gap-1">
                  {DAYS.map((label, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 ${
                        form.daysOfWeek.includes(i)
                          ? 'bg-[#5b5f97] text-white shadow-[0_0_8px_rgba(91,95,151,0.3)]'
                          : 'bg-[#1a1a2e] text-[#a0a0b8] hover:bg-[#2a2a4a]'
                      }`}
                    >
                      {label[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#a0a0b8]">
              <input
                type="checkbox"
                checked={form.sendEmail}
                onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })}
                className="h-4 w-4 rounded accent-[#5b5f97]"
              />
              <Mail size={14} className="text-[#5b5f97]" />
              Send email reminder
            </label>
            <Button type="submit" loading={submitting} icon={Plus}>
              {submitting ? 'Creating...' : 'Create Reminder'}
            </Button>
          </form>
        </Card>
      )}

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No reminders yet"
          description="Create a reminder to stay on track with your learning goals."
          action={!showForm && (
            <Button icon={Plus} onClick={() => setShowForm(true)}>Create Reminder</Button>
          )}
        />
      ) : (
        <div className="space-y-2">
          {reminders.map((rem) => (
            <Card key={rem.id} hover className="flex items-center gap-4" padding="p-4">
              <button
                onClick={() => handleToggle(rem.id)}
                className="shrink-0 transition-transform hover:scale-110"
              >
                {rem.isActive ? (
                  <ToggleRight size={24} className="text-[#2ecc71]" />
                ) : (
                  <ToggleLeft size={24} className="text-[#a0a0b8]" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${rem.isActive ? 'text-[#b8b8d1]' : 'text-[#a0a0b8] line-through'}`}>
                  {rem.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-[#5b5f97]">
                    <Clock size={10} />
                    {rem.reminderTime?.slice(0, 5)}
                  </span>
                  <span className="flex items-center gap-1 text-[#a0a0b8]">
                    <Calendar size={10} />
                    {rem.daysOfWeek?.map((d) => DAYS[d]).join(', ')}
                  </span>
                  {rem.sendEmail && (
                    <Badge variant="outline" className="text-[10px]">
                      <Mail size={8} className="mr-1" /> Email
                    </Badge>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(rem.id)}
                className="shrink-0 rounded-md p-1.5 text-[#a0a0b8] transition hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
              >
                <Trash2 size={14} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
