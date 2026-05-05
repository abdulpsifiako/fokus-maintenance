import { useEffect, useState } from "react";
import { getTermsCondition } from "@/lib/axios/landing";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js";

export default function SyaratKetentuan() {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const result = await getTermsCondition();
        const termHtml = result.data?.properties?.term || "";

        setTerms(termHtml);
      } catch (error) {
        console.error("Gagal mengambil syarat & ketentuan", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    if (terms) {
      hljs.highlightAll();
    }
  }, [terms]);

  return (
    <div className="px-7 mt-3 font-poppins">
      <header className="flex mx-3.5 space-x-2 text-xs">
        <p>Tentang</p>
        <span>›</span>
        <p>Syarat & Ketentuan</p>
      </header>

      <div className="w-full text-sm">
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <div
            className="prose max-w-none ql-editor"
            dangerouslySetInnerHTML={{ __html: terms }}
          />
        )}
      </div>
    </div>
  );
}
