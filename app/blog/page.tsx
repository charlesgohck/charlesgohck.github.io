import { wisp } from "@/lib/wisp";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import BlogList from "./BlogList";

const siteUrl = process.env.PUBLIC_SITE_URL || "https://charlesgohck.com";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on software engineering, technology, web development, and more. Stay updated with the latest insights and tutorials.",
  keywords: [
    "Software Engineering Blog",
    "Technology Blog",
    "Web Development",
    "Programming Tutorials",
    "Tech Insights",
    "Charles Goh Blog",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/blog`,
    title: "Blog | Charles Goh C.K",
    description:
      "Thoughts on software engineering, technology, web development, and more. Stay updated with the latest insights and tutorials.",
    siteName: "Charles Goh C.K",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Charles Goh C.K",
    description:
      "Thoughts on software engineering, technology, web development, and more.",
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

// Revalidate every hour
export const revalidate = 3600;

interface BlogPost {
  id: string;
  title: string;
  image: string | null;
  description: string | null;
  slug: string;
  createdAt: Date;
  publishedAt: Date | null;
  author: {
    name: string | null;
    image: string | null;
  } | null;
  tags: Array<{ id: string; name: string }>;
}

interface Tag {
  id: string;
  name: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const result = await wisp.getPosts({ limit: "all" });
    return result.posts as unknown as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function getTags(): Promise<Tag[]> {
  try {
    const result = await wisp.getTags(1, "all");
    return result.tags as unknown as Tag[];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// Navigation Component
function Navigation() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-foreground transition-colors hover:text-muted-foreground"
          >
            CG
          </Link>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getTags()]);

  // JSON-LD structured data for blog listing
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog | Charles Goh C.K",
    description:
      "Thoughts on software engineering, technology, web development, and more.",
    url: `${siteUrl}/blog`,
    author: {
      "@type": "Person",
      name: "Charles Goh C.K",
      url: siteUrl,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description || undefined,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: new Date(post.publishedAt ?? post.createdAt).toISOString(),
      image: post.image || undefined,
      author: {
        "@type": "Person",
        name: post.author?.name || "Charles Goh C.K",
      },
    })),
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
    ],
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navigation />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <header className="mb-12 animate-fade-in-up">
<div className="overflow-hidden rounded-xl border border-[#3d3d3d] bg-card shadow-sm">
            {/* Windows Terminal title bar */}
            <div className="flex items-center justify-between bg-[#1e1e1e] border-b border-[#3d3d3d]">
              {/* Tabs */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 bg-[#0c0c0c] px-4 py-2 border-r border-[#3d3d3d]">
                  <span className="h-3 w-3 rounded-full bg-[#E95420]" aria-hidden />
                  <span className="text-xs font-medium text-[#cccccc]">computer</span>
                </div>
                <span className="px-3 py-2 text-[#6d6d6d] text-sm select-none">+</span>
              </div>
              {/* Windows window controls */}
              <div className="flex items-center text-[#cccccc]">
                <span className="px-4 py-2 hover:bg-[#3d3d3d] text-xs cursor-default select-none" aria-label="Minimize">─</span>
                <span className="px-4 py-2 hover:bg-[#3d3d3d] text-xs cursor-default select-none" aria-label="Maximize">&#9633;</span>
                <span className="px-4 py-2 hover:bg-red-600 text-xs cursor-default select-none" aria-label="Close">&#10005;</span>
              </div>
            </div>

            <div className="space-y-4 bg-background p-5 sm:p-6 md:p-8">
              <p className="font-mono text-sm">
                <span className="text-[#4EC94E]">charles@computer</span>
                <span className="text-foreground">:</span>
                <span className="text-blue-400">~/blog</span>
                <span className="text-foreground">$ </span>
                <span className="text-foreground">ls -la</span>
              </p>

              <div className="rounded-md border border-border bg-muted/30 p-4 md:p-5">
                <h1 className="text-3xl font-bold text-foreground md:text-5xl">
                  Blog
                </h1>
                <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                  Thoughts on software engineering, technology, and the
                  occasional adventure into new domains.
                </p>
              </div>

              <p className="font-mono text-sm">
                <span className="text-[#4EC94E]">charles@computer</span>
                <span className="text-foreground">:</span>
                <span className="text-blue-400">~/blog</span>
                <span className="text-foreground">$ </span>
                <span className="text-foreground">find posts -type f | wc -l</span>
              </p>
            </div>
          </div>
        </header>

        <Suspense fallback={null}>
          <BlogList posts={posts} tags={tags} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
