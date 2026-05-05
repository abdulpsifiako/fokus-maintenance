import { useRef, useState } from "react";

const OtpInput = ({ length = 6, onChange }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      const fullOtp = newOtp.join("");
      if (onChange) onChange(fullOtp);

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between space-x-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          onChange={(e) => handleOtpChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ))}
    </div>
  );
};

export default OtpInput;
