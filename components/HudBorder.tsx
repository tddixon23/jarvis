"use client";

export default function HudBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* corner brackets */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
      {children}
    </div>
  );
}
