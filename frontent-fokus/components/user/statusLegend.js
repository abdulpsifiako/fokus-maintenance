export default function StatusLegend() {
  const items = [
    { label: "Benar", color: "bg-blue-600" },
    { label: "Salah", color: "bg-red-500" },
    { label: "Kosong", color: "bg-gray-500" },
  ];

  return (
    <div className="flex gap-4 w-full justify-end py-3 text-[7px] font-medium">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className={`w-4 h-4 rounded-full ${item.color} inline-block`}></span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
