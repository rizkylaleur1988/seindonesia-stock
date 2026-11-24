/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("stock_opnames", {
    id: {
      type: "BIGSERIAL",
      primaryKey: true,
    },
    store_id: {
      type: "bigint",
      notNull: true,
    },
    stock_opname_shift_id: {
      type: "bigint",
      notNull: true,
    },
    stock_opname_date: {
      type: "date",
      notNull: true,
    },
    notes: {
      type: "varchar(500)",
      notNull: false,
    },
    status: {
      type: "smallint",
      notNull: true,
      default: 1,
      comment: "1: DRAFT, 2: SUBMITTED, 3: APPROVED, 4: REJECTED, 9: CANCELLED",
    },
    statused_by: {
      type: "bigint",
      notNull: true,
    },
    statused_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    created_by: {
      type: "bigint",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_by: {
      type: "bigint",
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("stock_opnames", "stock_opnames_store_id_fk", {
    foreignKeys: {
      columns: "store_id",
      references: "stores(id)",
    },
  });

  pgm.addConstraint("stock_opnames", "stock_opnames_stock_opname_shift_id_fk", {
    foreignKeys: {
      columns: "stock_opname_shift_id",
      references: "stock_opname_shifts(id)",
    },
  });

  pgm.addConstraint("stock_opnames", "stock_opnames_created_by_fk", {
    foreignKeys: {
      columns: "created_by",
      references: "users(id)",
    },
  });

  pgm.addConstraint("stock_opnames", "stock_opnames_updated_by_fk", {
    foreignKeys: {
      columns: "updated_by",
      references: "users(id)",
    },
  });

  pgm.addConstraint("stock_opnames", "stock_opnames_statused_by_fk", {
    foreignKeys: {
      columns: "statused_by",
      references: "users(id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("stock_opnames");
};
