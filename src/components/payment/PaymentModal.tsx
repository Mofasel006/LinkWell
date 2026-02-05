import { useState } from "react";
import { X, Sparkles, FileText, BookOpen, Zap } from "lucide-react";
import CheckoutPopup from "./CheckoutPopup";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  userEmail,
}: PaymentModalProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleStartTrial = () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    onSuccess();
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  return (
    <>
      {/* Payment Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink-400 hover:text-ink-800 rounded-lg hover:bg-cream-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-2">
              Unlock the Full Power of LinkWell
            </h2>
            <p className="text-ink-600">
              Write smarter with AI assistance and reference your knowledge
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <Feature
              icon={<FileText className="h-5 w-5" />}
              title="Unlimited Documents"
              description="Create as many documents as you need"
            />
            <Feature
              icon={<BookOpen className="h-5 w-5" />}
              title="Knowledge References"
              description="Add unlimited reference materials to ground your AI"
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="AI Writing Assistant"
              description="Get intelligent suggestions powered by GPT-4"
            />
          </div>

          {/* Pricing */}
          <div className="bg-cream-100 rounded-xl p-6 mb-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-ink-900">$9</span>
              <span className="text-ink-600">/month</span>
            </div>
            <p className="text-center text-ink-500 text-sm mt-2">
              Cancel anytime. No questions asked.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartTrial}
            className="w-full py-4 bg-ink-800 text-white font-semibold rounded-xl hover:bg-ink-900 transition-colors text-lg"
          >
            Start Free Trial
          </button>

          <p className="text-center text-ink-400 text-xs mt-4">
            7-day free trial. Secure payment powered by Polar.
          </p>
        </div>
      </div>

      {/* Checkout Popup */}
      {showCheckout && (
        <CheckoutPopup
          userEmail={userEmail}
          onSuccess={handleCheckoutSuccess}
          onClose={handleCheckoutClose}
        />
      )}
    </>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-ink-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-ink-800">{title}</h3>
        <p className="text-sm text-ink-500">{description}</p>
      </div>
    </div>
  );
}
