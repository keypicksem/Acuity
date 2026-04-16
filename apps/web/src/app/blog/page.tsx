import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Acuity",
  description:
    "Articles on voice journaling, AI journaling apps, mental health, productivity, brain dumping, and building nightly habits.",
  alternates: { canonical: "https://getacuity.io/blog" },
  openGraph: {
    title: "Blog — Acuity",
    description:
      "Articles on voice journaling, AI journaling apps, mental health, productivity, and building nightly habits.",
    url: "https://getacuity.io/blog",
  },
};

export default function BlogIndex() {
  return (
    <main className="pt-32 pb-24 px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Blog
        </h1>
        <p className="text-lg text-[#A0A0B8] mb-16 max-w-2xl">
          Ideas on voice journaling, productivity, mental health, and the
          science of getting your thoughts out of your head.
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-white/10 bg-[#13131F] p-6 transition-all duration-300 hover:border-[#7C5CFC]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#7C5CFC]/5"
            >
              <div className="flex items-center gap-3 text-xs text-[#A0A0B8] mb-4">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="text-white/20">|</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-lg font-bold leading-snug mb-3 group-hover:text-[#7C5CFC] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-[#A0A0B8] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
