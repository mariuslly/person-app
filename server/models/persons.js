module.exports = (sequelize, DataType) => {
  let model = sequelize.define('persons', {
    name: {
      type: DataType.TEXT
    },
    surname: {
      type: DataType.TEXT
    },
    cnp: {
      type: DataType.TEXT
    },
  },
  //  {
  //   timestamps: true
  // }
  );
  return model;
};
