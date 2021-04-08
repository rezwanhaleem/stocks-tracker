const User = require('../models').User;

module.exports = {
  create(req, res) {
    return User
      .create({
        email: req.body.email,
        tickers: req.body.tickers
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return User
      .find({
        where: {
          email: req.params.email
        },
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },
};