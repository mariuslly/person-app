module.exports = (sequelize, DataType) => {
  let model = sequelize.define('junction', {
    id_person: {
      type: DataType.INTEGER
    },
    id_car: {
      type: DataType.INTEGER
    },
  },
  //  {
  //   timestamps: true
  // }
  );
  return model;
};
