import { createSlice } from "@reduxjs/toolkit"
import { TaskService } from "services"
import { hideModal } from "components/ModalContainer/modalSlice"

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    loading: false,
    error: null,
    tasks: {
      todo: null,
      inprogress: null,
      done: null
    },
    selectedTask: {},
  },
  reducers: {
    fetchTasksBegin: (state) => {
      state.loading = true
    },
    fetchTasksSuccess: (state, action) => {
      state.loading = false
      state.tasks.all = action.payload
      state.tasks.todo = action.payload.filter(t => t.state === 'todo')
      state.tasks.inprogress = action.payload.filter(t => t.state === 'inprogress')
      state.tasks.done = action.payload.filter(t => t.state === 'done')
    },
    fetchTasksFail: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    createTaskBegin: (state) => {
      state.loading = true
    },
    createTaskSuccess: (state, action) => {
      state.loading = false
      state.tasks.todo.unshift(action.payload)
      state.tasks.all.unshift(action.payload)
    },
    createTaskFail: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    deleteTaskBegin: (state) => {
      state.loading = true
    },
    deleteTaskSuccess: (state, action) => {
      state.loading = false
      state.tasks[action.payload.state] = state.tasks[action.payload.state].filter((t) => t._id !== action.payload._id)
      state.selectedTask = {}
    },
    deleteTaskFail: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    editTaskBegin: (state) => {
      state.loading = true
    },
    editTaskSuccess: (state, action) => {
      state.loading = false
      state.tasks[action.payload.state][state.tasks[action.payload.state].findIndex((t) => t._id === action.payload._id)] = action.payload
      state.selectedTask = action.payload
    },
    editTaskFail: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    editTaskState: (state, { payload }) => {
      const { id, newState } = payload
      debugger
      const task = state.tasks.all.find(t => t._id === id)
      state.tasks[task.state] = state.tasks[task.state].filter(t => t._id !== task._id)
      task.state = newState
      state.tasks[newState].push(task)
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload
    },
    addTaskCommentBegin: (state) => {
      state.loading = true
    },
    addTaskCommentSuccess: (state, action) => {
      state.loading = false
      state.tasks[action.payload.state][state.tasks[action.payload.state].findIndex((t) => t._id === action.payload._id)] = action.payload
      state.selectedTask = action.payload
    },
    addTaskCommentFail: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
    deleteTaskCommentBegin: (state) => {
      state.loading = true
    },
    deleteTaskCommentSuccess: (state, action) => {
      state.loading = false
      state.tasks[action.payload.state][state.tasks[action.payload.state].findIndex((t) => t._id === action.payload._id)] = action.payload
      state.selectedTask = action.payload
    },
    deleteTaskCommentFail: (state, action) => {
      state.loading = false
      state.error = action.payload.error
    },
  },
})

export const {
  fetchTasksBegin,
  fetchTasksSuccess,
  fetchTasksFail,
  createTaskBegin,
  createTaskFail,
  createTaskSuccess,
  deleteTaskBegin,
  deleteTaskFail,
  deleteTaskSuccess,
  editTaskBegin,
  editTaskFail,
  editTaskSuccess,
  editTaskState,
  selectTask,
  addTaskCommentBegin,
  addTaskCommentSuccess,
  addTaskCommentFail,
  deleteTaskCommentBegin,
  deleteTaskCommentSuccess,
  deleteTaskCommentFail,
} = taskSlice.actions

export const fetchTasks = () => async (dispatch) => {
  try {
    dispatch(fetchTasksBegin())
    const data = await TaskService.getAll()
    dispatch(fetchTasksSuccess(data))
  } catch (error) {
    dispatch(fetchTasksFail(error))
  }
}

export const createTask = (title, description, completed) => async (dispatch) => {
  try {
    dispatch(createTaskBegin())
    const data = await TaskService.create(title, description, completed)
    dispatch(createTaskSuccess(data))
    dispatch(hideModal())
  } catch (error) {
    dispatch(createTaskFail(error))
  }
}

export const editTask = (id, updates) => async (dispatch) => {
  try {
    dispatch(editTaskBegin())
    const data = await TaskService.edit(id, updates)
    dispatch(editTaskSuccess(data))
    dispatch(hideModal())
  } catch (error) {
    dispatch(editTaskFail(error))
  }
}

export const moveTask = ({ id, newState }) => async (dispatch) => {
  await dispatch(editTask(id, { state: newState }))
  dispatch(editTaskState({ id, newState }))
}

export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch(deleteTaskBegin())
    const data = await TaskService.delete(id)
    dispatch(deleteTaskSuccess(data))
    dispatch(hideModal())
  } catch (error) {
    dispatch(deleteTaskFail(error))
  }
}

export const addTaskComment = (id, comment) => async (dispatch) => {
  try {
    dispatch(addTaskCommentBegin())
    const data = await TaskService.addComment(id, comment)
    dispatch(addTaskCommentSuccess(data))
  } catch (error) {
    dispatch(addTaskCommentFail(error))
  }
}

export const deleteTaskComment = (id, commentId) => async (dispatch) => {
  try {
    dispatch(deleteTaskCommentBegin())
    const data = await TaskService.deleteComment(id, commentId)
    dispatch(deleteTaskCommentSuccess(data))
    dispatch(hideModal())
  } catch (error) {
    dispatch(deleteTaskCommentFail(error))
  }
}

export const selectLoading = (state) => state.tasks.loading
export const selectError = (state) => state.tasks.error
export const selectTasks = (state) => state.tasks.tasks
export const selectSelectedTask = (state) => state.tasks.selectedTask
export default taskSlice.reducer
