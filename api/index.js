const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { mongoose } = require('mongoose')
const User = require('./models/User.js')
const Post= require('./models/Post.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const uploadMiddleware = multer({dest: 'uploads/'})
const fs = require('fs')

const salt = bcrypt.genSaltSync(10)
const secret = 'jkduys0874unlsdk72d'
const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin:'http://localhost:3000'}))
app.use('/uploads', express.static(__dirname + '/uploads'))

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
        // Postis Logged In
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

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.json(decoded);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (err, decoded) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json({ message: 'Invalid token' });
        }
        const { title, summary, content } = req.body
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: decoded.id
        })
        res.json(postDoc)
    }
)})

app.get('/post', async (req, res) => {
    const posts = await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    res.json(posts)
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const postDoc = await Post.findById({id}).populate('author', ['username'])
    res.json(postDoc)
})

app.listen(8000);

