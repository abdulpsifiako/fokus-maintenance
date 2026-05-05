import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

export default function useExitWarning(active = true) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // ✅ 1. Cegat navigasi Next.js (Link, router.push, dll)
  useEffect(() => {
    if (!active || confirmed) return;

    const handleRouteChange = (url) => {
      setPendingUrl(url);
      setShowModal(true);
      router.events.emit("routeChangeError");
      throw "routeChange aborted";
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [active, confirmed, router]);

  // ✅ 2. Cegat tombol Back browser
  useEffect(() => {
    if (!active || confirmed) return;

    window.history.pushState(null, "", window.location.href);

    const handlePop = () => {
      window.history.pushState(null, "", window.location.href);
      setPendingUrl(null);
      setShowModal(true);
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [active, confirmed]);

  // ✅ 3. Cegat refresh / tutup tab
  useEffect(() => {
    if (!active || confirmed) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [active, confirmed]);

  // User klik "Tetap di sini"
  const handleStay = useCallback(() => {
    setShowModal(false);
    setPendingUrl(null);
  }, []);

  // User klik "Keluar" — lanjutkan navigasi yang ditunda
  const handleLeave = useCallback(() => {
    setConfirmed(true);
    setShowModal(false);

    setTimeout(() => {
      if (pendingUrl) {
        router.push(pendingUrl);
      } else {
        router.back();
      }
    }, 0);
  }, [pendingUrl, router]);

  return { showModal, handleStay, handleLeave };
}
