import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LinkWell</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Write better documents with{" "}
              <span className="text-primary-600">AI assistance</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              LinkWell combines a powerful document editor with AI capabilities and your personal
              knowledge base to help you create compelling content faster than ever.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg">Start Writing Free</Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-16 sm:mt-24">
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-gray-400 text-sm">LinkWell Editor</div>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="grid grid-cols-12 gap-4 h-64">
                  {/* Knowledge Panel Mockup */}
                  <div className="col-span-3 bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs font-medium mb-3">Knowledge</div>
                    <div className="space-y-2">
                      <div className="bg-gray-600/50 rounded h-8"></div>
                      <div className="bg-gray-600/50 rounded h-8"></div>
                      <div className="bg-gray-600/50 rounded h-8"></div>
                    </div>
                  </div>
                  {/* Editor Mockup */}
                  <div className="col-span-6 bg-white rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-4 bg-primary-100 rounded w-2/3 mt-4"></div>
                    </div>
                  </div>
                  {/* AI Chat Mockup */}
                  <div className="col-span-3 bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs font-medium mb-3">AI Assistant</div>
                    <div className="space-y-2">
                      <div className="bg-primary-600/30 rounded p-2 text-xs text-gray-300">
                        How can I help?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to write great content
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features designed for modern writers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rich Text Editor</h3>
              <p className="text-gray-600">
                A beautiful, distraction-free writing experience with all the formatting tools you need.
                Supports headings, lists, links, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Writing Assistant</h3>
              <p className="text-gray-600">
                Get intelligent suggestions, generate content, rewrite passages, and overcome writer's
                block with AI-powered assistance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Knowledge Base</h3>
              <p className="text-gray-600">
                Add reference materials, notes, and research to your documents. The AI uses your
                knowledge to generate more accurate content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-2xl px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to transform your writing?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of writers who use LinkWell to create better content in less time.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-gray-600">LinkWell</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} LinkWell. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
