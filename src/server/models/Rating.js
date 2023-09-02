const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com',
  username: 'admin',
  password: 'purduepete',
  database: 'boilerbites-1',
});

const ratingSchema = new Schema({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  liked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dish_id: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

ratingSchema.sync()
  .then(() => {
    console.log('rating table synced');
  })
  .catch((error) => {
    console.error('Error syncing rating table:', error);
  });

module.exports = ratingSchema;
