import { Post } from '../types/post';
import { ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

const gradients: Record<string, string> = {
  Technology: 'from-blue-500 to-indigo-600',
  Business: 'from-emerald-500 to-teal-600',
  Lifestyle: 'from-purple-500 to-pink-600',
  Health: 'from-rose-500 to-red-600',
  Travel: 'from-amber-500 to-orange-600',
};

export default function PostCard({ post }: PostCardProps) {
  const gradient = gradients[post.category] || 'from-gray-500 to-gray-600';

  return (
    <article className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-4">
          <span className="inline-flex px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-zinc-900 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-zinc-900 mb-2 line-clamp-2 group-hover:text-zinc-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
          {post.content}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <button className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors">
            Read More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
