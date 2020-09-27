var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/home', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('home', { title: 'Home', userId });

});

router.get('/', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('home', { title: 'Home', userId });

});

/** ------- test -------  */
router.get('/newsfeed1', function (req, res, next) {
  let userId = '5f4d35fe510a175b5489df1e'
  res.render('newsfeed', { title: 'Self Care', userId });
});
/** ------- test -------  */


router.get('/self-care', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('feed', { title: 'Self Care',userId });
});

router.get('/meditation', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('feed', { title: 'Meditation', userId});
});

router.get('/movement', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('feed', { title: 'Movement', userId});
});

router.get('/maineresources', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('feed', { title: 'Maine Resources', userId });
});

router.get('/virtuallearningtips', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('feed', { title: 'Virtual Learning Tips', userId});
});

router.get('/profile', function (req, res, next) {
  console.log('******* SESSION DATA ***********', req.sessionData)
  let userId  = req.sessionData.userId
  let username = req.sessionData.username
  res.render('profile', { title: 'Profile',userId , username });
});

router.get('/accountsettings', function (req, res, next) {
  let userId = req.sessionData.userId
  res.render('accountsettings', { title: 'Account Settings', userId });
});



module.exports = router;
