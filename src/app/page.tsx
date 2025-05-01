'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import ArticleCard from '../components/card';

interface Article {
  title: string;
  description: string;
  dateTime: string;
  text: string;
  type: number;
}

const ADMIN_EMAILS = ['rac00034@mix.wvu.edu'];

export default function Home() {
  const [articles, setArticles] = useState<(Article | null)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    text: '',
    type: 0,
  });
  const { data: session } = useSession();

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  useEffect(() => {
    async function fetchData() {
      const results = await Promise.all([
        fetchLatestByType(0),
        fetchLatestByType(1),
        fetchLatestByType(2),
      ]);
      setArticles(results);
    }
    fetchData();
  }, []);

  async function fetchLatestByType(type: number): Promise<Article | null> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/recent?type=${type}&limit=1`);
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) ? data[0] : null;
    } catch (err) {
      console.error('Failed to fetch article:', err);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', text: '', type: 0 });
        location.reload(); // Refresh to show new article
      } else {
        alert('Failed to create article');
      }
    } catch (error) {
      console.error('Error creating article:', error);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.html')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFormData((prev) => ({ ...prev, text }));
    };
    reader.readAsText(file);
  }

  return (
    <>
      <Navbar />
      <main className="space-y-6 p-6">
        {articles[0] && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              <Link href="/doing">What Am I Doing?</Link>
            </h2>
            <ArticleCard article={articles[0]} />
          </div>
        )}

        {articles[1] && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              <Link href="/watching">What Am I Watching?</Link>
            </h2>
            <ArticleCard article={articles[1]} />
          </div>
        )}

        {articles[2] && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              <Link href="/reading">What Am I Reading?</Link>
            </h2>
            <ArticleCard article={articles[2]} />
          </div>
        )}

        {articles.every((a) => a === null) && (
          <p className="text-gray-600 text-lg">Loading Articles...</p>
        )}

        {isAdmin && (
          <div className="flex justify-center mt-8">
            <button
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Article
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Article</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border px-3 py-2 rounded"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <textarea
                placeholder="Text or use HTML file"
                className="w-full border px-3 py-2 rounded"
                rows={5}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
              <input
                type="file"
                accept=".html"
                onChange={handleFileChange}
                className="w-full border px-3 py-2 rounded"
              />
              <select
                className="w-full border px-3 py-2 rounded"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
              >
                <option value={0}>Doing</option>
                <option value={1}>Watching</option>
                <option value={2}>Reading</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
