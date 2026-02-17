import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Badge, Button } from '../components/ui';
import { Avatar } from '../components/ui';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Eye, Tag, ExternalLink, Share2, Copy, Check } from 'lucide-react';
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
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link to="/articles" className="flex items-center gap-1.5 text-sm text-[#5b5f97] transition hover:text-[#b8b8d1]">
          <ArrowLeft size={14} /> Back to articles
        </Link>
        <Button variant="ghost" size="sm" icon={copied ? Check : Share2} onClick={handleShare}>
          {copied ? 'Copied' : 'Share'}
        </Button>
      </div>

      {/* Header */}
      <div>
        <Badge variant="primary" className="mb-3 capitalize">{article.category}</Badge>
        <h1 className="text-3xl font-bold leading-tight text-[#b8b8d1]">{article.title}</h1>

        <div className="mt-4 flex items-center gap-3">
          <Avatar name={article.author?.username || 'Admin'} size={32} />
          <div>
            <p className="text-sm font-medium text-[#e0e0e0]">{article.author?.username || 'Admin'}</p>
            <div className="flex items-center gap-3 text-xs text-[#a0a0b8]">
              {article.publishedAt && (
                <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              )}
              <span className="flex items-center gap-1"><Clock size={12} />{article.readTimeMinutes} min read</span>
              <span className="flex items-center gap-1"><Eye size={12} />{article.viewCount?.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag size={10} className="mr-1" />{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <Card padding="p-6 md:p-8">
        <div className="prose prose-invert max-w-none text-[#e0e0e0] prose-headings:text-[#b8b8d1] prose-a:text-[#5b5f97] prose-code:text-[#b8b8d1] prose-code:bg-[#1a1a2e] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-[#1a1a2e] prose-pre:border prose-pre:border-[#2a2a4a] prose-pre:rounded-lg prose-img:rounded-lg prose-blockquote:border-l-[#5b5f97]">
          <ReactMarkdown>{article.content || 'No content available.'}</ReactMarkdown>
        </div>
      </Card>

      {/* Footer */}
      {article.source && (
        <Card padding="px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a0a0b8]">Source</span>
            <a
              href={article.source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#5b5f97] transition hover:text-[#b8b8d1]"
            >
              {article.source.replace(/^https?:\/\//, '').split('/')[0]}
              <ExternalLink size={10} />
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
