'use client';

import { useEffect, useState } from 'react';

interface Article {
  title: string;
  description: string;
  dateTime: string;
  text: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]); // <-- FIXED

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/articles/recent');
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }

    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Recent Articles</h1>

        {articles.length === 0 ? (
          <p className="text-center text-gray-600">Loading articles...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    {new Date(article.dateTime).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-4">{article.description}</p>
                </div>
                <button className="mt-auto inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Read More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
