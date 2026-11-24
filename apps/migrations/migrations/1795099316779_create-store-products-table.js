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
  pgm.createTable("store_products", {
    id: {
      type: "BIGSERIAL",
      primaryKey: true,
    },
    store_id: {
      type: "bigint",
      notNull: true,
    },
    product_id: {
      type: "bigint",
      notNull: true,
    },
    previous_stock: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    stock: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.addConstraint("store_products", "store_products_unique", {
    unique: ["store_id", "product_id"],
  });
  pgm.addConstraint("store_products", "store_products_store_id_fk", {
    foreignKeys: {
      columns: "store_id",
      references: "stores(id)",
    },
  });
  pgm.addConstraint("store_products", "store_products_product_id_fk", {
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
  pgm.dropTable("store_products");
};
