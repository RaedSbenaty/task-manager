require('./db/mongoose')
var express = require('express')

var app = express()
var port = process.env.PORT
var usersRouter = require('./routers/user')
var tasksRouter = require('./routers/task')

// app.use((req, res, next) => { })
app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)

app.listen(port, () => console.log('Server is up at port: ' + port))

var Task = require('./models/task')
var User = require('./models/user')

// var fun = async () => {.
//     // var task = await Task.findById('6078b1d948ee811a34fa352d')
//     // await task.populate('owner').execPopulate()

//     var user = await User.findById('60778e064716dc350ce90b75')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }   

// fun()
