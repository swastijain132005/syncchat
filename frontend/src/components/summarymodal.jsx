import React from "react";
import { Copy, RefreshCw, X, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

const SummaryModal = ({
  open,
  onClose,
  summary,
  loading,
  onRegenerate,
}) => {
  if (!open) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    toast.success("Summary copied");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-xl bg-[#1d1935] rounded-2xl border border-violet-700 shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between p-5 border-b border-violet-800">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">

              <FileText className="w-5 h-5 text-white" />

            </div>

            <div>

              <h2 className="text-white font-semibold text-lg">
                Conversation Summary
              </h2>

              <p className="text-gray-400 text-sm">
                AI Generated
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 min-h-[220px]">

          {loading ? (

            <div className="flex flex-col items-center justify-center h-48">

              <RefreshCw className="animate-spin text-violet-400 w-8 h-8" />

              <p className="text-gray-400 mt-4">
                AI is summarizing your conversation...
              </p>

            </div>

          ) : (

            <div className="text-gray-200 whitespace-pre-line leading-7">

              {summary}

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t border-violet-800">

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d284d] hover:bg-[#39325f] text-white"
          >
            <Copy size={18} />
            Copy
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
          >
            <RefreshCw size={18} />
            Regenerate
          </button>

        </div>

      </div>
    </div>
  );
};

export default SummaryModal;