var mongoose = require('mongoose')

var taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true })

var Task = mongoose.model('Task', taskSchema)

// new Task({ desciption: 'Eating', completed: 's' }).save()
//     .then(task => console.log(task))
//     .catch(error => console.log(error))

module.exports = Task

// var deleteByIDAndCountUncompleted = async (id) => {
//     var user = await Task.findByIdAndDelete(id)
//     return await Task.countDocuments({ completed: false })
// }

// deleteByIDAndCountUncompleted('606b7ca2ea9323274415fd3b')
//     .then(count => console.log(count))
//     .catch(e => console.log(e))