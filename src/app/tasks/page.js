'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function TasksPage() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check who's logged in, redirect to login if nobody is
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchTasks(user.id)
      }
    }
    loadUser()
  }, [])

  async function fetchTasks(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) setTasks(data)
    setLoading(false)
  }

  async function handleAddTask(e) {
    e.preventDefault()
    if (!title.trim()) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description, user_id: user.id, is_done: false }])
      .select()

    if (!error) {
      setTasks([data[0], ...tasks])
      setTitle('')
      setDescription('')
    }
  }

  async function toggleDone(task) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_done: !task.is_done })
      .eq('id', task.id)

    if (!error) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, is_done: !t.is_done } : t))
    }
  }

  async function deleteTask(taskId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (!error) {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1C2E]">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1C2E] px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-white bg-[#0F6E56] px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Log Out
          </button>
        </div>

        <form onSubmit={handleAddTask} className="bg-white rounded-lg p-4 mb-6 space-y-3">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
            rows={2}
          />
          <button
            type="submit"
            className="bg-[#F5A623] text-[#0F1C2E] font-medium rounded-md px-4 py-2 hover:opacity-90 transition"
          >
            Add Task
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-gray-400 text-center">No tasks yet. Add one above!</p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg p-4 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.is_done}
                  onChange={() => toggleDone(task)}
                  className="mt-1 h-5 w-5 accent-[#0F6E56]"
                />
                <div>
                  <p className={`font-medium ${task.is_done ? 'line-through text-gray-400' : 'text-[#0F1C2E]'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-sm ${task.is_done ? 'line-through text-gray-300' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 text-sm hover:text-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}