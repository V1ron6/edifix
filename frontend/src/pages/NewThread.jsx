import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../services/api';
import { PageHeader, Card, Button } from '../components/ui';
import Input, { TextArea, Select } from '../components/ui/Input';
import { ArrowLeft, Send, Tag, MessageSquarePlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewThread() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryId: '', title: '', content: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    forumAPI.getCategories()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.title.trim() || !form.content.trim()) {
      toast.error('Fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const { data } = await forumAPI.createThread({
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        tags,
      });
      toast.success('Thread created');
      navigate(`/forum/t/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create thread');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-[#5b5f97] transition hover:text-[#b8b8d1]"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <PageHeader
        title="New Thread"
        description="Start a discussion with the community"
      />

      <Card padding="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            className="w-full"
            required
          />

          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Thread title"
            required
          />

          <TextArea
            label="Content (Markdown supported)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your content here..."
            className="h-44"
            required
          />

          <Input
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="javascript, async, promises"
            icon={Tag}
          />

          <div className="flex items-center gap-3 border-t border-[#2a2a4a] pt-4">
            <Button type="submit" icon={Send} loading={submitting}>
              {submitting ? 'Creating...' : 'Create Thread'}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
