import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import { Card, Button, Badge } from '../components/ui';
import Input, { TextArea, Select } from '../components/ui/Input';
import { ArrowLeft, Send, Tag, MessageSquarePlus, FileText, Info, Sparkles, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewThread() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryId: '', title: '', content: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

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

  const selectedCategory = categories.find(c => c.id === form.categoryId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back Button */}
      <Link
        to="/forum"
        className="inline-flex items-center gap-2 text-sm text-[#5b5f97] transition hover:text-[#b8b8d1] group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Forum
      </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-8 border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-[#5b5f97]/20 rounded-xl">
            <MessageSquarePlus className="text-[#b8b8d1]" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Start a New Discussion</h1>
            <p className="text-[#a0a0b8] mt-1">Share your question or topic with the community</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
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
                placeholder="What's your question or topic?"
                required
                hint="Be specific and descriptive"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#a0a0b8]">
                    Content <span className="text-[#e74c3c]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className="flex items-center gap-1.5 text-xs text-[#5b5f97] hover:text-[#b8b8d1] transition"
                  >
                    <Eye size={14} />
                    {preview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {preview ? (
                  <div className="min-h-[176px] rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 prose prose-invert prose-sm max-w-none text-[#e0e0e0]">
                    {form.content || <span className="text-[#5b5f97]">Nothing to preview</span>}
                  </div>
                ) : (
                  <TextArea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your content here... Markdown is supported!"
                    className="h-44"
                    required
                  />
                )}
                <p className="mt-1.5 text-xs text-[#5b5f97]">Supports Markdown formatting</p>
              </div>

              <Input
                label="Tags (optional)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="javascript, async, promises"
                icon={Tag}
                hint="Separate tags with commas"
              />

              <div className="flex items-center gap-3 pt-4 border-t border-[#2a2a4a]">
                <Button type="submit" icon={Send} loading={submitting} className="!py-2.5">
                  {submitting ? 'Creating...' : 'Post Thread'}
                </Button>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Preview Card */}
          {(form.title || selectedCategory) && (
            <Card padding="p-4" className="border-[#5b5f97]/30">
              <h3 className="text-xs font-medium text-[#5b5f97] mb-3 flex items-center gap-1.5">
                <Sparkles size={12} /> Preview
              </h3>
              {selectedCategory && (
                <Badge variant="outline" className="mb-2" style={{ borderColor: selectedCategory.color }}>
                  {selectedCategory.name}
                </Badge>
              )}
              <p className="font-medium text-[#b8b8d1] line-clamp-2">
                {form.title || 'Your thread title...'}
              </p>
              {form.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.split(',').filter(t => t.trim()).slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs text-[#5b5f97]">#{tag.trim()}</span>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Tips Card */}
          <Card padding="p-4" className="bg-[#5b5f97]/5 border-[#5b5f97]/20">
            <h3 className="text-sm font-medium text-[#b8b8d1] mb-3 flex items-center gap-2">
              <Info size={14} className="text-[#5b5f97]" /> Posting Tips
            </h3>
            <ul className="space-y-2 text-xs text-[#a0a0b8]">
              <li className="flex items-start gap-2">
                <span className="text-[#2ecc71] mt-0.5">•</span>
                Be clear and specific in your title
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2ecc71] mt-0.5">•</span>
                Include code examples if relevant
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2ecc71] mt-0.5">•</span>
                Use tags to help others find your post
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2ecc71] mt-0.5">•</span>
                Be respectful to other community members
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
