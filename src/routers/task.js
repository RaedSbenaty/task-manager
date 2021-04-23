var Task = require('../models/task')
var express = require('express')
var auth = require('../middleware/auth')

var router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    var task = new Task({ ...req.body, owner: req.user._id })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// /tasks?completed=true&limit=2&skip=2&sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    var match = {}, sort = {}
    if (req.query.completed) match.completed = req.query.completed === 'true'

    if (req.query.sortBy) {
        var parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        var task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    var updates = Object.keys(req.body)
    var allowedUpdates = ['description', 'completed']
    var isValidTaskUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidTaskUpdate)
        return res.status(400).send({ error: 'Invalid Update' })

    try {
        var task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        var task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(400).send()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router