import { getKenaliKami } from "@/lib/axios/landing";

export default function KenaliKami({ kenali }) {
  return (
    <div className="px-7 mt-3 font-poppins">
      <header className="flex mx-3.5 space-x-2 text-xs">
        <p>Tentang</p>
        <span>›</span>
        <p>Kenali kami</p>
      </header>

      <div className="w-full text-sm px-4">
        {kenali ? (
          <div
            className="prose max-w-none ql-editor"
            dangerouslySetInnerHTML={{ __html: kenali }}
          />
        ) : (
          <p className="text-gray-500 text-sm">Konten belum tersedia.</p>
        )}
      </div>
    </div>
  );
}

// 🔥 SSG + ISR
export async function getStaticProps() {
  try {
    const res = await getKenaliKami();

    return {
      props: {
        kenali: res?.data?.properties?.kenali || "",
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Gagal fetch Kenali Kami:", error?.message);

    // ⬇️ jangan throw error saat build
    return {
      props: {
        kenali: "",
      },
      revalidate: 30,
    };
  }
}
