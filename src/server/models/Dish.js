const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'boilerbites-1.cjmepwltgjhe.us-east-2.rds.amazonaws.com',
  username: 'admin',
  password: 'purduepete',
  database: 'boilerbites-1',
});

const dishSchema = new Schema({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dish: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  vegetarian: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  vegan: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  pork: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  beef: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  gluten: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  nuts: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  carbs: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  protein: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

dishSchema.sync()
  .then(() => {
    console.log('Dish table synced');
  })
  .catch((error) => {
    console.error('Error syncing Dish table:', error);
  });

module.exports = dishSchema;


