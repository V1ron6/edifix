import { useState, useEffect } from 'react';
import { reminderAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, EmptyState, Badge } from '../components/ui';
import Input from '../components/ui/Input';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Clock, X, Calendar, Mail, AlarmClock, Repeat, Zap, Target, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

  // Quick stats
  const emailReminders = reminders.filter((r) => r.sendEmail).length;
  const weekdayReminders = reminders.filter((r) => 
    r.daysOfWeek?.length === 5 && 
    r.daysOfWeek?.every((d, i) => d === [1, 2, 3, 4, 5][i])
  ).length;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-8 border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#5b5f97]/20 rounded-xl">
                <AlarmClock className="text-[#b8b8d1]" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Reminders</h1>
                <p className="text-[#a0a0b8]">Stay consistent with your learning goals</p>
              </div>
            </div>
            
            <Button
              icon={showForm ? X : Plus}
              variant={showForm ? 'secondary' : 'primary'}
              onClick={() => setShowForm(!showForm)}
              className="shrink-0"
            >
              {showForm ? 'Cancel' : 'New Reminder'}
            </Button>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#5b5f97]" />
              <span className="text-[#b8b8d1] font-medium">{reminders.length}</span>
              <span className="text-[#a0a0b8] text-sm">Total</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#2ecc71]" />
              <span className="text-[#b8b8d1] font-medium">{activeCount}</span>
              <span className="text-[#a0a0b8] text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#3498db]" />
              <span className="text-[#b8b8d1] font-medium">{emailReminders}</span>
              <span className="text-[#a0a0b8] text-sm">With Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card highlight padding="p-6" className="border-[#5b5f97]/30">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={20} className="text-[#5b5f97]" />
            <h2 className="text-lg font-semibold text-[#b8b8d1]">Create New Reminder</h2>
          </div>
          <form onSubmit={handleCreate} className="space-y-5">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Daily Study Reminder"
              required
              icon={Bell}
            />
            <Input
              label="Message (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Time to learn something new"
              hint="This message will be shown in your notification"
            />
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#a0a0b8]">
                  <Clock size={14} className="inline mr-1.5" />
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={form.reminderTime}
                  onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
                  className="w-full rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] px-4 py-3 text-sm text-[#e0e0e0] outline-none transition focus:border-[#5b5f97] focus:ring-2 focus:ring-[#5b5f97]/20"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-[#a0a0b8]">
                  <Repeat size={14} className="inline mr-1.5" />
                  Repeat on Days
                </label>
                <div className="flex gap-1.5">
                  {DAYS.map((label, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(i)}
                      title={FULL_DAYS[i]}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                        form.daysOfWeek.includes(i)
                          ? 'bg-[#5b5f97] text-white shadow-[0_0_12px_rgba(91,95,151,0.4)]'
                          : 'bg-[#1a1a2e] text-[#a0a0b8] hover:bg-[#2a2a4a] hover:text-[#b8b8d1] border border-[#2a2a4a]'
                      }`}
                    >
                      {label[0]}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#5b5f97]">
                  {form.daysOfWeek.length === 0 && 'Select at least one day'}
                  {form.daysOfWeek.length === 7 && 'Every day'}
                  {form.daysOfWeek.length > 0 && form.daysOfWeek.length < 7 && 
                    form.daysOfWeek.map(d => DAYS[d]).join(', ')
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] hover:border-[#5b5f97]/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3498db]/20 rounded-lg">
                  <Mail size={18} className="text-[#3498db]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#b8b8d1]">Email Notifications</p>
                  <p className="text-xs text-[#a0a0b8]">Also receive this reminder via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a4a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b5f97]"></div>
              </label>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[#2a2a4a]">
              <Button type="submit" loading={submitting} icon={Plus}>
                {submitting ? 'Creating...' : 'Create Reminder'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <EmptyState
          icon={AlarmClock}
          title="No reminders yet"
          description="Create a reminder to stay on track with your learning goals."
          action={!showForm && (
            <Button icon={Plus} onClick={() => setShowForm(true)}>Create Reminder</Button>
          )}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-medium text-[#a0a0b8]">Your Reminders</h3>
            <span className="text-xs text-[#5b5f97]">{activeCount} active</span>
          </div>
          
          {reminders.map((rem) => (
            <Card 
              key={rem.id} 
              hover 
              className={`group transition-all duration-200 ${rem.isActive ? '' : 'opacity-60'}`} 
              padding="p-0"
            >
              <div className="flex items-center gap-4 p-4">
                <button
                  onClick={() => handleToggle(rem.id)}
                  className="shrink-0 transition-transform hover:scale-110"
                >
                  {rem.isActive ? (
                    <div className="p-2 bg-[#2ecc71]/20 rounded-xl">
                      <ToggleRight size={24} className="text-[#2ecc71]" />
                    </div>
                  ) : (
                    <div className="p-2 bg-[#2a2a4a] rounded-xl">
                      <ToggleLeft size={24} className="text-[#a0a0b8]" />
                    </div>
                  )}
                </button>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-medium ${rem.isActive ? 'text-[#b8b8d1]' : 'text-[#a0a0b8] line-through'}`}>
                      {rem.title}
                    </p>
                    {rem.sendEmail && (
                      <Badge variant="info" className="text-[10px] py-0">
                        <Mail size={10} className="mr-1" /> Email
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-[#5b5f97]">
                      <Clock size={14} />
                      <span className="font-medium">{rem.reminderTime?.slice(0, 5)}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#a0a0b8]">
                      <Calendar size={14} />
                      {rem.daysOfWeek?.length === 7 
                        ? 'Every day' 
                        : rem.daysOfWeek?.map((d) => DAYS[d]).join(', ')
                      }
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(rem.id)}
                  className="shrink-0 p-2 rounded-xl text-[#a0a0b8] transition-all hover:bg-[#e74c3c]/10 hover:text-[#e74c3c] opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Quick Tips */}
      {reminders.length > 0 && (
        <Card padding="p-4" className="bg-[#5b5f97]/5 border-[#5b5f97]/20">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-[#5b5f97] shrink-0" />
            <p className="text-sm text-[#a0a0b8]">
              <span className="text-[#b8b8d1] font-medium">Tip:</span> Consistency is key! 
              Set reminders for the same time each day to build a strong learning habit.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
