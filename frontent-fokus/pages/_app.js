import "@/styles/globals.css";
import Layout from "./layouts";
import { Router } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Alert from "@/components/public/alert";
import { Provider } from "react-redux";
import store, { persistor } from "@/lib/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "../styles/quill-codeblock.css";
import LogoLoader from "@/components/logoLoader";

export default function App({ Component, pageProps }) {
  const [alert, setAlert] = useState(null);

  // ✅ Tambahkan state loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Listener navigasi untuk loading logo
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", stopLoading);
    Router.events.on("routeChangeError", stopLoading);

    const run = async () => {
      if (typeof window !== "undefined") {
        const sessionExpired = Cookies.get("sessionExpired");
        const token = Cookies.get("token") || null;

        if (!token) {
          Cookies.remove("role");
          Cookies.remove("prevUrl");
          localStorage.removeItem("persist:root");
          await persistor.purge();
        }

        if (sessionExpired) {
          Cookies.remove("sessionExpired");
          localStorage.removeItem("persist:root");
          await persistor.purge();
          setAlert({
            type: "info",
            title: "Info",
            message: "Tidak bisa login lebih dari 1 perangkat",
          });
          setTimeout(() => setAlert(null), 5000);
        }

        const handleRouteChange = () => {
          const pathname = window.location.pathname;
          const newPath = pathname === "/auth/login" ? "/" : pathname;
          Cookies.set("prevUrl", newPath);
        };

        Router.events.on("routeChangeStart", handleRouteChange);
        return () => {
          Router.events.off("routeChangeStart", handleRouteChange);
        };
      }
    };

    run();

    // ✅ Cleanup listener loading
    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", stopLoading);
      Router.events.off("routeChangeError", stopLoading);
    };
  }, []);

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* ✅ Tampilkan LogoLoader saat navigasi */}
        {loading && <LogoLoader />}

        {getLayout(<Component {...pageProps} />)}

        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </PersistGate>
    </Provider>
  );
}
