import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { blogPosts } from "@/lib/blog";
import { useI18n } from "@/lib/i18n/context";
import { localizeBlogPost } from "@/lib/i18n/helpers";
import { ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { messages } = useI18n();

  const rawPost = blogPosts.find((p) => p.slug === slug);
  const post = rawPost ? localizeBlogPost(rawPost, messages) : null;

  if (!post) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-serif text-3xl">مقاله پیدا نشد</h1>
          <p className="mt-2 text-sm text-onyx/50">slug: {slug}</p>
          <Link to="/blog" className="mt-6 inline-block text-gold hover:underline">
            بازگشت به مجله
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-onyx/50 hover:text-gold"
        >
          <ArrowRight size={14} />
          بازگشت به مجله
        </Link>

        <div className="mt-8">
          <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            {post.category}
          </span>
        </div>

        <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-[12px] text-onyx/45">
          <Clock size={14} />
          <span>{post.readTime}</span>
        </div>

        <div className="mt-10 space-y-6 text-base leading-8 text-onyx/75 md:text-lg">
          {(post.content ?? []).map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Shell>
  );
}