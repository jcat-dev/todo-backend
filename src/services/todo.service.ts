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
  const docList = await find()
  const elementsLength = docList.filter((value) => value.completed).length
  const result = await TodoModel.findByIdAndUpdate(id, {
    ...data, 
    order: data.completed ? elementsLength : (elementsLength - 1)
  })

  if (result && data.completed) {
    return await changeOrder(elementsLength, data.order, 1, id)
  }

  if (result) {
    await changeOrder(data.order, elementsLength - 1, -1, id)
  }
}

const deleteAllCompleted = async () => {
  const result = await find()
  const { deletedCount } = await TodoModel.deleteMany({ completed: true })

  if (deletedCount > 0) {    
    await changeOrder(deletedCount, result.length - 1, (deletedCount * -1))
  }
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
    await changeOrder(currentIndex, targetIndex, -1, item.id)
    return
  }

  await changeOrder(targetIndex, currentIndex, 1, item.id)
}

const changeOrder = async (start: number, end: number, inc: number, neId?: string) => {
  const filter = {
    order: {
      $gte: start, 
      $lte: end
    }
  }

  const update = {
    $inc: { 
      order: inc
    }
  }

  if (neId) {
    await TodoModel.updateMany(
      {
        ...filter,
        _id: {
          $ne: neId
        }
      },
      update
    )

    return
  }

  await TodoModel.updateMany(filter, update)
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