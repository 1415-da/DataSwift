"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { key: "documentation", label: "Documentation" },
  { key: "best-practices", label: "Best Practices" },
  { key: "tutorials", label: "Tutorials" },
  { key: "api", label: "API Reference" },
  { key: "community", label: "Community" },
];

export default function KnowledgeHubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      <h1 className="text-3xl font-bold mb-6">Knowledge Hub</h1>
      <nav className="flex gap-2 mb-6" aria-label="Knowledge Hub Sections">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/knowledgehub/${t.key}`}
            className={`px-4 py-2 rounded font-medium transition-colors ${pathname.endsWith(t.key) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            aria-current={pathname.endsWith(t.key) ? "page" : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
} 