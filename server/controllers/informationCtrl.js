module.exports = db => {
  return {
    create: (req, res) => {
      db.models.information.create(req.body).then(() => {
        res.send({ success: true })
      }).catch(() => res.status(401));
    },

    update: (req, res) => {
      // db.models.information.update(req.body, { where: { id: req.body.id } }).then(() => {
      //  res.send({ success: true })
      // }).catch(() => res.status(401));
      console.log("update information req.body:", req.body)
      db.models.information.update( {
        name: req.body.name, 
        type: req.body.type, 
        liked: req.body.liked, 
      }, 
          { where: { id: req.body.id } }).then(() => {
        res.send({ success: true })
      }).catch(() => res.status(401));
     },

    findAll: (req, res) => {
      db.query(`SELECT id, name, type, CASE WHEN liked IS TRUE THEN 'Da' ELSE 'Nu' END AS liked
      FROM "information"
      ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(() => res.status(401));
    },

    find: (req, res) => {
      db.query(`SELECT id, name, type, liked
      FROM "information" WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp[0]);
      }).catch(() => res.status(401));
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "information" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
        res.send({ success: true });
      }).catch(() => res.status(401));
    }
  };
};
