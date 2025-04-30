import { notFound } from 'next/navigation';
import Navbar from '../../components/navbar';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/${encodeURIComponent(params.slug)}`);

  if (!res.ok) return notFound();

  const article = await res.json();

  return (
    <>
      <Navbar />
      <main className="prose mx-auto px-4 py-8">
        <h1>{article.title}</h1>
        <p className="text-gray-500 text-sm">{new Date(article.dateTime).toLocaleDateString()}</p>
        <article dangerouslySetInnerHTML={{ __html: article.text }} />
      </main>
    </>
  );
}