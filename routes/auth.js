const express = require("express");
const router = express.Router();
const authControllers = require('../controller/auth')

router.get('/', (req, res) => { res.redirect('login') })
router.get('/login', (req, res) => { res.render('login') })
router.get('/register', (req, res) => { res.render('register') })
router.get('/app', (req, res) => { res.render('app') })

router.post('/loginAuth', express.json(), authControllers.login)
router.post('/newRegister', express.json(), authControllers.register)

module.exports = router