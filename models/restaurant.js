const mongoose = require("mongoose")
const { generateID } = require("../utils")

const taskSchema = new mongoose.Schema({
    id: {type:String, required: true, default: generateID},
    time: {type:Number, required: true, default: Date.now},
    body: {type:String, default: ""},
    done: {type:Boolean, required: true, default: false}
})

const TaskModel = mongoose.model("tasks", taskSchema)

module.exports = TaskModel