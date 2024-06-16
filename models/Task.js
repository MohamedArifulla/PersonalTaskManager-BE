
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  priority: { type: String, default: 'Low' },
  email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
