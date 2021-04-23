var mongoose = require('mongoose')
var validator = require('validator')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var Task = require('./task')

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Invalid Email.')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.includes('password'))
                throw new Error('Invalid Password.')
        }
    },
    age: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    var user = await User.findOne({ email })
    if (!user) throw new Error('Verfiying failed.')

    var isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) throw new Error('Verfiying failed.')

    return user
}

userSchema.methods.toJSON = function () {
    var { _id, name, email, age } = this
    return { _id, name, email, age }
}

userSchema.methods.generateAuthToken = async function () {
    var user = this
    var token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.pre('save', async function (next) {
    var user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next()
})

userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id })
    next()
})

const User = mongoose.model('User', userSchema)

// var raed = new User({ name: 'Raed  ',password:'ssspaswordsss', email: 'RAED@Ex.com' })
// raed.save().then(() => console.log(raed))
//     .catch((error) => console.log(error))

module.exports = User

