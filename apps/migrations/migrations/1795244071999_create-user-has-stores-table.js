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
  pgm.createTable("user_has_stores", {
    user_id: {
      type: "bigint",
      notNull: true,
    },
    store_id: {
      type: "bigint",
      notNull: true,
    },
  });
  pgm.addConstraint("user_has_stores", "user_has_stores_pk", {
    primaryKey: ["user_id", "store_id"],
  });
  pgm.addConstraint("user_has_stores", "user_has_stores_user_id_fk", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
    },
  });
  pgm.addConstraint("user_has_stores", "user_has_stores_store_id_fk", {
    foreignKeys: {
      columns: "store_id",
      references: "stores(id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("user_has_stores");
};
