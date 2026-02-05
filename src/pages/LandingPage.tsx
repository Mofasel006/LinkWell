import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { FileText, Sparkles, BookOpen, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-ink-800" />
          <span className="font-serif text-2xl font-bold text-ink-900">LinkWell</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-ink-600 hover:text-ink-800 font-medium">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-900 leading-tight mb-6">
          Write smarter.
          <br />
          Reference better.
          <br />
          <span className="text-ink-600">Collaborate with AI.</span>
        </h1>
        <p className="text-xl text-ink-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The document writing platform that helps you create high-quality content 
          by referencing your own knowledge and collaborating with AI in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="btn-primary inline-flex items-center justify-center gap-2">
            Start Writing Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/login" className="btn-secondary">
            Log In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-ink-900 mb-16">
            Everything you need to write better
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="AI-Assisted Writing"
              description="Get intelligent suggestions, expand your ideas, and refine your writing with AI that understands your context."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Reference Your Knowledge"
              description="Add notes, research, and source materials directly to your document. AI uses them to ground every response."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Clean, Focused Editor"
              description="A distraction-free writing environment with beautiful typography designed for long-form content."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
          Ready to transform your writing?
        </h2>
        <p className="text-xl text-ink-600 mb-8">
          Join writers, researchers, and professionals who create better documents with LinkWell.
        </p>
        <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
          Get Started — It's Free
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-ink-600" />
            <span className="font-serif text-lg font-bold text-ink-800">LinkWell</span>
          </div>
          <p className="text-ink-400 text-sm">
            © {new Date().getFullYear()} LinkWell. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream-100 text-ink-800 mb-6">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">{title}</h3>
      <p className="text-ink-600 leading-relaxed">{description}</p>
    </div>
  );
}
