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
  pgm.createTable("role_has_permissions", {
    role_id: {
      type: "bigint",
      notNull: true,
    },
    permission_id: {
      type: "bigint",
      notNull: true,
    },
  });
  pgm.addConstraint("role_has_permissions", "role_has_permissions_pk", {
    primaryKey: ["role_id", "permission_id"],
  });
  pgm.addConstraint("role_has_permissions", "role_has_permissions_role_id_fk", {
    foreignKeys: {
      columns: "role_id",
      references: "roles(id)",
    },
  });
  pgm.addConstraint(
    "role_has_permissions",
    "role_has_permissions_permission_id_fk",
    {
      foreignKeys: {
        columns: "permission_id",
        references: "permissions(id)",
      },
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("role_has_permissions");
};
