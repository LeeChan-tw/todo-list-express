const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true,
    })
)

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login')
})

router.post('/register', (req, res) => {
    // 取得註冊表單參數
    const { name, email, password, confirmPassword } = req.body
    // 檢查使用者是否已經註冊
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
        errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不相符。' })
    }
    if (errors.length) {
        return res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword,
        })
    }
        User.findOne({ email }).then((user) => {
            //如果已經註冊：退回原本畫面
            if (user) {
                errors.push({ message: '這個Email已經註冊過了。' })
                return res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    confirmPassword,
                })
            }

            return bcrypt
                .genSalt(10) // 產生言，設定複雜度係數為10
                .then((salt) => bcrypt.hash(password, salt)) // 使用者密碼加鹽，產生雜湊值
                .then((hash) =>
                    User.create({
                        name,
                        email,
                        password: hash,
                    })
                
                
                )
                .then(() => res.redirect('/'))
                .catch((err) => console.log(err))
        })
})

router.get('/register', (req, res) => {
    res.render('register')
})
module.exports = router
