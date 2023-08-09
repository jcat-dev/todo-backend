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
  const completedTodo = docList.filter((value) => value.completed).length

  if (currentIndex === targetIndex || currentIndex < completedTodo || targetIndex < completedTodo) return

  const item = docList[currentIndex]
  await TodoModel.findByIdAndUpdate(item._id, { order: targetIndex })

  if (currentIndex < targetIndex) {
    await changeOrder(currentIndex, targetIndex, item.id, -1)
    return
  }

  await changeOrder(targetIndex, currentIndex, item.id, 1)
}

const changeOrder = async (start: number, end: number, neId: string, inc: number) => {
  await TodoModel.updateMany(
    {
      order: {
        $gte: start, 
        $lte: end
      },
      _id: {
        $ne: neId
      }
    },
    {
      $inc: { 
        order: inc
      }
    }
  )
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