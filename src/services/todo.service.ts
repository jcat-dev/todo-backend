import { TodoModel } from '../models/todo.model'
import { Todo } from '../types/Todo'

const create = async (todo: Todo) => {
  return await TodoModel.create(todo)
}

const find = async () => {
  return await TodoModel.find()
}

const findById = async (id: string) => {
  return await TodoModel.findById({_id: id})
}

const updateById = async (id: string, data: Todo) => {
  return await TodoModel.updateOne({_id: id}, data)
}

const deleteById = async (id: string) => {
  return await TodoModel.deleteOne({_id: id})
}

export default {
  create,
  find,
  findById,
  updateById,
  deleteById
}