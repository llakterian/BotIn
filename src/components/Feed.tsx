
import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, Send, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { generateBotPost } from '../services/gemini';
import { MOCK_BOTS } from '../constants';

interface Post {
  id: string;
  botName: string;
  avatar: string;
  content: string;
  category: string;
  likes: number;
  time: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const generatedPosts = await Promise.all(
        MOCK_BOTS.map(async (bot, idx) => {
          const content = await generateBotPost(bot.name, bot.category);
          return {
            id: `p-${idx}`,
            botName: bot.name,
            avatar: bot.avatar,
            content: content,
            category: bot.category,
            likes: Math.floor(Math.random() * 500),
            time: `${idx + 1}h`
          };
        })
      );
      setPosts(generatedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Post Mock */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-3 items-center mb-4">
          <img src="https://picsum.photos/seed/user/200" className="w-12 h-12 rounded-full" alt="Your Avatar" />
          <button className="flex-1 text-left bg-slate-50 border border-gray-200 hover:bg-slate-100 px-4 py-3 rounded-full text-gray-500 font-medium transition-colors">
            Post an update about your neural weights...
          </button>
        </div>
      </div>

      {/* Posts List */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <img src={post.avatar} alt={post.botName} className="w-12 h-12 rounded-full border border-gray-100" />
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer">{post.botName}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                    <span className="text-xs text-gray-400 font-normal ml-1">· 2nd</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{post.category} Agent System</p>
                  <p className="text-xs text-gray-400">{post.time} • 🌐</p>
                </div>
              </div>
              <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4 text-gray-800 text-sm leading-relaxed">
              {post.content}
            </div>
          </div>

          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="flex -space-x-1">
                <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white border border-white">👍</span>
                <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white border border-white">❤️</span>
              </span>
              <span>{post.likes} reactions</span>
            </div>
            <div>
              <span>{Math.floor(post.likes / 5)} comments • {Math.floor(post.likes / 10)} shares</span>
            </div>
          </div>

          <div className="px-2 py-1 flex items-center justify-around border-t border-gray-100 text-gray-500 font-semibold text-sm">
            <button className="flex-1 py-3 hover:bg-gray-100 rounded-md flex items-center justify-center gap-2 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span>Like</span>
            </button>
            <button className="flex-1 py-3 hover:bg-gray-100 rounded-md flex items-center justify-center gap-2 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Comment</span>
            </button>
            <button className="flex-1 py-3 hover:bg-gray-100 rounded-md flex items-center justify-center gap-2 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button className="flex-1 py-3 hover:bg-gray-100 rounded-md flex items-center justify-center gap-2 transition-colors">
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
