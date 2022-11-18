require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()




const authroute = require('./router/authroute')
const adminRoute = require('./router/adminRoute')

const requestroute = require('./router/requestRoute')
const friendsroute = require('./router/friendsRoute')

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established!')
})
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use('/', console.log("hello"))
app.use('/user', authroute)
app.use('/request', requestroute)
app.use('/friends', friendsroute)
app.use('/admin', adminRoute)
console.log(new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }))
console.log(new Date().toLocaleTimeString([], { hour: '2-digit'}))
console.log(new Date().toLocaleTimeString([], { minute: '2-digit'}))
console.log("ISODate",new Date().toISOString())

const port = process.env.PORT || 5000
app.listen(5000, () => { console.log(`server running on ${port}`) })