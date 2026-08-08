import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Chrome";
import { blogPosts } from "@/lib/blog";
import { useI18n } from "@/lib/i18n/context";
import { localizeBlogPost } from "@/lib/i18n/helpers";
import { Clock, ArrowUpLeft } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  const { messages } = useI18n();
  const blog = messages.blog as {
    listEyebrow: string;
    listTitle: string;
    listIntro: string;
  };

  const localizedPosts = blogPosts.map((post) =>
    localizeBlogPost(post, messages)
  );

  // اگر هنوز داده نداری، از این نمونه استفاده کن
  const posts =
    localizedPosts.length > 0
      ? localizedPosts
      : [
          {
            slug: "guide-buying-18k-gold",
            category: "راهنمای خرید",
            title: "راهنمای کامل خرید طلای ۱۸ عیار",
            excerpt:
              "قبل از خرید طلای ۱۸ عیار باید به چه نکاتی توجه کنید؟ از تشخیص عیار تا محاسبه اجرت و مالیات، همه چیز را در این مقاله بخوانید.",
            readTime: "۶ دقیقه مطالعه",
          },
          {
            slug: "gold-ball-investment",
            category: "سرمایه‌گذاری",
            title: "گوی طلا؛ هوشمندانه‌ترین روش سرمایه‌گذاری در طلا",
            excerpt:
              "گوی طلا چیست و چرا بسیاری از سرمایه‌گذاران آن را به سکه و شمش ترجیح می‌دهند؟ مزایا، معایب و نحوه خرید را بررسی می‌کنیم.",
            readTime: "۵ دقیقه مطالعه",
          },
          {
            slug: "jewelry-vs-investment-gold",
            category: "آموزشی",
            title: "تفاوت طلای زینتی و طلای سرمایه‌گذاری",
            excerpt:
              "طلای زینتی برای زیبایی است و طلای سرمایه‌گذاری برای حفظ ارزش پول. کدام‌یک برای شما مناسب‌تر است؟",
            readTime: "۴ دقیقه مطالعه",
          },
          {
            slug: "how-to-care-for-gold",
            category: "مراقبت",
            title: "چگونه از طلا و جواهرات خود مراقبت کنیم؟",
            excerpt:
              "نکات ساده اما مهمی که باعث می‌شود طلای شما سال‌ها درخشان بماند و ارزشش حفظ شود.",
            readTime: "۵ دقیقه مطالعه",
          },
          {
            slug: "gold-gifts-for-occasions",
            category: "هدایا",
            title: "بهترین هدایای طلا برای مناسبت‌های مختلف",
            excerpt:
              "از ازدواج و نامزدی تا تولد و سالگرد؛ چه قطعه طلایی برای هر مناسبت مناسب‌تر است؟",
            readTime: "۷ دقیقه مطالعه",
          },
          {
            slug: "what-is-no-wage-gold",
            category: "بازار طلا",
            title: "طلای بدون اجرت چیست و آیا ارزش خرید دارد؟",
            excerpt:
              "طلای بدون اجرت این روزها خیلی تبلیغ می‌شود. واقعیت چیست و آیا واقعاً به نفع خریدار است؟",
            readTime: "۶ دقیقه مطالعه",
          },
        ];

  return (
    <Shell>
      {/* Hero */}
      <section className="border-b border-onyx/10 bg-gradient-to-b from-white/60 to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
            {blog?.listEyebrow || "مجله عقلی"}
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight md:text-5xl lg:text-[3.25rem]">
            {blog?.listTitle || "دانش و الهام از دنیای طلا"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-onyx/60">
            {blog?.listIntro ||
              "مقالات آموزشی، راهنمای خرید و نکات تخصصی درباره طلا، جواهرات و سرمایه‌گذاری؛ نوشته‌شده برای مشتریان آگاه عقلی."}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-onyx/8 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)]"
            >
              {/* Category bar */}
              <div className="border-b border-onyx/6 px-7 pt-7">
                <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  {post.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-serif text-2xl leading-snug transition-colors group-hover:text-gold">
                  {post.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-onyx/55">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-onyx/6 pt-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-onyx/40">
                    <Clock size={13} />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-gold opacity-0 transition-all duration-300 group-hover:opacity-100">
                    مطالعه
                    <ArrowUpLeft size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}