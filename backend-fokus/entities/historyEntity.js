const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "History",
  tableName: "history",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    materi: {
      type: "varchar",
      nullable: true,
    },
    submateri: {
      type: "varchar",
      nullable: true,
    },
    orderid: {
      type: "varchar",
      nullable: true,
    },
    userid: {
      type: "varchar",
      nullable: true,
    },
    jenis: {
      type: "varchar",
      nullable: true,
    },
    id_program: {
      type: "varchar",
      nullable: true,
    },
    orderstatus: {
      type: "varchar",
      nullable: true,
    },
    typelatihan: {
      type: "varchar",
      nullable: true,
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
