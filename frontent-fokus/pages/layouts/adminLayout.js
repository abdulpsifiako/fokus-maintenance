import HeaderAdmin from "../../components/admin/headerAdmin";
import NavigasiAdmin from "../../components/admin/navigationAdmin";
import AsideAdmin from "../../components/admin/asideAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="font-poppins h-screen overflow-hidden"> {/* full screen & non-scrollable */}
      <NavigasiAdmin />
      <HeaderAdmin />
      <div className="flex pt-20 h-screen"> {/* offset header height */}
        <AsideAdmin />
        <main className="flex-1 overflow-y-auto p-4 border-l-2 border-l-primary">
          {children}
          <footer className="bottom-0 text-xs fixed text-gray-500 bg-white w-full py-5 mt-3">
            © 2025 fokusedu. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
