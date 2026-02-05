import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2 className={`animate-spin text-ink-400 ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-ink-600">Loading...</p>
      </div>
    </div>
  );
}
