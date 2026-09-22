import type { ReactNode } from "react";

/** Presentation only: screens retain their own state and event handlers. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone-frame ${className}`}>
      <div className="phone-hardware" aria-hidden="true">
        <span className="phone-volume" />
        <span className="phone-power" />
      </div>
      <div className="phone-screen">
        <div className="phone-earpiece" aria-hidden="true"><span /></div>
        {children}
        <div className="phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}
