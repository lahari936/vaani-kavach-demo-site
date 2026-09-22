"use client";

import { User, Code, FileText, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const placeholders = [1, 2, 3, 4, 5, 6];

  return (
    <div className="page-shell container mx-auto px-5 max-w-5xl space-y-16 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="eyebrow inline-flex items-center px-3 py-1.5 mb-2 text-xs rounded-full uppercase tracking-widest">
          Vaani Kavach Project Team
        </div>
        <h1 className="page-heading text-4xl md:text-5xl font-semibold text-foreground">Project Team and Contributors</h1>
        <p className="text-lg text-muted-foreground font-normal leading-relaxed">
          Advancing trusted voice communication and citizen protection through responsible technology.
        </p>
      </div>

      {/* Team Members Grid */}
      <section>
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
          <User className="w-5 h-5 text-foreground/70" />
          <h2 className="text-xl font-medium tracking-tight">Project Contributors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholders.map((idx) => (
            <div key={idx} className="team-card bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
              <div className="team-photo aspect-[4/3] flex items-center justify-center border-b border-border">
                <span className="text-muted-foreground text-xs tracking-widest uppercase">[Photo {idx}]</span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-medium text-foreground">[Name Placeholder]</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">[Role Placeholder]</p>
                <p className="text-sm text-muted-foreground font-normal mt-4 leading-relaxed line-clamp-2">
                  [Brief bio or primary contribution placeholder.]
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Details */}
      <section className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Share2 className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Project Architecture</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-normal leading-relaxed">
              [Placeholder] Detailed system architecture showing the call audio stream connecting to the inference engine and Action Protection API.
            </p>
            <div className="aspect-video bg-card border border-border rounded-xl flex items-center justify-center">
              <span className="text-muted-foreground text-xs tracking-widest uppercase">[Diagram Placeholder]</span>
            </div>
          </div>
        </div>

      </section>

      {/* Resources & Links */}
      <section className="border-t border-border pt-16 grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Repository</h2>
          </div>
          <p className="text-muted-foreground text-sm font-normal">
            Explore our source code and technical documentation.
          </p>
          <Button variant="outline" className="gap-2 bg-transparent border-border hover:bg-card" disabled>
            <Code className="w-4 h-4" /> [Link Placeholder]
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-foreground/70" />
            <h2 className="text-xl font-medium tracking-tight">Fraud Awareness</h2>
          </div>
          <p className="text-muted-foreground text-sm font-normal">
            Learn more about how voice-cloning fraud operates and how to protect yourself.
          </p>
          <Button variant="outline" className="gap-2 bg-transparent border-border hover:bg-card" disabled>
            <FileText className="w-4 h-4" /> [Material Placeholder]
          </Button>
        </div>
      </section>
    </div>
  );
}
