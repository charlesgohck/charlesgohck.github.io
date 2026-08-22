import { wisp } from "@/lib/wisp";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const siteUrl = process.env.PUBLIC_SITE_URL || "https://charlesgohck.com";

// Revalidate every hour
export const revalidate = 3600;

interface BlogPost {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: {
    name: string | null;
    image: string | null;
  } | null;
  tags: Array<{ id: string; name: string }>;
}

interface RelatedPost {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  slug: string;
}

export async function generateStaticParams() {
  try {
    const result = await wisp.getPosts({ limit: "all" });
    return result.posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error fetching slugs for static params:", error);
    return [];
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const result = await wisp.getPost(slug);
    return result.post as unknown as BlogPost | null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function getRelatedPosts(slug: string): Promise<RelatedPost[]> {
  try {
    const result = await wisp.getRelatedPosts({ slug, limit: 3 });
    return result.posts as unknown as RelatedPost[];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postUrl = `${siteUrl}/blog/${slug}`;
  const keywords = post.tags?.map((tag) => tag.name) || [];

  return {
    title: post.title,
    description: post.description || undefined,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.description || undefined,
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      siteName: "Charles Goh C.K",
      publishedTime: new Date(post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: keywords.length > 0 ? keywords : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || undefined,
      images: post.image ? [post.image] : undefined,
      creator: "@charlesgohck",
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function calculateReadingTime(content: string): number {
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200); // Average reading speed of 200 words per minute
}

// Navigation Component
function Navigation() {
  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-foreground transition-colors hover:text-muted-foreground"
          >
            CG
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Related Post Card Component
function RelatedPostCard({ post }: { post: RelatedPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg border border-border bg-card p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {post.image && (
        <div className="overflow-hidden rounded-md mb-3">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {post.title}
      </h3>
      {post.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      )}
    </Link>
  );
}

// Share Buttons Component
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = typeof window !== "undefined" 
    ? `${window.location.origin}/blog/${slug}` 
    : `/blog/${slug}`;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, relatedPosts] = await Promise.all([
    getBlogPost(slug),
    getRelatedPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const postUrl = `${siteUrl}/blog/${slug}`;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    image: post.image || undefined,
    datePublished: new Date(post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name || "Charles Goh C.K",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Charles Goh C.K",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length,
    keywords: post.tags?.map((tag) => tag.name).join(", ") || undefined,
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navigation />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in-up">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 animate-fade-in-up animation-delay-200">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tags=${tag.name}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              {post.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              {post.author?.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {post.author?.name || "Anonymous"}
                </p>
                <time dateTime={new Date(post.publishedAt ?? post.createdAt).toISOString()}>
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </time>
              </div>
            </div>
            <span className="hidden sm:inline">·</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <figure className="mb-12 animate-fade-in-up animation-delay-400">
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-xl shadow-lg"
            />
          </figure>
        )}

        {/* Content */}
        <div
          className="prose prose-zinc dark:prose-invert prose-lg max-w-none animate-fade-in-up animation-delay-600
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:marker:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          {/* Share */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tags=${tag.name}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Related Posts
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-accent transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to all posts
            </Link>
          </div>
        </footer>
      </article>

      {/* Page Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Charles Goh C.K. All rights reserved.
            </p>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
