var { MongoClient, ObjectID } = require('mongodb')


var connectionURL = 'mongodb://127.0.0.1:27017'
var databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error)
        return console.log('Connection Failed.')

    var db = client.db(databaseName)

    // Create
    // db.collection('users').insertMany([
    //     { name: 'Raed', age: 20 },
    //     { name: 'Raghad', age: 20, },
    //     { name: 'Tasneem', age: 22 }
    // ], (error, result) => {
    //     if (error) return console.log('Insertion Failed.')

    //     console.log(result.ops)
    // })


    // Read
    // db.collection('users').findOne({ name: 'Tasneem' }, (error, user) => {
    //     if(error) return console.log('Fetching Failed')

    //     console.log(user)
    // })

    // db.collection('users').find({age:20}).toArray((error,users)=>{
    //     if(error) return console.log('Fetching Failed')

    //     console.log(users)
    // })


    // Update
    // db.collection('tasks').updateMany({}, {
    //     $rename: { completed: 'done' }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


    // Delete
    // db.collection('tasks').deleteOne({ done: false })
    //     .then((result) => {
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
})
