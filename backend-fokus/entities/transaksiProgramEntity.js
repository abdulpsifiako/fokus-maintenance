const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TransaksiProgram",
  tableName: "transaksi_program",
  columns: {
    id: {
      primary: true,
      type: "text",
    },

    order_id: {
      type: "varchar",
      length: 100,
      nullable: true,
    },

    user_id: {
      type: "text",
      nullable: true,
    },

    payment_type: {
      type: "varchar",
      length: 30,
      nullable: true,
    },

    bank: {
      type: "varchar",
      length: 30,
      nullable: true,
    },

    channel: {
      type: "varchar",
      length: 30,
      nullable: true,
    },

    va_number: {
      type: "varchar",
      length: 50,
      nullable: true,
    },

    store: {
      type: "varchar",
      length: 30,
      nullable: true,
    },

    metode: {
      type: "varchar",
      nullable: true,
    },

    jenis: {
      type: "varchar",
      length: 30,
      nullable: true,
    },

    program_id: {
      type: "text",
      nullable: true,
    },

    valid_until: {
      type: "timestamptz",
      nullable: true,
    },

    status: {
      type: "varchar",
      length: 30,
      nullable: true,
    },

    bank_response: {
      type: "jsonb",
      nullable: true,
    },

    properties: {
      type: "jsonb",
      nullable: true,
    },

    data_user: {
      type: "jsonb",
      nullable: true,
    },

    created_at: {
      type: "timestamptz",
      default: () => "CURRENT_TIMESTAMP",
      createDate: true,
    },

    updated_at: {
      type: "timestamptz",
      updateDate: true,
      onUpdate: () => "CURRENT_TIMESTAMP",
      nullable: true,
    },

    is_deleted: {
      type: "boolean",
      default: false,
    },
  },
});
