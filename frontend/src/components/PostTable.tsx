import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Post } from '../types/post';

interface PostTableProps {
  posts: Post[];
  onTrash: (id: number) => void;
}

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-50 text-blue-700',
  Business: 'bg-emerald-50 text-emerald-700',
  Lifestyle: 'bg-purple-50 text-purple-700',
  Health: 'bg-rose-50 text-rose-700',
  Travel: 'bg-amber-50 text-amber-700',
};

const statusColors: Record<string, string> = {
  Publish: 'bg-green-50 text-green-700',
  Draft: 'bg-gray-100 text-gray-600',
  Thrash: 'bg-red-50 text-red-600',
};

export default function PostTable({ posts, onTrash }: PostTableProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="font-medium">No posts found</p>
        <p className="text-sm text-gray-400 mt-1">Create your first post to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200/60">
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Title</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr 
              key={post.id} 
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="text-zinc-900 font-medium">{post.title}</span>
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                  {post.category}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[post.status] || 'bg-gray-100 text-gray-600'}`}>
                  {post.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/edit/${post.id}`}
                    className="p-2 text-gray-500 hover:text-zinc-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onTrash(post.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Trash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
