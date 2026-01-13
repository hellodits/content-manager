import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { Post } from '../types/post';
import Tabs from '../components/Tabs';
import PostTable from '../components/PostTable';

const tabs = [
  { id: 'Publish', label: 'Published' },
  { id: 'Draft', label: 'Drafts' },
  { id: 'Thrash', label: 'Trashed' },
];

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'Publish');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabFromUrl && ['Publish', 'Draft', 'Thrash'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchPosts = async (status: string) => {
    setLoading(true);
    try {
      const response = await client.get(`/article/${status}/`);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  const handleTrash = async (id: number) => {
    try {
      await client.put(`/article/${id}`, { status: 'Thrash' });
      fetchPosts(activeTab);
    } catch (error) {
      console.error('Failed to trash post:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your content</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
        <div className="p-4 border-b border-gray-200/60">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading posts...</p>
            </div>
          ) : (
            <PostTable posts={posts} onTrash={handleTrash} />
          )}
        </div>
      </div>
    </div>
  );
}
