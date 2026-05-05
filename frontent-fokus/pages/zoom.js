import CardKelasZoom from "../components/user/cardKelasZoom";

export default function ListKelasZoom() {
  return (
    <div className="p-7 sm:px-4 sm:py-4 lg:px-20 xl:px-46 2xl:px-74 font-poppins my-7">
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <CardKelasZoom
          title="Part 1"
          date="2 Juni 2025"
          time="18:20–20:00 WIB"
          status="rekaman"
          password="CASN25"
          modulLink="#"
        />
        <CardKelasZoom
          title="Part 1"
          date="2 Juni 2025"
          time="18:20–20:00 WIB"
          status="masuk"
          password="CASN25"
          modulLink="#"
        />
        <CardKelasZoom
          title="Part 1"
          date="2 Juni 2025"
          time="18:20–20:00 WIB"
          status="countdown"
          password="CASN25"
          modulLink="#"
          countdown="05 : 00 : 00"
        />
        <CardKelasZoom
          title="Part 1"
          date="2 Juni 2025"
          time="18:20–20:00 WIB"
          status="info"
          password="CASN25"
          modulLink="#"
        />
      </div>
    </div>
  );
}
