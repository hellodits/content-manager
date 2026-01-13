import { useState, useEffect } from 'react';
import client from '../api/client';
import { Post } from '../types/post';
import PostCard from '../components/PostCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LIMIT = 6;

export default function Preview() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await client.get('/article/Publish/', {
        params: { limit: LIMIT, offset },
      });
      setPosts(response.data || []);
      setTotal(response.data?.length >= LIMIT ? offset + LIMIT + 1 : offset + (response.data?.length || 0));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [offset]);

  const handlePrev = () => {
    setOffset((prev) => Math.max(0, prev - LIMIT));
  };

  const handleNext = () => {
    setOffset((prev) => prev + LIMIT);
  };

  const hasNext = posts.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Published Articles</h2>
        <p className="text-gray-500 text-sm mt-1">Browse all published content</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="font-medium text-zinc-900">No published articles</p>
          <p className="text-sm text-gray-400 mt-1">Publish your first article to see it here</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200/60 rounded-lg text-zinc-900 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
              Page {Math.floor(offset / LIMIT) + 1}
            </span>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200/60 rounded-lg text-zinc-900 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
