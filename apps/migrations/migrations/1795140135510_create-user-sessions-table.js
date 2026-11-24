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
  pgm.createTable("user_sessions", {
    id: {
      type: "BIGSERIAL",
      primaryKey: true,
    },
    user_id: {
      type: "bigint",
      notNull: true,
    },
    access_token_hash: {
      type: "varchar(255)",
      notNull: true,
    },
    refresh_token_hash: {
      type: "varchar(255)",
      notNull: true,
    },
    access_token_expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    refresh_token_expires_at: {
      type: "timestamptz",
      notNull: true,
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
  pgm.addConstraint("user_sessions", "user_sessions_user_id_fk", {
    foreignKeys: {
      columns: "user_id",
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
  pgm.dropTable("user_sessions");
};
