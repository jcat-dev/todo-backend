import { Request, Response } from 'express'
import { errorRes, successfulRes, successfulResWithData } from '../utils/response'
import { TodoModel } from '../models/todo.model'
import { CREATED_STATUS_RESPONSE, SERVER_ERROR_STATUS_RESPONSE, SUCCESSFUL_STATUS_RESPONSE } from '../constants/HTTP_RESPONSE'
import { FilterQuery } from 'mongoose'
import { Todo } from '../types/Todo'

export const createTodo = async (req: Request, res: Response) => {
  try {
    const todo = req.body
    const todosLength = (await findTodos()).length
    const data = await TodoModel.create({...todo, order: todosLength})

    res.status(CREATED_STATUS_RESPONSE).json({...successfulResWithData, data})
  } catch (error) {
    res.status(SERVER_ERROR_STATUS_RESPONSE).json(errorRes)
  }
}

export const getTodos = async (res: Response) => {
  try {
    const data = await TodoModel.find({}).sort({order: 'asc'}).exec()

    res.status(SUCCESSFUL_STATUS_RESPONSE).json({...successfulResWithData, data})
  } catch (error) {
    res.status(SERVER_ERROR_STATUS_RESPONSE).json(errorRes)
  }
}

export const toggleCompletedTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const todo = req.body
    const completedTodoLength = (await findTodos()).filter((value) => value.completed).length
    const result = await TodoModel.findByIdAndUpdate(id, {
      ...todo,
      order: todo.completed ? completedTodoLength : (completedTodoLength - 1)
    })

    if (result && todo.completed) {
      await sortOrder(completedTodoLength, todo.order, 1, id)
    }

    if (result) {
      await sortOrder(todo.order, completedTodoLength - 1, -1, id)
    }

    res.status(SUCCESSFUL_STATUS_RESPONSE).json(successfulRes)
  } catch (error) {
    res.status(SERVER_ERROR_STATUS_RESPONSE).json(errorRes)
  }
}

export const deleteAllCompletedTodo = async (res: Response) => {
  try {
    const todos = await findTodos()
    const { deletedCount } = await TodoModel.deleteMany({ completed: true })

    if (deletedCount > 0) {    
      await sortOrder(deletedCount, todos.length - 1, (deletedCount * -1))
    }

    res.status(SUCCESSFUL_STATUS_RESPONSE).json(successfulRes)
  } catch (error) {
    res.status(SERVER_ERROR_STATUS_RESPONSE).json(errorRes)
  }
}

export const deleteTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const todoList = await findTodos()
    const todoIndex = todoList.findIndex((value) => value.id === id)
   
    if (todoIndex !== -1) {
      await sortOrder(todoIndex, todoList.length - 1, -1)
      await TodoModel.findByIdAndDelete(id)
      return res.status(SUCCESSFUL_STATUS_RESPONSE).json(successfulRes)
    }

    throw Error()
  } catch (error) {
    res.status(SERVER_ERROR_STATUS_RESPONSE).json(errorRes)
  }
}

export const sortTodos = async (req: Request, res: Response) => {
  try {
    const { currentIndex, targetIndex } = req.body
    const todoList = await findTodos()
    const completedTodoLength = todoList.filter((value) => value.completed).length
    if (currentIndex === targetIndex || currentIndex < completedTodoLength || targetIndex < completedTodoLength) return
  
    const todo = todoList[currentIndex]
    await TodoModel.findByIdAndUpdate(todo._id, {order: targetIndex})
    currentIndex < targetIndex
      ? await sortOrder(currentIndex, targetIndex, -1, todo.id)
      : await sortOrder(targetIndex, currentIndex, 1, todo.id)

    res.status(SUCCESSFUL_STATUS_RESPONSE).json(successfulRes)
  } catch (error) {
    res.status(SERVER_ERROR_STATUS_RESPONSE).json(errorRes)
  }
}

const findTodos = () => {
  return TodoModel.find({}).exec()
}

/**
 * Cambia los valores de la propiedad 'order' de los Todos.
 * @param start Valor inicial de 'order'.
 * @param end Valor final de 'order'.
 * @param inc Valor a incrementar o disminuir los valores de order.
 * @param neID Valor ID del Todo para no modificar su 'order'.
 * @returns 
 */
const sortOrder= async (start: number, end: number, inc: number, neID?: string) => {
  const filter: FilterQuery<Todo> = {
    order: {
      $gte: start,
      $lte: end
    }
  }

  if (neID) {
    filter._id = {
      $ne: neID
    }
  }

  await TodoModel.updateMany(filter, {
    $inc: { 
      order: inc
    }
  })
}