'use client';

import Link from 'next/link';

interface Article {
  title: string;
  description: string;
  dateTime: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/${encodeURIComponent(article.title)}`}>
      <section className="border p-4 rounded-md shadow mt-4 cursor-pointer hover:bg-gray-100">
        <h2 className="text-xl font-semibold">{article.title}</h2>
        <p className="text-sm text-gray-500">
          {new Date(article.dateTime).toLocaleDateString()}
        </p>
        <p className="mt-2 text-gray-700">{article.description}</p>
      </section>
    </Link>
  );
}
