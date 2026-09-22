"use client";

import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 12);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const links = [
    { name: "Citizen Experience", href: "/simulation" },
    { name: "System Overview", href: "/architecture" },
    { name: "Technical Validation", href: "/try-model" },
    { name: "Project Team", href: "/team" },
  ];

  return (
    <nav aria-label="Main navigation" data-scrolled={scrolled} className="site-nav sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="brand-icon w-9 h-9 rounded-xl flex items-center justify-center transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-foreground/90">Vaani Kavach</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              aria-current={pathname === link.href ? "page" : undefined}
              className="nav-link text-sm font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} aria-controls="mobile-navigation" className="md:hidden p-3 rounded-lg hover:bg-secondary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id="mobile-navigation"
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {links.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="nav-link text-sm font-medium hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
