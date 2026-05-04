import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import { notifyError, notifySuccess } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function NewThread() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryId: '', title: '', content: '', tags: '' });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get('/api/forum/categories', { auth: false });
        const values = unwrap(response, []);
        setCategories(values);
        if (values[0]) {
          setForm((prev) => ({ ...prev, categoryId: values[0].id }));
        }
      } catch (error) {
        notifyError(error.message);
      }
    }

    loadCategories();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/api/forum/threads', {
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
      });
      const thread = unwrap(response);
      notifySuccess('Thread created.');
      navigate(`/forum/${thread.category?.slug || 'general'}/${thread.slug}`);
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <main className="page-main">
      <form className="card" onSubmit={submit}>
        <h1>New Thread</h1>
        <label>
          Category
          <select value={form.categoryId} onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <Input
          id="title"
          label="Title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
        <label>
          Content
          <textarea className="code-editor" value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} />
        </label>
        <Input
          id="tags"
          label="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
        />
        <Button type="submit">Create Thread</Button>
      </form>
    </main>
  );
}
