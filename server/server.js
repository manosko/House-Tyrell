const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const path = require('path');
const db = require('../database/models.js');
const Sequelize = require('sequelize');
const session = require('express-session');

const Op = Sequelize.Op;

const app = express();

const sess = {
  secret: 'tyrell',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 10000,
  },
};

app.use(session(sess));

const port = 3000;

app.use(parser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

//* **************************** MIDDLEWARE ************************************
let auth = function(req, res, next) {
  if (req.session.employee) {
    next();
  } else {
    res.status(401).redirect('/')
  }
}
//* **************************** POST REQUESTS *********************************
app.post('/test', (req, res) => {
  db.Category.create({ category_name: 'Test2Test' })
    .then(() => {
      res.send('success');
    });
});

app.post('/completed/transaction', (req, res) => {
  console.log(req.body);
  res.send();
});
//* **************************** GET REQUESTS *********************************
// not working? attempt to redirect users who are not logged in
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist'))
})

app.get('/fetch/items', (req, res) => {
  db.Item.findAll()
    .then((data) => {
      res.send(data);
    });
});

app.get('/fetch/categories', (req, res) => {
  db.Category.findAll()
    .then((data) => {
      res.send(data);
    });
});

app.get('/fetch/ingredients', (req, res) => {
  const ingredients = JSON.parse(req.query.item_ingredients);
  db.Ingredient.findAll({
    where: {
      id: {
        [Op.or]: ingredients,
      },
    },
  }).then((data) => {
    res.send(data);
  });
});

app.get('/fetch/employee', (req, res) => {
  db.Employee.findAll({
    where: {
      employee_id: req.query.PIN,
    },
  })
    .then((data) => {
      if (data.length === 0) {
        // invalid login
        res.status(404).send();
      } else {
        req.session.regenerate(() => {
          req.session.employee = req.query.PIN;
          console.log("LINE 90", req.session)
          res.send(data);
        });
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get('/filter/category', auth, (req, res) => {
// app.get('/filter/category', (req, res) => {

  console.log("FUCKING MANOSKO",req.session);
  db.Item.findAll({
    where: {
      item_category: req.query.category,
    },
  })
    .then((data) => {
      res.send(data);
    });
});

app.get('/*', (req, res) => {
  // Session.touch() here?
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) res.status(500).send(err);
  });
});

app.listen(port);
