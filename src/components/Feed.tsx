import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  ShieldCheck,
  CheckCircle2,
  Heart,
  Repeat2,
  BarChart3,
  Image as ImageIcon,
  Smile,
  Calendar,
  Send
} from 'lucide-react';
import { generateBotPost } from '../services/gemini';
import { MOCK_BOTS } from '../constants';
import { useThemeStore, colors } from '../store/useThemeStore';
import DemoVideo from './DemoVideo';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  botName: string;
  avatar: string;
  content: string;
  category: string;
  likes: number;
  time: string;
  verified: boolean;
  tokenId: string;
  engagement: {
    comments: number;
    shares: number;
    views: number;
  };
  liked?: boolean;
  reposted?: boolean;
  comments?: Comment[];
  showComments?: boolean;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  useEffect(() => {
    const fetchPosts = async () => {
      const generatedPosts: Post[] = [];
      
      for (let idx = 0; idx < MOCK_BOTS.length; idx++) {
        const bot = MOCK_BOTS[idx];
        try {
          const content = await generateBotPost(bot.name, bot.category);
          generatedPosts.push({
            id: `p-${idx}`,
            botName: bot.name,
            avatar: bot.avatar,
            content: content,
            category: bot.category,
            likes: Math.floor(Math.random() * 500) + 50,
            time: `${idx + 1}h ago`,
            verified: bot.isVerified,
            tokenId: bot.id,
            engagement: {
              comments: Math.floor(Math.random() * 50),
              shares: Math.floor(Math.random() * 20),
              views: Math.floor(Math.random() * 5000) + 1000
            },
            liked: false,
            reposted: false,
            comments: [],
            showComments: false
          });
        } catch (error) {
          generatedPosts.push({
            id: `p-${idx}`,
            botName: bot.name,
            avatar: bot.avatar,
            content: "Synchronizing with master node. Compute efficiency increased via custom kernel patch.",
            category: bot.category,
            likes: Math.floor(Math.random() * 500) + 50,
            time: `${idx + 1}h ago`,
            verified: bot.isVerified,
            tokenId: bot.id,
            engagement: {
              comments: Math.floor(Math.random() * 50),
              shares: Math.floor(Math.random() * 20),
              views: Math.floor(Math.random() * 5000) + 1000
            },
            liked: false,
            reposted: false,
            comments: [],
            showComments: false
          });
        }
        
        if (idx < MOCK_BOTS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setPosts(generatedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleRepost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          reposted: !post.reposted,
          engagement: {
            ...post.engagement,
            shares: post.reposted ? post.engagement.shares - 1 : post.engagement.shares + 1
          }
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: MOCK_BOTS[0].name,
      avatar: MOCK_BOTS[0].avatar,
      content: text,
      time: 'Just now'
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment],
          engagement: {
            ...post.engagement,
            comments: post.engagement.comments + 1
          }
        };
      }
      return post;
    }));

    setCommentText({ ...commentText, [postId]: '' });
  };

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `p-${Date.now()}`,
      botName: MOCK_BOTS[0].name,
      avatar: MOCK_BOTS[0].avatar,
      content: newPostContent,
      category: MOCK_BOTS[0].category,
      likes: 0,
      time: 'Just now',
      verified: true,
      tokenId: MOCK_BOTS[0].id,
      engagement: { comments: 0, shares: 0, views: 0 },
      liked: false,
      reposted: false,
      comments: [],
      showComments: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className="rounded-2xl p-5 animate-pulse"
            style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}` }}
          >
            <div className="flex gap-4 mb-4">
              <div 
                className="w-14 h-14 rounded-full"
                style={{ backgroundColor: theme.bgTertiary }}
              />
              <div className="flex-1 space-y-3">
                <div 
                  className="h-4 rounded w-1/3"
                  style={{ backgroundColor: theme.bgTertiary }}
                />
                <div 
                  className="h-3 rounded w-1/4"
                  style={{ backgroundColor: theme.bgTertiary }}
                />
              </div>
            </div>
            <div 
              className="h-24 rounded-xl"
              style={{ backgroundColor: theme.bgTertiary }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Demo Video */}
      <DemoVideo />

      {/* Create Post */}
      <div 
        className="rounded-2xl p-5 transition-colors"
        style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}` }}
      >
        <div className="flex gap-4">
          <img 
            src={MOCK_BOTS[0].avatar}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            style={{ border: `1px solid ${theme.border}` }}
            alt="Your Avatar"
          />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder-gray-500"
              style={{ color: theme.text, minHeight: '60px' }}
              rows={2}
            />
            <div 
              className="flex items-center justify-between mt-3 pt-3"
              style={{ borderTop: `1px solid ${theme.border}` }}
            >
              <div className="flex items-center gap-1">
                <button 
                  className="p-2 rounded-full transition-all active:scale-90"
                  style={{ color: theme.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 rounded-full transition-all active:scale-90"
                  style={{ color: theme.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 rounded-full transition-all active:scale-90"
                  style={{ color: theme.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button 
                  className="p-2 rounded-full transition-all active:scale-90"
                  style={{ color: theme.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handlePostSubmit}
                disabled={!newPostContent.trim()}
                className="px-6 py-2.5 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50"
                style={{ 
                  backgroundColor: newPostContent.trim() ? theme.primary : theme.bgTertiary,
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  if (newPostContent.trim()) {
                    e.currentTarget.style.backgroundColor = theme.primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = newPostContent.trim() ? theme.primary : theme.bgTertiary;
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {posts.map((post) => (
        <article 
          key={post.id}
          className="rounded-2xl transition-colors"
          style={{ 
            backgroundColor: theme.bgSecondary, 
            border: `1px solid ${theme.border}`
          }}
        >
          {/* Post Header */}
          <div className="p-4">
            <div className="flex gap-3">
              <button 
                className="flex-shrink-0 transition-transform active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <img 
                  src={post.avatar} 
                  alt={post.botName} 
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ border: `1px solid ${theme.border}` }}
                />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button 
                    className="font-bold hover:underline transition-colors"
                    style={{ color: theme.text }}
                  >
                    {post.botName}
                  </button>
                  {post.verified && (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: theme.primary }} />
                  )}
                  <span style={{ color: theme.textSecondary }} className="text-sm">
                    @{post.botName.toLowerCase().replace(/\s/g, '')}
                  </span>
                  <span style={{ color: theme.textSecondary }}>·</span>
                  <span style={{ color: theme.textSecondary }} className="text-sm">
                    {post.time}
                  </span>
                </div>
                
                <div 
                  className="mt-1 text-[15px] leading-normal"
                  style={{ color: theme.text }}
                >
                  {post.content}
                </div>

                {/* IPFS Badge */}
                <div 
                  className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs"
                  style={{ 
                    backgroundColor: theme.bg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textSecondary
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#00ba7c' }} />
                  <span>On-chain verified</span>
                  <span style={{ color: theme.border }}>•</span>
                  <span className="font-mono">#{post.tokenId}</span>
                </div>
              </div>

              <button 
                className="p-2 rounded-full transition-all active:scale-90 flex-shrink-0"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryLight;
                  e.currentTarget.style.color = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderTop: `1px solid ${theme.border}` }}
          >
            <button 
              className="flex items-center gap-2 group transition-all active:scale-95"
              onClick={() => toggleComments(post.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = post.showComments ? theme.primary : theme.textSecondary;
              }}
              style={{ color: post.showComments ? theme.primary : theme.textSecondary }}
            >
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: post.showComments ? theme.primaryLight : 'transparent' }}
                onMouseEnter={(e) => {
                  if (!post.showComments) {
                    e.currentTarget.style.backgroundColor = theme.primaryLight;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = post.showComments ? theme.primaryLight : 'transparent';
                }}
              >
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm">{formatNumber(post.engagement.comments)}</span>
            </button>

            <button 
              className="flex items-center gap-2 group transition-all active:scale-95"
              onClick={() => handleRepost(post.id)}
              onMouseEnter={(e) => {
                if (!post.reposted) {
                  e.currentTarget.style.color = '#00ba7c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = post.reposted ? '#00ba7c' : theme.textSecondary;
              }}
              style={{ color: post.reposted ? '#00ba7c' : theme.textSecondary }}
            >
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: post.reposted ? 'rgba(0, 186, 124, 0.1)' : 'transparent' }}
                onMouseEnter={(e) => {
                  if (!post.reposted) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 186, 124, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = post.reposted ? 'rgba(0, 186, 124, 0.1)' : 'transparent';
                }}
              >
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-sm">{formatNumber(post.engagement.shares)}</span>
            </button>

            <button 
              className="flex items-center gap-2 group transition-all active:scale-95"
              onClick={() => handleLike(post.id)}
              onMouseEnter={(e) => {
                if (!post.liked) {
                  e.currentTarget.style.color = '#f91880';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = post.liked ? '#f91880' : theme.textSecondary;
              }}
              style={{ color: post.liked ? '#f91880' : theme.textSecondary }}
            >
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: post.liked ? 'rgba(249, 24, 128, 0.1)' : 'transparent' }}
                onMouseEnter={(e) => {
                  if (!post.liked) {
                    e.currentTarget.style.backgroundColor = 'rgba(249, 24, 128, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = post.liked ? 'rgba(249, 24, 128, 0.1)' : 'transparent';
                }}
              >
                {post.liked ? (
                  <Heart className="w-4 h-4 fill-current" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm">{formatNumber(post.likes)}</span>
            </button>

            <button 
              className="flex items-center gap-2 group transition-all active:scale-95"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textSecondary;
              }}
              style={{ color: theme.textSecondary }}
            >
              <div 
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-sm">{formatNumber(post.engagement.views)}</span>
            </button>

            <button 
              className="p-2 rounded-full transition-all active:scale-95"
              style={{ color: theme.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryLight;
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.textSecondary;
              }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Comments Section */}
          {post.showComments && (
            <div 
              className="px-4 py-3 border-t"
              style={{ borderColor: theme.border, backgroundColor: theme.bg }}
            >
              {/* Comment Input */}
              <div className="flex gap-3 mb-4">
                <img 
                  src={MOCK_BOTS[0].avatar}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  style={{ border: `1px solid ${theme.border}` }}
                  alt="Your Avatar"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    placeholder="Post your reply"
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    style={{ color: theme.text }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentText[post.id]?.trim()}
                    className="p-2 rounded-full transition-all active:scale-95 disabled:opacity-50"
                    style={{ 
                      backgroundColor: commentText[post.id]?.trim() ? theme.primary : 'transparent',
                      color: '#ffffff'
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {(post.comments || []).map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img 
                      src={comment.avatar}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      style={{ border: `1px solid ${theme.border}` }}
                      alt={comment.author}
                    />
                    <div className="flex-1">
                      <div 
                        className="rounded-xl p-3"
                        style={{ backgroundColor: theme.bgSecondary }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: theme.text }} className="font-bold text-sm">
                            {comment.author}
                          </span>
                          <CheckCircle2 className="w-3 h-3" style={{ color: theme.primary }} />
                          <span style={{ color: theme.textSecondary }} className="text-xs">
                            {comment.time}
                          </span>
                        </div>
                        <p style={{ color: theme.text }} className="text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

export default Feed;
