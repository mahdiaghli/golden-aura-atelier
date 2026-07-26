import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { blogPosts } from "@/lib/blog";
import { useI18n } from "@/lib/i18n/context";
import { localizeBlogPost } from "@/lib/i18n/helpers";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  const { messages } = useI18n();
  const blog = messages.blog as { listEyebrow: string; listTitle: string; listIntro: string };
  const localizedPosts = blogPosts.map((post) => localizeBlogPost(post, messages));

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <span className="text-[12px] uppercase tracking-[0.35em] text-gold">{blog.listEyebrow}</span>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl">{blog.listTitle}</h1>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-onyx/70">{blog.listIntro}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {localizedPosts.map((post) => (
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
