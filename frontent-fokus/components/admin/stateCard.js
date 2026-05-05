export default function StatCard({ icon, title, value }) {
  return (
    <div className="bg-primary text-white rounded-lg p-4 flex flex-col justify-between shadow-md">
      <h2 className="font-semibold text-lg text-center">{title}</h2>
      <div className="flex items-center justify-center gap-2">
        {icon}
        <p className="text-2xl font-bold text-right">{value}</p>
      </div>
    </div>
  );
}
