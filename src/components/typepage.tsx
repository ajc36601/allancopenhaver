'use client';

import { useEffect, useState } from 'react';
import Navbar from './navbar';
import ArticleCard from './card';

interface Article {
  title: string;
  description: string;
  dateTime: string;
  text: string;
  type: number;
}

interface TypePageProps {
  type: number;
  title: string;
  initialLimit?: number;
}

export default function TypePage({ type, title, initialLimit = 3 }: TypePageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const LIMIT = initialLimit;

  useEffect(() => {
    initialLoad();
  }, []);

  async function initialLoad() {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/recent?type=${type}&limit=${LIMIT + 1}`
      );
      if (!res.ok) return;
      const data: Article[] = await res.json();

      const initialArticles = data.slice(0, LIMIT);
      setArticles(initialArticles);
      setOffset(initialArticles.length);
      setHasMore(data.length > LIMIT);
    } catch (err) {
      console.error('Error during initial article load:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreArticles() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/recent?type=${type}&limit=${LIMIT + 1}&offset=${offset}`
      );
      if (!res.ok) return;
      const data: Article[] = await res.json();

      const hasNextPage = data.length > LIMIT;
      const newArticles = data.slice(0, LIMIT).filter(
        (newArticle) =>
          !articles.some((existingArticle) => existingArticle.title === newArticle.title)
      );

      setArticles((prev) => [...prev, ...newArticles]);
      setOffset((prev) => prev + newArticles.length);
      setHasMore(hasNextPage);
    } catch (err) {
      console.error('Error loading more articles:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        {articles.length === 0 && !loading && <p>No articles found.</p>}

        {articles.map((article, idx) => (
          <ArticleCard key={idx} article={article} />
        ))}

        {hasMore && (
          <button
            onClick={loadMoreArticles}
            disabled={loading}
            className={`mt-4 px-4 py-2 rounded text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}

        {!hasMore && !loading && (
          <p className="mt-4 text-center text-gray-500">No more articles to load</p>
        )}
      </div>
    </>
  );
}
