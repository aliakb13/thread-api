/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // menambahkan foreign key user_id = user.id
  pgm.addConstraint('likes', 'fk_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  // menambahkan foreign key comment_id = comments.id
  pgm.addConstraint('likes', 'fk_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
