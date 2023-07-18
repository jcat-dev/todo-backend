import { TodoModel } from '../models/todo.model'
import { Todo } from '../types/Todo'

const create = async (todo: Todo) => {
  return await TodoModel.create(todo)
}

const find = async () => {
  return await TodoModel.find({}).exec()
}

const findById = async (id: string) => {
  return await TodoModel.findById(id).exec()
}

const updateById = async (id: string, data: Todo) => {
  return await TodoModel.findByIdAndUpdate(id, data)
}

const deleteAllCompleted = async () => {
  return await TodoModel.deleteMany({ completed: true })
}

const deleteById = async (id: string) => {
  return await TodoModel.findByIdAndDelete(id)
}

export default {
  create,
  find,
  findById,
  updateById,
  deleteById,
  deleteAllCompleted
}