const { DataSource } = require("typeorm");
const usersEntity = require("../entities/usersEntity");
const landingEntity = require("../entities/landingEntitt");
const kebijakanEntity = require("../entities/kebijakanPrivasiEntity");
const kenaliEntity = require("../entities/kenaliKamiEntity");
const syaratEntity = require("../entities/syaratKetentuanEntity");
const testimoniEntity = require("../entities/testimoniEntity");
const logEntity = require("../entities/logEntity");
const bannerEntity = require("../entities/bannerEntity");
const instagramEntity = require("../entities/instagramEntity");
const fasilitatorEntity = require("../entities/fasilitatorEntity");
const jenisProgramEntity = require("../entities/jenisProgramEntity");
const programEntity = require("../entities/programEntity");
const programUtamaEntity = require("../entities/programUtamaEntity");
const videoEntity = require("../entities/videoEntity");
const latihanEntity = require("../entities/latihanEntity");
const answerUser = require("../entities/answerUser");
const transaksiProgramEntity = require("../entities/transaksiProgramEntity");
const laporanSoalEntity = require("../entities/laporanSoalEntity");
const voucherEntity = require("../entities/voucherEntity");
const settingEntity = require("../entities/settingEntity");
const historyEntity = require("../entities/historyEntity");
const tryoutEntity = require("../entities/tryoutEntity");
const kelasOnlineEntity = require("../entities/kelasOnlineEntity");
const reedemEntity = require("../entities/reedemEntity");
const pengalamanEntity = require("../entities/pengalamanEntity");
const jenisKelasEntity = require("../entities/jenisKelasEntity");
const jenisTOEntity = require("../entities/jenisTOEntity");
const infoEntity = require("../entities/infoEntity");

const conndb = new DataSource({
  type: "postgres",
  host: "148.230.100.25",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATA,
  synchronize: true,
  // logging: true,
  schema: "public",
  entities: [
    usersEntity,
    landingEntity,
    kebijakanEntity,
    kenaliEntity,
    syaratEntity,
    testimoniEntity,
    logEntity,
    bannerEntity,
    instagramEntity,
    fasilitatorEntity,
    jenisProgramEntity,
    programEntity,
    programUtamaEntity,
    videoEntity,
    latihanEntity,
    answerUser,
    transaksiProgramEntity,
    laporanSoalEntity,
    voucherEntity,
    settingEntity,
    historyEntity,
    tryoutEntity,
    kelasOnlineEntity,
    reedemEntity,
    pengalamanEntity,
    jenisKelasEntity,
    jenisTOEntity,
    infoEntity,
  ],
});

module.exports = conndb;
