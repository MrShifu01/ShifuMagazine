const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { mongoose } = require('mongoose')
const User = require('./models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const salt = bcrypt.genSaltSync(10)
const secret = 'jkduys0874unlsdk72d'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin:'http://localhost:3000'}))

mongoose.connect('mongodb+srv://standerchristian:shifumagazine@shifumagazinecluster.pumbu47.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt)
        })
        console.log(userDoc)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const userDoc = await User.findOne({username})
    const passOk = bcrypt.compareSync(password, userDoc.password)

    if (passOk) {
        // User is Logged In
        jwt.sign({username, id:userDoc._id}, secret, {}, (e, token) => {
            if (e) {
                throw e;
            }
            res.cookie('token', token).json({
                id: userDoc._id,
                username
            })

        })
    } else {
        res.status(400).json('Wrong Credentials')
    }

})

app.get('/profile' , (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, secret, {}, (e, info) => {
        if (e) throw e
        res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.listen(8000);

