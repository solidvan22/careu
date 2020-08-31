var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/home', function (req, res, next) {
  res.render('home', { title: 'Express' });

});

router.get('/self-care', function (req, res, next) {
  let userId = '5f4d35fe510a175b5489df1e'
  res.render('feed', { title: 'Self Care',userId });
});

router.get('/meditation', function (req, res, next) {
  res.render('feed', { title: 'Meditation' });
});

router.get('/movement', function (req, res, next) {
  res.render('feed', { title: 'Movement' });
});

router.get('/maineresources', function (req, res, next) {
  res.render('feed', { title: 'Maine Resources' });
});

router.get('/virtuallearningtips', function (req, res, next) {
  res.render('feed', { title: 'Virtual Learning Tips' });
});

router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Profile' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login',layout:false });
});



module.exports = router;
