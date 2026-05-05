const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "LaporanSoal",
  tableName: "laporan_soal",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    data_user: {
      type: "jsonb",
      nullable: true,
    },
    data_soal: {
      type: "jsonb",
      nullable: true,
    },
    laporan: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamptz",
      default: () => "CURRENT_TIMESTAMP",
      createDate: true,
    },
    updated_at: {
      type: "timestamptz",
      onUpdate: () => "CURRENT_TIMESTAMP",
      updateDate: true,
      nullable: true,
    },
    is_deleted: {
      type: "boolean",
      default: false,
    },
  },
});
