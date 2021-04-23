var User = require('../models/user')
var express = require('express')
var auth = require('../middleware/auth')
var multer = require('multer')
var sharp = require('sharp')

var router = new express.Router()

router.post('/users', async (req, res) => {
    var user = new User(req.body)
    try {
        await user.save()
        var token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        var user = await User.findByCredentials(req.body.email, req.body.password)
        var token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send('Logout is done.')
    } catch (e) {
        res.status(500).send
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logout all is done.')
    } catch (e) {
        res.status(500).send
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.get('/users/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id)
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    var updates = Object.keys(req.body)
    var allowedUpdates = ['name', 'age', 'email', 'password']
    var isValidUserUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUserUpdate)
        return res.status(400).send({ error: 'Invalid Update.' })

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//file.originalname.endsWith('')
var avatar = multer({
    //    dest: 'avatars',
    limits: { fileSize: 1048576 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
            return cb(new Error('Please upload an image.'))

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        var user = await User.findById(req.params.id)
        if (!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router