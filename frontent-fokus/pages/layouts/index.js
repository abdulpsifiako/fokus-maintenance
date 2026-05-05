import Footer from "../../components/user/footer";
import Navigation from "../../components/user/navigasi";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation selalu di atas */}
      <Navigation />

      {/* konten utama fleksibel mengisi ruang */}
      <main className="flex-1 border-x-transparent pt-17 sm:pt-16">
        {children}
      </main>

      {/* Footer nempel bawah */}
      <Footer />
    </div>
  );
}
