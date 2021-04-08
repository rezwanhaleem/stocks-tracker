module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tickers: {
      type: DataTypes.STRING,
      defaultValue: '',
    }
  });

  return User;
};