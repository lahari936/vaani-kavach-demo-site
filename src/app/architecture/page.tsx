"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, CheckCircle2, ChevronRight, FileKey, Lock, Network, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import { explanations } from "@/config/explanations";
import { TechnicalExplanation } from "@/components/TechnicalExplanation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const architectureNodes = [
  { id: "call", icon: <Phone />, data: explanations.call },
  { id: "processing", icon: <Network />, data: explanations.processing },
  { id: "detection", icon: <Activity />, data: explanations.detection },
  { id: "verification", icon: <CheckCircle2 />, data: explanations.verification },
  { id: "risk", icon: <ShieldAlert />, data: explanations.risk },
  { id: "receipt", icon: <FileKey />, data: explanations.receipt },
  { id: "payment", icon: <Lock />, data: explanations.payment },
  { id: "privacy", icon: <ShieldCheck />, data: explanations.privacy },
];

const phases = [
  { number: "01", title: "Connect", description: "Securely access and prepare the live call", ids: ["call", "processing"] },
  { number: "02", title: "Assess", description: "Analyse voice, identity and emerging risk", ids: ["detection", "verification", "risk"] },
  { number: "03", title: "Protect", description: "Carry risk evidence into the intended action", ids: ["receipt", "payment"] },
  { number: "04", title: "Govern", description: "Apply privacy and deployment safeguards", ids: ["privacy"] },
];

const statusStyles = {
  IMPLEMENTED: "status-implemented",
  SIMULATED: "status-simulated",
  PROPOSED: "status-proposed",
  "DEMO-ONLY": "status-demo",
};

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState("call");
  const activeIndex = architectureNodes.findIndex((node) => node.id === activeNode);
  const activeItem = architectureNodes[activeIndex];
  const activePhase = phases.find((phase) => phase.ids.includes(activeNode));

  return (
    <div className="page-shell architecture-page container mx-auto px-5 max-w-6xl min-h-[calc(100vh-4rem)]">
      <Link href="/simulation" className="inline-flex mb-10">
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Citizen Experience
        </Button>
      </Link>

      <header className="architecture-header">
        <div>
          <div className="eyebrow architecture-eyebrow">System Overview</div>
          <h1 className="page-heading text-4xl sm:text-5xl font-semibold text-foreground">Technology Architecture</h1>
          <p className="text-muted-foreground leading-relaxed text-lg">Review the secure technology workflow behind Vaani Kavach.</p>
        </div>
        <div className="architecture-summary" aria-label="Architecture summary">
          <strong>4</strong><span>Operational phases</span><i />
          <strong>8</strong><span>Technical modules</span>
        </div>
      </header>

      <div className="architecture-workspace">
        <section className="architecture-flow" aria-label="Vaani Kavach architecture workflow">
          <div className="architecture-flow-intro">
            <span>End-to-end workflow</span>
            <small>Select any module to inspect it</small>
          </div>

          {phases.map((phase) => (
            <div className="architecture-phase" key={phase.number}>
              <div className="architecture-phase-heading">
                <span>{phase.number}</span>
                <div><h2>{phase.title}</h2><p>{phase.description}</p></div>
              </div>

              <div className="architecture-phase-modules">
                {phase.ids.map((id) => {
                  const node = architectureNodes.find((item) => item.id === id)!;
                  const index = architectureNodes.findIndex((item) => item.id === id);
                  return (
                    <motion.button
                      key={node.id}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setActiveNode(node.id)}
                      aria-pressed={activeNode === id}
                      className="architecture-node"
                    >
                      <span className="architecture-step">{String(index + 1).padStart(2, "0")}</span>
                      <span className="icon-tile architecture-node-icon">{node.icon}</span>
                      <span className="architecture-node-copy">
                        <strong>{node.data.title.replace(/^\d+\.\s*/, "")}</strong>
                        <small className={statusStyles[node.data.label]}>{node.data.label}</small>
                      </span>
                      <ChevronRight className="architecture-chevron" aria-hidden="true" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <aside className="architecture-inspector" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="architecture-details"
            >
              <div className="architecture-details-topline">
                <span>Module {String(activeIndex + 1).padStart(2, "0")} of 08</span>
                <span>{activePhase?.title} phase</span>
              </div>
              <div className="architecture-details-heading">
                <div className="icon-tile">{activeItem.icon}</div>
                <div>
                  <span className={`architecture-status ${statusStyles[activeItem.data.label]}`}>{activeItem.data.label}</span>
                  <h2>{activeItem.data.title.replace(/^\d+\.\s*/, "")}</h2>
                </div>
              </div>
              <p className="architecture-summary-copy">{activeItem.data.summary}</p>

              <div className="architecture-position" aria-label={`Module ${activeIndex + 1} of 8`}>
                {architectureNodes.map((node, index) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNode(node.id)}
                    aria-label={`Open module ${index + 1}: ${node.data.title.replace(/^\d+\.\s*/, "")}`}
                    aria-current={node.id === activeNode ? "step" : undefined}
                  />
                ))}
              </div>

              <TechnicalExplanation data={activeItem.data} minimal />
              <p className="architecture-help">Open the panel above for implementation notes and technical evidence.</p>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
