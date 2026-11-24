/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

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
  pgm.createTable("user_has_roles", {
    user_id: {
      type: "bigint",
      notNull: true,
    },
    role_id: {
      type: "bigint",
      notNull: true,
    },
  });
  pgm.addConstraint("user_has_roles", "user_has_roles_pk", {
    primaryKey: ["user_id", "role_id"],
  });
  pgm.addConstraint("user_has_roles", "user_has_roles_user_id_fk", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
    },
  });
  pgm.addConstraint("user_has_roles", "user_has_roles_role_id_fk", {
    foreignKeys: {
      columns: "role_id",
      references: "roles(id)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("user_has_roles");
};
