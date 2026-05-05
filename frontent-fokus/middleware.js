import { NextResponse } from "next/server";
import { session } from "./lib/public/auth";
import { getDetail } from "./lib/axios/users";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value || null;
  const role = request.cookies.get("role")?.value || null;
  const urlBack = request.cookies.get("prevUrl")?.value || null;
  const authRoute = ["/auth/login", "/auth/daftar", "/auth/lupa-password"];
  const privateRoute = [
    "/form-to",
    "/hasil",
    "/paket",
    "/latihan-soal",
    "/pembahasan",
    "/pembayaran",
    "/pembelian",
    "/profile",
    "/rapor",
    "/redeem-kode",
    "/statistik",
    "/summary-latihan",
    "/waktu-pengerjaan",
    "/testimoni-pengguna",
  ];

  const publicRoute = [
    "/detail-kelas",
    "/detail-to",
    "/detail",
    "/",
    "/kelas-online",
    "/kenali-kami",
    "/program-utama",
    "/testimoni",
    "/tim-fasilitator",
    "/tryout",
    "/zoom",
  ];

  if (
    !token &&
    (privateRoute.includes(pathname) || pathname.startsWith("/srv"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (token && authRoute.includes(pathname)) {
    return NextResponse.redirect(new URL(urlBack, request.url));
  }
  if (role === "admin" && !pathname.startsWith("/srv")) {
    return NextResponse.redirect(new URL(urlBack, request.url));
  }

  if (pathname.startsWith("/srv") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (
    request.nextUrl.pathname ===
    "/.well-known/appspecific/com.chrome.devtools.json"
  ) {
    return new Response("{}", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (token) {
    try {
      const res = await session(token);

      // const dataDetail = await getDetail(token)
      // const keysToCheck = ['kota_kab', 'name', 'no_wa', 'username', 'tingkat_pend', 'provisi'];
      // // const pinCek =['pin']
      // const hasNullValues = keysToCheck.some(key => dataDetail[key] === "");
      // // const pinValues = pinCek.some(key => dataDetail[key] === null);
      // if(res.data[0].detail.is_active && hasNullValues && role ==='users'){
      //   return NextResponse.redirect(new URL('/auth/data-diri', request.url));
      // }
      // if(res.data[0].detail.is_active && pinValues && role ==='users'){
      //   return NextResponse.redirect(new URL('/auth/pin', request.url));
      // }
      if (res.data[0].detail.is_active) {
        return NextResponse.next();
      }
    } catch (error) {
      //  //  console.log("Error checking session:", error);
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      response.cookies.set("sessionExpired", "true", { path: "/", maxAge: 20 });
      response.cookies.delete("token");
      response.cookies.delete("role");
      return response;
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/detail-kelas",
    "/detail-to",
    "/detail",
    "/",
    "/kelas-online",
    "/kenali-kami",
    "/program-utama",
    "/testimoni",
    "/tim-fasilitator",
    "/tryout",
    "/paket",
    "/zoom",
    "/auth/login",
    "/auth/daftar",
    "/auth/lupa-password",
    "/form-to",
    "/hasil",
    "/latihan-soal",
    "/pembahasan",
    "/pembayaran",
    "/pembelian",
    "/profile",
    "/rapor",
    "/redeem-kode",
    "/statistik",
    "/summary-latihan",
    "/testimoni-pengguna",
    "/waktu-pengerjaan",
    "/srv/:path*",
  ],
};
