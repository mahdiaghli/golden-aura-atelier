import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found — Aurum" }] };
    const p = loaderData.post;
    return {
      meta: [
        { title: `${p.title} — Aurum` },
        { name: "description", content: p.excerpt },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <Shell>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-5xl">Article not found</h1>
        <Link to="/blog" className="inline-block mt-8 text-[11px] uppercase tracking-widest text-gold border-b border-gold">
          Return to the journal
        </Link>
      </div>
    </Shell>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData() as { post: (typeof blogPosts)[0] };

  return (
    <Shell>
      <article className="max-w-3xl mx-auto px-6 py-12 lg:py-24">
        <nav className="text-[10px] uppercase tracking-widest text-onyx/50 mb-8">
          <Link to="/blog" className="hover:text-gold">Journal</Link>
          <span className="mx-2">/</span>
          <span className="text-onyx">{post.title}</span>
        </nav>

        <header className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{post.category}</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">{post.title}</h1>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-onyx/50">{post.readTime}</p>
        </header>

        <div className="prose prose-onyx max-w-none space-y-6">
          {post.content.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-onyx/80 font-light">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-onyx/10">
          <h3 className="font-serif text-2xl mb-4">More reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2).map((related) => (
              <Link key={related.slug} to="/blog/$slug" params={{ slug: related.slug }} className="p-4 rounded-lg border border-onyx/10 hover:border-gold transition-colors">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{related.category}</p>
                <p className="font-serif text-lg mt-2">{related.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </Shell>
  );
}
