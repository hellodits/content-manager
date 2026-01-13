import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Bold, Italic, Underline, List, Link2 } from 'lucide-react';
import client from '../api/client';
import { PostFormData } from '../types/post';

const categories = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Business', label: 'Business' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Health', label: 'Health' },
  { value: 'Travel', label: 'Travel' },
];

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [originalStatus, setOriginalStatus] = useState<string>('Publish');
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    category: '',
    status: 'Draft',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await client.get(`/article/${id}`);
        const post = response.data;
        setOriginalStatus(post.status);
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          status: post.status === 'Publish' ? 'Publish' : 'Draft',
        });
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCancel = () => {
    navigate(`/?tab=${originalStatus}`);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.title.length < 20) {
      newErrors.title = 'Title must be at least 20 characters';
    }
    if (formData.content.length < 200) {
      newErrors.content = 'Content must be at least 200 characters';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (status: 'Publish' | 'Draft') => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await client.put(`/article/${id}`, { ...formData, status });
      navigate('/');
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Edit Post</h2>
          <p className="text-gray-500 text-sm mt-1">Update your content</p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2.5 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Input */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your title..."
              className="w-full text-3xl font-bold text-zinc-900 placeholder-gray-300 border-0 focus:outline-none focus:ring-0 p-0"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-2">{errors.title}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">{formData.title.length}/20 characters minimum</p>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            {/* Fake Toolbar */}
            <div className="flex items-center gap-1 p-3 border-b border-gray-200/60 bg-gray-50/50">
              <button type="button" className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button type="button" className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors">
                <List className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Link2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your content here..."
                rows={14}
                className="w-full text-zinc-900 placeholder-gray-300 border-0 focus:outline-none focus:ring-0 resize-none"
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-2">{errors.content}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">{formData.content.length}/200 characters minimum</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-5">
            <h3 className="font-semibold text-zinc-900 mb-4">Category</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-2">{errors.category}</p>
            )}
          </div>

          {/* Publish Actions */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-5">
            <h3 className="font-semibold text-zinc-900 mb-4">Publish</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit('Publish')}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Publishing...' : 'Publish Now'}
              </button>
              <button
                onClick={() => handleSubmit('Draft')}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-gray-100 text-zinc-900 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
