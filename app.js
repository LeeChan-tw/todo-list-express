const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const routes = require('./routes')
require('./config/mongoose')

const usePassport = require('./config/passport')
const { rawListeners } = require('./config/mongoose')

const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

app.use(express.urlencoded({ extended: true }))
//body-parser built into Express.js
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash()) // 掛載套件

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
