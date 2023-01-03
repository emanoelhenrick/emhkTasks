const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const tf = require('../model/tasks')
const cors = require('cors')

router.use(cors())

router.get('/all', (req, res) => {
    res.json(JSON.stringify(tf.updateTasks()))
})

router.post('/new', bodyParser.json(), (req, res) => {
    const { task } = req.body
    tf.saveTask(task)
    res.end()
})

router.post('/delete', bodyParser.json(), (req, res) => {
    const { taskID } = req.body
    tf.deleteTask(taskID)

    res.end()
})

router.post('/done', bodyParser.json(), (req, res) => {
    const { taskID } = req.body
    tf.doneTask(taskID)
    res.end()
})


module.exports = router