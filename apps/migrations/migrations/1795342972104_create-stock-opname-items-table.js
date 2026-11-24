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
  pgm.createTable("stock_opname_items", {
    id: {
      type: "BIGSERIAL",
      primaryKey: true,
    },
    stock_opname_id: {
      type: "bigint",
      notNull: true,
    },
    product_id: {
      type: "bigint",
      notNull: true,
    },
    counted_qty: {
      type: "integer",
      notNull: true,
    },
    system_qty: {
      type: "integer",
      notNull: false,
    },
    notes: {
      type: "varchar(500)",
      notNull: false,
    },
  });

  pgm.addConstraint("stock_opname_items", "stock_opname_items_unique", {
    unique: ["stock_opname_id", "product_id"],
  });

  pgm.addConstraint(
    "stock_opname_items",
    "stock_opname_items_stock_opname_id_fk",
    {
      foreignKeys: {
        columns: "stock_opname_id",
        references: "stock_opnames(id)",
      },
    },
  );

  pgm.addConstraint("stock_opname_items", "stock_opname_items_product_id_fk", {
    foreignKeys: {
      columns: "product_id",
      references: "products(id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("stock_opname_items");
};
