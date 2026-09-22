"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Network, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedVoiceGraphic } from "@/components/animated-voice-graphic";

const cards = [
  {
    title: "Citizen Experience",
    description: "Experience a realistic voice-impersonation incident and see how Vaani Kavach safeguards a citizen during an active call.",
    icon: <Play className="w-5 h-5" />,
    cta: "Begin Demonstration",
    href: "/simulation",
  },
  {
    title: "System Overview",
    description: "Review the system architecture, voice-analysis pipeline and institutional integration components.",
    icon: <Network className="w-5 h-5" />,
    cta: "Review Architecture",
    href: "/architecture",
  },
  {
    title: "Technical Validation",
    description: "Access the technical workbench to evaluate voice models and inspect protected API exchanges.",
    icon: <ShieldCheck className="w-5 h-5" />,
    cta: "Open Validation Lab",
    href: "/try-model",
  },
];

export default function Home() {
  return (
    <div className="home-page min-h-[calc(100vh-4rem)]">
      <div className="container px-5 py-12 sm:py-16 mx-auto max-w-6xl">
        <div className="hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-copy"
        >
          <div className="eyebrow inline-flex items-center gap-2 px-3 py-1.5 mb-7 text-[10px] uppercase tracking-widest rounded-full">
            Public Digital Safety Demonstration
          </div>
          <h1 className="mb-6 text-foreground">
            Trusted Voice. <span>Protected Action.</span>
          </h1>
          <p className="text-muted-foreground">
            Vaani Kavach identifies suspected voice-cloning during live calls and helps protect citizens before a high-risk action is completed.
          </p>
        </motion.div>
        <AnimatedVoiceGraphic />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {cards.map((card, index) => (
            <Link key={card.title} href={card.href} className="feature-link group rounded-2xl">
              <Card className={`feature-card h-full flex flex-col border rounded-2xl ring-0 p-2 ${index === 0 ? "feature-card-primary" : "bg-card border-border"}`}>
                <CardHeader className="pb-4">
                  <div className="icon-tile mb-4 w-11 h-11 rounded-xl flex items-center justify-center">
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg font-medium tracking-tight">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-auto flex flex-col gap-8">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </CardDescription>
                  <div className="feature-cta text-sm font-medium">
                    {card.cta}
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
