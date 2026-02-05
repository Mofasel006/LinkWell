import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface CheckoutPopupProps {
  userEmail: string;
  onSuccess: () => void;
  onClose: () => void;
}

const POLAR_CHECKOUT_LINK = "https://buy.polar.sh/polar_cl_vKXlYoB1OjUkrYL58JUFkmT5beSFpKnF9mgjh46SBoP";

export default function CheckoutPopup({
  userEmail,
  onSuccess,
  onClose,
}: CheckoutPopupProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Construct checkout URL with email prefill
  const checkoutUrl = `${POLAR_CHECKOUT_LINK}?email=${encodeURIComponent(userEmail)}&embed=true`;

  useEffect(() => {
    // Listen for messages from the Polar checkout iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin is from Polar
      if (!event.origin.includes("polar.sh") && !event.origin.includes("buy.polar.sh")) {
        return;
      }

      const { type, status } = event.data || {};

      console.log("Polar checkout message:", event.data);

      // Handle checkout completion
      if (type === "checkout:completed" || type === "checkout:success" || status === "succeeded") {
        console.log("Checkout completed successfully!");
        onSuccess();
      }

      // Handle checkout close
      if (type === "checkout:close" || type === "checkout:cancelled") {
        onClose();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onClose]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Checkout Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl h-[700px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-ink-800">Complete Your Purchase</h3>
          <button
            onClick={onClose}
            className="p-2 text-ink-400 hover:text-ink-800 rounded-lg hover:bg-cream-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-ink-400 mx-auto mb-2" />
              <p className="text-ink-600">Loading checkout...</p>
            </div>
          </div>
        )}

        {/* Polar Checkout Iframe */}
        <iframe
          ref={iframeRef}
          src={checkoutUrl}
          className="w-full h-[calc(100%-65px)]"
          onLoad={handleIframeLoad}
          allow="payment"
          title="Polar Checkout"
        />
      </div>
    </div>
  );
}
