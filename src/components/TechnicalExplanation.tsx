"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ExplanationData } from "@/config/explanations";

interface TechnicalExplanationProps {
  data?: ExplanationData;
  minimal?: boolean;
}

export function TechnicalExplanation({ data, minimal = false }: TechnicalExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  const dotColor = {
    "IMPLEMENTED": "bg-green-500",
    "SIMULATED": "bg-amber-500",
    "PROPOSED": "bg-blue-500",
    "DEMO-ONLY": "bg-purple-500",
  }[data.label];

  // Strip the "1. " numbering if in minimal mode
  const displayTitle = minimal ? data.title.replace(/^\d+\.\s*/, '') : data.title;

  return (
    <div className="technical-explanation border border-border rounded-xl overflow-hidden bg-card font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-card transition-colors text-left"
      >
        <span className="font-medium text-sm text-foreground/90">
          {minimal ? "Technical details" : displayTitle}
        </span>
        <div className="flex items-center gap-3">
          {!minimal && (
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">
                {data.label}
              </span>
            </div>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {!minimal && <p className="text-sm font-medium text-foreground/80 mb-3">{data.summary}</p>}
              <ul className="space-y-2">
                {data.details.map((detail, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                    <span className="text-muted-foreground mt-1">—</span>
                    <span dangerouslySetInnerHTML={{ __html: detail.replace(/([A-Z]{3,})/g, '<span class="font-medium text-foreground/80">$1</span>') }} />
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
