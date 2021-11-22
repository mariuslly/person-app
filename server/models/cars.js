module.exports = (sequelize, DataType) => {
  let model = sequelize.define('cars', {
    brand: {
      type: DataType.TEXT
    },
    model: {
      type: DataType.TEXT
    },
    manufacturing_year: {
      type: DataType.INTEGER
    },
    cylindrical_capacity: {
      type: DataType.INTEGER
    },
    // tax_rate: {
    //   type: DataType.INTEGER
    // }
  },
  //  {
  //   timestamps: true
  // }
  );
  return model;
};
