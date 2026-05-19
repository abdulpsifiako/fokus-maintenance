"use client";
import Editor from "@/components/admin/editor";
import AdminLayout from "@/pages/layouts/adminLayout";
import { Paperclip } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import {
  addBannerImage,
  addInfo,
  addInstagramPost,
  addKebijakanPrivacy,
  addKenaliKami,
  addTermsCondition,
  getLatestInfo,
  updateInfoStatus,
  uploadFile,
} from "@/lib/axios/landing";
import Alert from "@/components/public/alert";
import Preview from "@/components/admin/privewCode";
import Image from "next/image";

function LandingPageTabs() {
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [activeTab, setActiveTab] = useState("info");
  const [termsContent, setTermsContent] = useState("");
  const [kenaliKami, setKenaliKami] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [igFile, setIgFile] = useState(null);
  const [priviewIgFIle, setPriviewIgFile] = useState(null);
  const [infoTerakhir, setInfoTerakhir] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    link: "",
    deskripsi: "",
  });
  const [formInfo, setFormInfo] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    link: "",
    status: false,
  });
  const tabs = [
    { id: "info", label: "Info Landing Page" },
    { id: "pengumuman", label: "Info & Pengumuman" }, // ← tambahkan ini
    { id: "terms", label: "Syarat dan Ketentuan" },
    { id: "about", label: "Kenali Kami" },
    { id: "privacy", label: "Kebijakan Privasi" },
  ];

  const handleAddInstagram = async () => {
    try {
      if (!igFile) {
        setAlert({
          type: "error",
          title: "Info",
          message: "Pilih gambar banner dahulu",
        });
        setIgFile(null);
        setPriviewIgFile(null);
        return;
      }
      if (form.judul === "" || form.link === "" || form.deskripsi === "") {
        setAlert({
          type: "error",
          title: "Info",
          message: "Judul, Deskripsi, dan Link tidak boleh kosong",
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", igFile);
      const res = await uploadFile(formData, token);

      await addInstagramPost({ ...form, imageUrl: res.data[0].fileUrl }, token);
      setForm({
        judul: "",
        link: "",
        deskripsi: "",
      });
      setIgFile(null);
      setPriviewIgFile(null);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
    } catch (error) {
      // //  //  console.log(error)
      const res = error.response.data;
      if (res.status == 403) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: error.message,
        });
      }
      setForm({
        judul: "",
        link: "",
        deskripsi: "",
      });
      setIgFile(null);
      setPriviewIgFile(null);
      return;
    }
  };
  const handleToggleStatus = async () => {
    if (!infoTerakhir) return;
    setTogglingStatus(true);
    try {
      const res = await updateInfoStatus(
        { id: infoTerakhir.id, status: !infoTerakhir.status },
        token,
      );
      if (res.status === 200) {
        setInfoTerakhir((prev) => ({ ...prev, status: !prev.status }));
        setAlert({ type: "success", title: "Info", message: res.message });
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Info",
        message: "Gagal update status",
      });
    } finally {
      setTogglingStatus(false);
    }
  };
  const handleTermNCondition = async () => {
    try {
      const res = await addTermsCondition({ term: termsContent }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      return;
    } catch (error) {
      //  //  console.log(error.response)
      const res = error.response.data;
      if (res.status == 403) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: error.message,
        });
      }
      return;
    }
  };
  const handleKenaliKami = async () => {
    try {
      const res = await addKenaliKami({ kenali: kenaliKami }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      return;
    } catch (error) {
      const res = error.response.data;
      if (res.status == 403) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: error.message,
        });
      }
      return;
    }
  };
  const handleAddInfo = async () => {
    try {
      if (!formInfo.judul || !formInfo.deskripsi) {
        setAlert({
          type: "error",
          title: "Info",
          message: "Judul dan deskripsi wajib diisi",
        });
        return;
      }
      const res = await addInfo(formInfo, token);
      if (res.status === 200) {
        setAlert({ type: "success", title: "Info", message: res.message });
        setInfoTerakhir(res.data);
        setFormInfo({
          judul: "",
          deskripsi: "",
          tanggal: "",
          link: "",
          status: false,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Info",
        message: error?.response?.data?.message || error.message,
      });
    }
  };

  const handleKebijakanPrivacy = async () => {
    try {
      const res = await addKebijakanPrivacy({ privacy: privacyContent }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      return;
    } catch (error) {
      const res = error.response.data;
      if (res.status == 403) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: error.message,
        });
      }
      return;
    }
  };
  const handleUploadBanner = async () => {
    try {
      if (!bannerFile) {
        setAlert({
          type: "error",
          title: "Info",
          message: "Pilih gambar banner dahulu",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", bannerFile);
      const res = await uploadFile(formData, token);

      await addBannerImage({ url: res.data[0].fileUrl }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      setBannerFile(null);
      setBannerPreview(null);
    } catch (error) {
      // //  //  console.log(error)
      const res = error.response.data;
      if (res.status == 403) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: error.message,
        });
      }
      return;
    }
  };
  useEffect(() => {
    if (activeTab === "pengumuman") {
      getLatestInfo().then((res) => {
        if (res?.data) setInfoTerakhir(res.data);
      });
    }
  }, [activeTab]);
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-primary mb-4">Landing Page</h2>

      {/* <div className="mb-6">
        <input
          type="text"
          placeholder="Search ."
          className="border px-3 py-2 rounded-lg text-sm max-w-xs"
        />
      </div> */}

      <div className="flex space-x-6 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 border-b-2 font-semibold text-sm hover:cursor-pointer ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-gray-400 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==== Tab Content ==== */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Banner</label>
            <div className="flex gap-3 items-center">
              <div className="items-center my-auto">
                <Paperclip />
              </div>
              <label className="border px-3 py-2 rounded text-sm h-8 w-xs cursor-pointer flex items-center gap-2">
                <span id="fileLabel">Pilih file (max 5 MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      setAlert({
                        type: "error",
                        title: "Info",
                        message: "Banner tidak boleh dari 5MB",
                      });
                      e.target.value = "";
                      setBannerFile(null);
                      setBannerPreview(null);
                      document.getElementById("fileLabel").textContent =
                        "Pilih file (max 5 MB)";
                    } else if (file) {
                      setBannerFile(file);
                      setBannerPreview(URL.createObjectURL(file));
                      document.getElementById("fileLabel").textContent =
                        file.name;
                    }
                  }}
                />
              </label>
              <div>
                <button
                  type="button"
                  className="bg-primary p-2 justify-end my-3 text-white rounded text-xs"
                  onClick={async () => {
                    handleUploadBanner();
                    document.getElementById("fileLabel").textContent =
                      "Pilih file (max 5 MB)";
                  }}
                >
                  Simpan
                </button>
              </div>
            </div>
            {bannerPreview && (
              <div className="mt-2">
                <Image
                  width={1000}
                  height={1000}
                  src={bannerPreview}
                  alt="Preview Banner"
                  className="max-h-40 rounded border"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Maksimal file 5MB</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Instagram</label>

            <div className="grid grid-cols-4 gap-2 font-semibold text-sm text-white">
              <div className="bg-gray-500 py-2 text-center rounded">Judul</div>
              <div className="bg-gray-500 py-2 text-center rounded">
                Deskripsi
              </div>
              <div className="bg-gray-500 py-2 text-center rounded">Link</div>
              <div className="bg-gray-500 py-2 text-center rounded">Gambar</div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2">
              <textarea
                placeholder="Masukkan Judul"
                name="judul"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                rows={8}
                className="border px-2 py-1 rounded text-sm w-full overflow-auto"
              />
              <textarea
                placeholder="Masukkan Deskripsi"
                name="deskripsi"
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                rows={8}
                className="border px-2 py-1 rounded text-sm w-full overflow-auto"
              />
              <textarea
                placeholder="Masukkan Link"
                name="link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                rows={8}
                className="border px-2 py-1 rounded text-sm w-full overflow-auto"
              />
              <div>
                <label className="border px-3 py-2 rounded text-sm h-8 cursor-pointer flex items-center gap-2">
                  <span id="igfileLabel">Pilih file (max 5 MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        setAlert({
                          type: "error",
                          title: "Info",
                          message: "Photo IG tidak boleh dari 5MB",
                        });
                        e.target.value = "";
                        setIgFile(null);
                        setPriviewIgFile(null);
                        document.getElementById("igfileLabel").textContent =
                          "Pilih file (max 5 MB)";
                      } else if (file) {
                        setIgFile(file);
                        setPriviewIgFile(URL.createObjectURL(file));
                        document.getElementById("igfileLabel").textContent =
                          file.name;
                      }
                    }}
                  />
                </label>
                {priviewIgFIle && (
                  <div className="mt-2">
                    <Image
                      width={1000}
                      height={1000}
                      src={priviewIgFIle}
                      alt="Preview Banner"
                      className="max-h-40 rounded border"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-start w-full mt-3 gap-2">
                  <button
                    type="button"
                    className="bg-primary text-white p-2 rounded text-xs cursor-pointer"
                    onClick={handleAddInstagram}
                  >
                    Tambah Postingan Instagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "terms" && (
        <>
          <div>
            <h3 className="block text-sm font-medium mb-2">
              Syarat dan Ketentuan
            </h3>
            <Editor onTextChange={(html) => setTermsContent(html)} />
          </div>

          {/* Outputnya muncul tepat di bawah editor */}
          <div className="mt-4 border p-3 rounded prose bg-white">
            <h4 className="text-sm mb-2">Preview:</h4>
            <Preview html={termsContent} />
          </div>

          <button
            type="button"
            onClick={handleTermNCondition}
            className="bg-primary p-2 justify-end my-3 text-white rounded-md text-xs"
          >
            Simpan
          </button>
        </>
      )}

      {activeTab === "about" && (
        <>
          <div>
            <h3 className="block text-sm font-medium mb-2">Kenali Kami</h3>
            <Editor onTextChange={(html) => setKenaliKami(html)} />
          </div>

          {/* Outputnya muncul tepat di bawah editor */}
          <div className="mt-4 border p-3 rounded prose bg-white">
            <h4 className="text-sm mb-2">Preview:</h4>
            <Preview html={kenaliKami} />
          </div>

          <button
            type="button"
            onClick={handleKenaliKami}
            className="bg-primary p-2 justify-end my-3 text-white rounded-md text-xs"
          >
            Simpan
          </button>
        </>
      )}

      {activeTab === "privacy" && (
        <>
          <div>
            <h3 className="block text-sm font-medium mb-2">
              Kebijakan Privasi
            </h3>
            <Editor onTextChange={(html) => setPrivacyContent(html)} />
          </div>

          {/* Outputnya muncul tepat di bawah editor */}
          <div className="mt-4 border p-3 rounded prose bg-white">
            <h4 className="text-sm mb-2">Preview:</h4>
            <Preview html={privacyContent} />
          </div>

          <button
            type="button"
            onClick={handleKebijakanPrivacy}
            className="bg-primary p-2 justify-end my-3 text-white rounded-md text-xs"
          >
            Simpan
          </button>
        </>
      )}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {activeTab === "pengumuman" && (
        <div className="space-y-4 max-w-xl">
          <h3 className="text-sm font-semibold text-gray-700">
            Tambah Info / Pengumuman
          </h3>

          {/* Info terakhir */}
          {/* {infoTerakhir && (
            <div
              className="bg-[#fae9e7] border border-[#cb1e0e]/20
        rounded-lg p-4 text-sm mb-2"
            >
              <p className="text-xs text-gray-500 mb-1">Info terakhir:</p>
              <p className="font-semibold text-[#cb1e0e]">
                {infoTerakhir.judul}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {infoTerakhir.deskripsi}
              </p>
              {infoTerakhir.tanggal && (
                <p className="text-gray-400 text-xs mt-1">
                  📅{" "}
                  {new Date(infoTerakhir.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )} */}
          {infoTerakhir && (
            <div className="bg-[#fae9e7] border border-[#cb1e0e]/20 rounded-lg p-4 text-sm mb-2">
              {/* Header + Toggle */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">Info terakhir:</p>

                {/* ✅ Toggle status aktif/tidak aktif */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${infoTerakhir.status ? "text-green-600" : "text-gray-400"}`}
                  >
                    {infoTerakhir.status ? "Aktif" : "Tidak Aktif"}
                  </span>
                  <button
                    type="button"
                    disabled={togglingStatus}
                    onClick={handleToggleStatus}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200
            ${infoTerakhir.status ? "bg-green-500" : "bg-gray-300"}
            ${togglingStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
            shadow transition-transform duration-200
            ${infoTerakhir.status ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>

              <p className="font-semibold text-[#cb1e0e]">
                {infoTerakhir.judul}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {infoTerakhir.deskripsi}
              </p>
              {infoTerakhir.tanggal && (
                <p className="text-gray-400 text-xs mt-1">
                  📅{" "}
                  {new Date(infoTerakhir.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}

          {/* Form */}
          <label className="block">
            <span className="text-sm font-medium">
              Judul <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={formInfo.judul}
              onChange={(e) =>
                setFormInfo({ ...formInfo, judul: e.target.value })
              }
              placeholder="Contoh: Pendaftaran PPPK Dibuka"
              className="mt-1 w-full border px-3 py-2 rounded-md text-sm
          focus:border-[#cb1e0e] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Deskripsi <span className="text-red-500">*</span>
            </span>
            <textarea
              rows={4}
              value={formInfo.deskripsi}
              onChange={(e) =>
                setFormInfo({ ...formInfo, deskripsi: e.target.value })
              }
              placeholder="Isi pengumuman..."
              className="mt-1 w-full border px-3 py-2 rounded-md text-sm
          focus:border-[#cb1e0e] focus:outline-none resize-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Tanggal</span>
            <span className="text-xs text-gray-400 ml-1">(opsional)</span>
            <input
              type="date"
              value={formInfo.tanggal}
              onChange={(e) =>
                setFormInfo({ ...formInfo, tanggal: e.target.value })
              }
              className="mt-1 w-full border px-3 py-2 rounded-md text-sm
          focus:border-[#cb1e0e] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Link</span>
            <span className="text-xs text-gray-400 ml-1">(opsional)</span>
            <input
              type="url"
              value={formInfo.link}
              onChange={(e) =>
                setFormInfo({ ...formInfo, link: e.target.value })
              }
              placeholder="https://..."
              className="mt-1 w-full border px-3 py-2 rounded-md text-sm
          focus:border-[#cb1e0e] focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={handleAddInfo}
            className="bg-primary text-white px-5 py-2
        rounded-md text-sm font-semibold hover:opacity-80 transition-all mb-6"
          >
            Simpan Pengumuman
          </button>
        </div>
      )}
    </div>
  );
}

LandingPageTabs.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default LandingPageTabs;
