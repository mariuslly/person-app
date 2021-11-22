module.exports = db => {
  return {
    create: (req, res) => {
      db.models.cars.create(req.body).then(() => {
        res.send({ success: true });
      }).catch(() => res.status(401));
    },

    update: (req, res) => {
      console.log("update cars req.body:", req.body)
      db.models.cars.update( {
        brand: req.body.brand, 
        model: req.body.model, 
        manufacturing_year: req.body.manufacturing_year, 
        cylindrical_capacity: req.body.cylindrical_capacity, 
      }, 
          { where: { id: req.body.id } }).then(() => {
        res.send({ success: true })
      }).catch(() => res.status(401));
    },

    findAll: (req, res) => {
      db.query(`SELECT id, brand, model, manufacturing_year, cylindrical_capacity 
      FROM "cars"
      ORDER BY brand, model`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(`SELECT id, brand, model, manufacturing_year, cylindrical_capacity 
      FROM "cars" WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp[0]);
      }).catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "cars" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
        // delete all registers corespondent to the car from the junction table
        db.query(`DELETE FROM "junction" WHERE id_car = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
          res.send({ success: true });
      }).catch(() => res.status(401));
    }
  };
};
