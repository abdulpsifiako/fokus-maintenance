import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingModal({
  show,
  text = "Mohon tunggu sebentar...",
}) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-red-100/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center max-w-sm w-[90%] border border-red-200"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <Loader2 className="animate-spin text-red-500 w-8 h-8" />
        </div>
        <p className="text-red-700 font-semibold text-lg">{text}</p>
        <p className="text-gray-600 text-sm mt-1">
          Sedang memproses permintaan Anda...
        </p>
      </motion.div>
    </motion.div>
  );
}
