import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, Button, Avatar } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Eye, Tag, ExternalLink, Share2, Check, BookOpen, Calendar, User, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ArticleView() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await articleAPI.getBySlug(slug);
        setArticle(data.data);
      } catch {
        toast.error('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingScreen main="Loading article" secondary={slug?.replace(/-/g, ' ')} />;
  if (!article) return <p className="py-12 text-center text-[#a0a0b8]">Article not found.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/articles" className="text-[#5b5f97] hover:text-[#b8b8d1] transition">
          Articles
        </Link>
        <ChevronRight size={14} className="text-[#5b5f97]" />
        <span className="text-[#a0a0b8] capitalize truncate max-w-[200px]">{article.category}</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b8b8d1]/5 rounded-full blur-2xl"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="primary" className="capitalize">{article.category}</Badge>
            <span className="text-xs text-[#5b5f97]">•</span>
            <span className="flex items-center gap-1 text-xs text-[#5b5f97]">
              <Clock size={12} />{article.readTimeMinutes} min read
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-6">{article.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar src={article.author?.avatar} username={article.author?.username || 'Admin'} size="md" />
              <div>
                <p className="font-medium text-[#b8b8d1]">{article.author?.username || 'Admin'}</p>
                <div className="flex items-center gap-3 text-xs text-[#a0a0b8]">
                  {article.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye size={12} />{article.viewCount?.toLocaleString() || 0} views
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              size="sm" 
              icon={copied ? Check : Share2} 
              onClick={handleShare}
              className="shrink-0"
            >
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag size={10} className="mr-1.5" />{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Content */}
      <Card padding="p-8 md:p-10">
        <div className="prose prose-invert prose-lg max-w-none text-[#e0e0e0] prose-headings:text-[#b8b8d1] prose-headings:font-bold prose-a:text-[#5b5f97] prose-a:no-underline hover:prose-a:underline prose-code:text-[#b8b8d1] prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-[#2a2a4a] prose-pre:rounded-xl prose-img:rounded-xl prose-blockquote:border-l-[#5b5f97] prose-blockquote:bg-[#5b5f97]/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-li:marker:text-[#5b5f97]">
          <ReactMarkdown>{article.content || 'No content available.'}</ReactMarkdown>
        </div>
      </Card>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Source */}
        {article.source && (
          <Card padding="px-4 py-3" className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#a0a0b8]">Original Source</span>
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#5b5f97] transition hover:text-[#b8b8d1] group"
              >
                {article.source.replace(/^https?:\/\//, '').split('/')[0]}
                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </Card>
        )}
        
        {/* Back to Articles */}
        <Link to="/articles">
          <Button variant="ghost" icon={ArrowLeft}>
            Back to Articles
          </Button>
        </Link>
      </div>
    </div>
  );
}
