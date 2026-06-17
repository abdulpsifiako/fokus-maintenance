import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { createHistory } from "@/lib/axios/programUtama";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import "plyr-react/plyr.css";

const getVideoSource = (videoUrl, poster) => {
  if (!videoUrl) return null;

  // YouTube
  const ytMatch = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    return {
      type: "video",
      sources: [{ src: ytMatch[1], provider: "youtube" }],
    };
  }

  // Vimeo
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: "video",
      sources: [{ src: vimeoMatch[1], provider: "vimeo" }],
    };
  }

  // Deteksi tipe MIME dari ekstensi file
  const ext = videoUrl.split("?")[0].split(".").pop().toLowerCase();
  const mimeMap = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    ogv: "video/ogg",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    avi: "video/x-msvideo",
    m3u8: "application/x-mpegURL",
    mpd: "application/dash+xml",
  };

  const mimeType = mimeMap[ext] || "video/mp4";

  return {
    type: "video",
    sources: [{ src: videoUrl, type: mimeType, size: 720 }],
    poster,
  };
};

// ── Cek apakah URL adalah YouTube atau Vimeo ─────────────────────────────────
const isEmbedProvider = (videoUrl) => {
  if (!videoUrl) return false;
  return /youtube\.com|youtu\.be/.test(videoUrl) || /vimeo\.com/.test(videoUrl);
};

export default function VideoPlayer({
  videoUrl,
  poster = "/9720011.jpg",
  logo = "/logo.png",
  upload,
  data,
  programId,
  onHistoryCreated,
}) {
  const token = Cookies.get("token");
  const containerRef = useRef(null);
  const plyrRef = useRef(null); // ← ref ke instance Plyr

  const videoSource = getVideoSource(videoUrl, poster);
  const isEmbed = isEmbedProvider(videoUrl);

  // ── Suppress Plyr/YouTube iframe race condition error ─────────────────────
  // Error "Cannot read properties of null (reading 'getAttribute')" muncul
  // saat YouTube iframe API callback (onYouTubeIframeAPIReady) terpanggil
  // setelah komponen unmount. Ini bug di Plyr, bukan kode kita.
  useEffect(() => {
    const originalError = window.onerror;
    window.onerror = (msg, src, line, col, err) => {
      if (
        typeof msg === "string" &&
        msg.includes("getAttribute") &&
        (src?.includes("plyr") || src?.includes("www-widgetapi"))
      ) {
        return true; // suppress — jangan tampilkan di console
      }
      return originalError ? originalError(msg, src, line, col, err) : false;
    };

    return () => {
      window.onerror = originalError;
    };
  }, []);

  // ── Destroy Plyr saat unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      try {
        if (plyrRef.current?.plyr) {
          plyrRef.current.plyr.destroy();
        }
      } catch (_) {
        // abaikan error saat destroy
      }
    };
  }, []);

  const plyrOptions = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "restart",
      "settings",
      "airplay",
      "pip",
      "fullscreen",
    ],
    ratio: "16:9",
    youtube: { noCookie: true, rel: 0, showinfo: 0 },
    vimeo: { byline: false, portrait: false, title: false },
  };

  const handleHistory = useCallback(async () => {
    try {
      await createHistory(
        {
          jenis: "Program Utama",
          typelatihan: "Video",
          orderstatus: "success",
          submateri: data?.title,
          id_program: programId,
        },
        token,
      );
      if (onHistoryCreated) onHistoryCreated();
    } catch (error) {}
  }, [onHistoryCreated, token, programId, data?.title]);

  // ── Progress tracking & ended handler ────────────────────────────────────
  useEffect(() => {
    let video = document.querySelector("video");
    let interval = null;
    let cleanupFn = null;

    const attach = (v) => {
      let sudahTampil = false;

      const startInterval = () => {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!v || isNaN(v.duration)) return;
          const current = v.currentTime;
          const duration = v.duration;
          if (v.paused || duration === 0) return;
          if (!sudahTampil && current >= duration / 2 && upload) {
            handleHistory();
            sudahTampil = true;
          }
          if (current >= duration) clearInterval(interval);
        }, 1000);
      };

      const handleEnded = () => window.location.reload();

      v.addEventListener("play", startInterval);
      v.addEventListener("ended", handleEnded);

      cleanupFn = () => {
        v.removeEventListener("play", startInterval);
        v.removeEventListener("ended", handleEnded);
        clearInterval(interval);
      };
    };

    if (video) {
      attach(video);
    } else {
      const observer = new MutationObserver(() => {
        const v = document.querySelector("video");
        if (v) {
          attach(v);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        cleanupFn?.();
      };
    }

    return () => cleanupFn?.();
  }, [videoUrl, handleHistory, upload]);

  // ── Proteksi: disable klik kanan, drag, dan shortcut ─────────────────────
  // Hanya untuk video file langsung (bukan YouTube/Vimeo yang sudah dilindungi platform)
  useEffect(() => {
    if (isEmbed) return;

    let cleanupFn = null;

    const attach = () => {
      const container = document.querySelector(".plyr");
      const video = document.querySelector("video");
      if (!container || !video) return false;

      const blockContextMenu = (e) => e.preventDefault();
      const blockDrag = (e) => e.preventDefault();
      const blockSave = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") e.preventDefault();
      };

      container.addEventListener("contextmenu", blockContextMenu);
      video.addEventListener("contextmenu", blockContextMenu);
      video.addEventListener("dragstart", blockDrag);
      document.addEventListener("keydown", blockSave);

      cleanupFn = () => {
        container.removeEventListener("contextmenu", blockContextMenu);
        video.removeEventListener("contextmenu", blockContextMenu);
        video.removeEventListener("dragstart", blockDrag);
        document.removeEventListener("keydown", blockSave);
      };

      return true;
    };

    // Coba attach dulu — kalau belum ada, pakai MutationObserver
    if (!attach()) {
      const observer = new MutationObserver(() => {
        if (attach()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        cleanupFn?.();
      };
    }

    return () => cleanupFn?.();
  }, [videoUrl, isEmbed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200"
      // Disable klik kanan di level div juga sebagai fallback
      onContextMenu={(e) => !isEmbed && e.preventDefault()}
    >
      <Plyr ref={plyrRef} source={videoSource} options={plyrOptions} />

      {/*
        Overlay transparan di atas video (hanya untuk file langsung).
        Fungsi:
        - Mencegah klik kanan langsung ke elemen <video>
        - Membiarkan kontrol Plyr di bawah tetap bisa diklik
          (overlay hanya menutupi area video, bukan controls)
        Catatan: overlay ini tidak menghalangi network tab,
        tapi cukup mempersulit klik kanan biasa.
      */}
      {!isEmbed && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            // Hanya tutup area video (atas), bukan kontrol Plyr (bawah ~48px)
            bottom: "48px",
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      <style jsx global>{`
        .plyr--video {
          border-radius: 16px;
        }
        .plyr__controls {
          background: rgba(0, 0, 0, 0.45) !important;
          border-radius: 0 0 16px 16px;
          padding: 8px;
          /* pastikan controls tetap di atas overlay */
          position: relative;
          z-index: 20;
        }
        .plyr__control--overlaid {
          background: rgba(220, 38, 38, 0.9) !important;
          border-radius: 9999px;
          /* tombol play besar tetap bisa diklik */
          z-index: 20;
          pointer-events: all;
        }
        /* Sembunyikan download button bawaan browser di video */
        video::-internal-media-controls-download-button {
          display: none !important;
        }
        video::-webkit-media-controls-enclosure {
          overflow: hidden;
        }
        video::-webkit-media-controls-panel {
          width: calc(100% + 30px);
        }
      `}</style>
    </div>
  );
}
