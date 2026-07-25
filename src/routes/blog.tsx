import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Gold Insights Blog — Aurum" },
      { name: "description", content: "Read articles about gold, investment, craftsmanship, and collecting." },
    ],
  }),
});

function BlogPage() {
  return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <span className="text-[12px] uppercase tracking-[0.35em] text-gold">Aurum Journal</span>
        <h1 className="font-serif text-4xl md:text-5xl mt-4">Insights on gold, craft, and collecting.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-onyx/70 font-light">
          Explore thoughtful articles that explain why gold is cherished, how to choose the right piece, and what makes a piece collectible.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }} className="rounded-[1.5rem] border border-onyx/10 bg-white/80 p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-gold">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{post.category}</p>
              <h2 className="mt-4 font-serif text-2xl">{post.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-onyx/60">{post.excerpt}</p>
              <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-onyx/50">{post.readTime}</div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
