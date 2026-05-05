import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { createHistory } from "@/lib/axios/programUtama";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import "plyr-react/plyr.css";

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

  const videoSource = {
    type: "video",
    sources: [{ src: videoUrl, type: "video/mp4", size: 720 }],
    poster,
  };

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
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [onHistoryCreated, token, programId, data?.title]);

  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;

    let sudahTampil = false;
    let interval;

    const startInterval = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (!video || isNaN(video.duration)) return;

        const current = video.currentTime;
        const duration = video.duration;

        if (video.paused || duration === 0) return;

        if (!sudahTampil && current >= duration / 2 && upload) {
          handleHistory();
          sudahTampil = true;
        }

        if (current >= duration) {
          clearInterval(interval);
        }
      }, 1000);
    };
    const handleEnded = () => {
      //  //  console.log("🎬 Video selesai — reload halaman...")
      window.location.reload();
    };

    // Jalankan interval hanya setelah video mulai diputar
    video.addEventListener("play", startInterval);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", startInterval);
      video.removeEventListener("ended", handleEnded);
      clearInterval(interval);
    };
  }, [videoUrl, handleHistory, upload]);

  return (
    <div className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <Plyr source={videoSource} options={plyrOptions} />

      {/* {logo && (
        <div className="absolute top-2 left-2 z-20">
          <Image
            src={logo}
            alt="Watermark Logo"
            width={80}
            height={80}
            className="rounded-md opacity-80 select-none pointer-events-none"
          />
        </div>
      )} */}

      <style jsx global>{`
        .plyr--video {
          border-radius: 16px;
        }
        .plyr__controls {
          background: rgba(0, 0, 0, 0.45) !important;
          border-radius: 0 0 16px 16px;
          padding: 8px;
        }
        .plyr__control--overlaid {
          background: rgba(220, 38, 38, 0.9) !important;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
