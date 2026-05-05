const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Info",
  tableName: "info",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    judul: {
      type: "text",
      nullable: true,
    },
    deskripsi: {
      type: "text",
      nullable: true,
    },
    tanggal: {
      type: "text",
      nullable: true,
    },
    link: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "timestamptz",
      nullable: true,
    },
    updated_at: {
      type: "timestamptz",
      nullable: true,
    },
  },
});
