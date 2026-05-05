import { XCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const alertTypes = {
  success: {
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-700",
  },
  error: {
    icon: <XCircle className="text-red-600 w-5 h-5" />,
    bg: "bg-red-100",
    border: "border-red-500",
    text: "text-red-700",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-600 w-5 h-5" />,
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-700",
  },
  info: {
    icon: <Info className="text-blue-600 w-5 h-5" />,
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-700",
  },
};

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  duration = 5000,
}) {
  const [visible, setVisible] = useState(false);
  const style = alertTypes[type];

  useEffect(() => {
    setVisible(true); // animate in

    const hideTimer = setTimeout(() => {
      setVisible(false); // animate out

      const removeTimer = setTimeout(() => {
        if (onClose) onClose(); // remove after animation
      }, 300); // match transition duration

      return () => clearTimeout(removeTimer);
    }, duration);

    return () => clearTimeout(hideTimer);
  }, [onClose, duration]);

  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full transition-all duration-300 ease-in-out transform 
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
    >
      <div
        className={`rounded-lg border px-4 py-3 flex items-start space-x-3 shadow-lg ${style.bg} ${style.border} ${style.text}`}
      >
        <div className="pt-1">{style.icon}</div>
        <div className="flex-1">
          {title && <p className="font-semibold">{title}</p>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-sm font-bold hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  duration: PropTypes.number,
};
