/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    title: {
      type: "VARCHAR(150)",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TIMESTAMPTZ",
      notNull: true,
    },
  });

  // Menambahkan foreign key pada kolom owner dengan users.id
  pgm.addConstraint(
    "threads",
    "fk_threads.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
};
