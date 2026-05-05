import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { KeyRound } from "lucide-react";
import { useState } from "react";

export default function PasswordButton({ password }) {
  const [show, setShow] = useState(false);

  return (
    <button
      onClick={() => setShow(!show)}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
    >
      <KeyRound size={16} />
      {show ? password : "Lihat Password"}
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );
}
