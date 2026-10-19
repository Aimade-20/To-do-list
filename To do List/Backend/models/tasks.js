const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tasckSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Todo", "doin", "done"],
    default: "Todo",
  },
  createdAt: { type: Date, default: Date.now },
});
const Tasks = mongoose.model("Tasks", tasckSchema);
module.exports = Tasks;
