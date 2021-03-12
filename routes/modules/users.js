const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
    })
)

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/users/login')
})

router.post('/register', (req, res) => {
    // 取得註冊表單參數
    const { name, email, password, confirmPassword } = req.body
    // 檢查使用者是否已經註冊
    User.findOne({ email }).then((user) => {
        //如果已經註冊：退回原本畫面
        if (user) {
            console.log('User registered')
            res.render('register', {
                name,
                email,
                password,
                confirmPassword,
            })
        } else {
            return User.create({
                name,
                email,
                password,
            })
                .then(() => res.redirect('/'))
                .catch((err) => console.log(err))
        }
    })
})

router.get('/register', (req, res) => {
    res.render('register')
})
module.exports = router
