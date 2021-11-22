module.exports = db => {
  return {
    create: (req, res) => {
      db.models.persons.create(req.body).then(() => { // create person
          db.query(`SELECT id 
          FROM "persons"
          ORDER BY id DESC limit 1`, { type: db.QueryTypes.SELECT }).then(resp => { // get last inserted id for assign car in junction table
              for (let i = 0; i < req.body.cars.length; i++) {
                let personCar = {
                  "id_person": resp[0].id, 
                  "id_car": req.body.cars[i]
                };
                db.models.junction.create(personCar).then(() => { // create registers person-car in junction table
                  res.send({ success: true });
                }).catch(() => res.status(401));
            }
            res.send(resp);
          }).catch(() => res.status(401));
        res.send({ success: true });
      }).catch(() => res.status(401));
  },

  // update: (req, res) => {
  //   db.models.persons.update(req.body, { where: { id: req.body.id } }).then(() => {
  //     res.send({ success: true })
  //   }).catch(() => res.status(401));
  // },

  update: (req, res) => {
    console.log("update persons req.body:", req.body)
    db.models.persons.update( {
      name: req.body.name, 
      surname: req.body.surname, 
      cnp: req.body.cnp, 
    }, 
        { where: { id: req.body.id } }).then(() => {
          // delete previous asigned cars in order to asign the currents cars
          db.query(`DELETE FROM "junction" WHERE id_person = ${req.body.id}`, { type: db.QueryTypes.DELETE }).then(() => {
            for (let i = 0; i < req.body.cars.length; i++) {
              let personCar = {
                "id_person": req.body.id, 
                "id_car": req.body.cars[i]
              };
              db.models.junction.create(personCar).then(() => { // create registers person-car in junction table
                res.send({ success: true });
              }).catch(() => res.status(401));
          }
          res.send({ success: true });
          }).catch(() => res.status(401));
          res.send({ success: true })
    }).catch(() => res.status(401));
},

// findAll_initial: (req, res) => {
    //   db.query(`SELECT id, name, surname, cnp 
    //   FROM "persons"
    //   ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
    //     res.send(resp);
    //   }).catch(() => res.status(401));
    // },

    // (SELECT array_to_string(array_agg(brand || (' - ') || model), ', ')
    findAll: (req, res) => {
      db.query(`SELECT p.id AS id, p.name AS name, p.surname AS surname, p.cnp AS cnp, 
      (SELECT array_agg(brand || (' - ') || model ORDER BY cars.brand, cars.model) 
          FROM "cars" cars  
          INNER JOIN junction j 
            ON j.id_person = p.id
          WHERE j.id_car = cars.id  
          ) AS person_cars 
        FROM persons p 
      ORDER BY p.name, p.surname`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(`SELECT id, name, surname, cnp 
      FROM "persons" WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
      }).catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "persons" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
        // delete all registers corespondent to the person from the junction table
        db.query(`DELETE FROM "junction" WHERE id_person = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
        res.send({ success: true });
      }).catch(() => res.status(401));
    },
  };
};
