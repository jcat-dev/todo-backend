import { TodoModel } from '../models/todo.model'
import { Todo } from '../types/Todo'

const create = async (todo: Todo) => {
  return await TodoModel.create(todo)
}

const find = async () => {
  return await TodoModel.find({}).sort({ completed: -1, order: 1}).exec()
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
  const todoList = await find()
  const todoIndex = todoList.findIndex((value) => value.id === id)

  todoList.forEach(async (value, index) => {
    if (index > todoIndex) {
      value.order--
      await value.save()
    }
  })

  await TodoModel.findByIdAndDelete(id)
}

const sort = async (currentIndex: number, targetIndex: number) => {
  const docList = await find()

  if (currentIndex === targetIndex) return

  if (currentIndex > targetIndex) {
    docList.forEach(async (value) => {
      if (targetIndex <= value.order && currentIndex >= value.order) {
        if (currentIndex === value.order) {
          value.order = targetIndex
          await value.save()

          return
        }

        value.order++
        await value.save()
      }  
    })

    return
  }

  docList.forEach(async (value) => {
    if (currentIndex <= value.order && targetIndex >= value.order) {
      if (currentIndex === value.order) {
        value.order = targetIndex
        await value.save()

        return
      }

      value.order--
      await value.save()
    }
  })
}

export default {
  create,
  find,
  findById,
  updateById,
  deleteById,
  deleteAllCompleted,
  sort
}