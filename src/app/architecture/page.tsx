"use client";

import { useRef, useState } from "react";
import { Activity, ArrowLeft, CheckCircle2, ChevronRight, FileKey, Lock, Network, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import { explanations } from "@/config/explanations";
import { TechnicalExplanation } from "@/components/TechnicalExplanation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const architectureNodes = [
  { id: "call", title: "Join the call", description: "Connect Vaani Kavach to a call", icon: <Phone />, data: explanations.call },
  { id: "processing", title: "Prepare the audio", description: "Make speech ready for analysis", icon: <Network />, data: explanations.processing },
  { id: "detection", title: "Analyse the voice", description: "Check for signs of a synthetic voice", icon: <Activity />, data: explanations.detection },
  { id: "verification", title: "Verify the caller", description: "Check who is calling", icon: <CheckCircle2 />, data: explanations.verification },
  { id: "risk", title: "Assess the risk", description: "Identify when extra checks are needed", icon: <ShieldAlert />, data: explanations.risk },
  { id: "receipt", title: "Create a risk receipt", description: "Link the assessment to a transaction", icon: <FileKey />, data: explanations.receipt },
  { id: "payment", title: "Protect the payment", description: "Check the risk before money moves", icon: <Lock />, data: explanations.payment },
  { id: "privacy", title: "Protect your privacy", description: "Handle call data with care", icon: <ShieldCheck />, data: explanations.privacy },
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
  const detailsRef = useRef<HTMLElement>(null);
  const activeIndex = architectureNodes.findIndex((node) => node.id === activeNode);
  const activeItem = architectureNodes[activeIndex];
  const activePhase = phases.find((phase) => phase.ids.includes(activeNode));

  const scrollToElement = (element: HTMLElement | null) => {
    if (!element) return;
    element.focus({ preventScroll: true });
    element.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  };

  const selectModule = (id: string) => {
    setActiveNode(id);
    // Wait for the selected content to render, including when reselecting a module.
    if (window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() => scrollToElement(detailsRef.current));
    }
  };

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
      </header>

      <div className="architecture-workspace">
        <section className="architecture-flow" aria-label="Vaani Kavach architecture workflow">
          <div className="architecture-flow-intro">
            <span>Explore the modules</span>
            <small>Select a module to view its details</small>
          </div>

          {phases.map((phase) => (
            <div className="architecture-phase" key={phase.number}>
              <div className="architecture-phase-heading">
                <h2>{phase.title}</h2>
              </div>

              <div className="architecture-phase-modules">
                {phase.ids.map((id) => {
                  const node = architectureNodes.find((item) => item.id === id)!;
                  return (
                    <button
                      key={node.id}
                      id={`module-${node.id}`}
                      type="button"
                      onClick={() => selectModule(node.id)}
                      aria-pressed={activeNode === id}
                      aria-controls="module-details"
                      className="architecture-node"
                    >
                      <span className="icon-tile architecture-node-icon" aria-hidden="true">{node.icon}</span>
                      <span className="architecture-node-copy">
                        <strong>{node.title}</strong>
                        <span>{node.description}</span>
                      </span>
                      <ChevronRight className="architecture-chevron" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <aside ref={detailsRef} id="module-details" tabIndex={-1} className="architecture-inspector" aria-labelledby="module-details-title">
            <button
              type="button"
              className="architecture-back"
              onClick={() => scrollToElement(document.getElementById(`module-${activeNode}`))}
            >
              <ArrowLeft aria-hidden="true" /> Back to modules
            </button>
            <div className="architecture-details" aria-live="polite">
              <div className="architecture-details-topline">
                <span>Module {String(activeIndex + 1).padStart(2, "0")} of 08</span>
                <span>{activePhase?.title} phase</span>
              </div>
              <div className="architecture-details-heading">
                <div className="icon-tile">{activeItem.icon}</div>
                <div>
                  <span className={`architecture-status ${statusStyles[activeItem.data.label]}`}>{activeItem.data.label}</span>
                  <h2 id="module-details-title">{activeItem.title}</h2>
                </div>
              </div>
              <p className="architecture-summary-copy">{activeItem.data.summary}</p>

              <TechnicalExplanation key={activeNode} data={activeItem.data} minimal />
              <nav className="architecture-module-nav" aria-label="Browse modules">
                <button type="button" disabled={activeIndex === 0} onClick={() => selectModule(architectureNodes[activeIndex - 1].id)}>
                  <ArrowLeft aria-hidden="true" /> Previous
                </button>
                <button type="button" disabled={activeIndex === architectureNodes.length - 1} onClick={() => selectModule(architectureNodes[activeIndex + 1].id)}>
                  Next <ChevronRight aria-hidden="true" />
                </button>
              </nav>
            </div>
        </aside>
      </div>
    </div>
  );
}
