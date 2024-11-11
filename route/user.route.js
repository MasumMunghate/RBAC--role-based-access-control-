const { authentication, restriTo } = require('../controllers/auth.controller');
const { getAllUser } = require('../controllers/user.controller');



const router = require('express').Router();
router.get('/',authentication, restriTo('0'), getAllUser)
module.exports = router;