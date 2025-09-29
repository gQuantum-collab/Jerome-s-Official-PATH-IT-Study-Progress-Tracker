'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Assignment } from '@/types'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AssignmentsPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    tags: '',
  })

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'assignments'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assignmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[]
      setAssignments(assignmentsData)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const assignmentData = {
        userId: user.uid,
        title: formData.title,
        description: formData.description,
        course: formData.course,
        dueDate: new Date(formData.dueDate),
        priority: formData.priority,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      if (editingAssignment) {
        await updateDoc(doc(db, 'assignments', editingAssignment.id), {
          ...assignmentData,
          updatedAt: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, 'assignments'), assignmentData)
      }

      resetForm()
    } catch (error) {
      console.error('Error saving assignment:', error)
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course,
      dueDate: assignment.dueDate.toDate().toISOString().split('T')[0],
      priority: assignment.priority,
      tags: assignment.tags.join(', '),
    })
    setShowForm(true)
  }

  const handleDelete = async (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteDoc(doc(db, 'assignments', assignmentId))
      } catch (error) {
        console.error('Error deleting assignment:', error)
      }
    }
  }

  const handleStatusChange = async (assignmentId: string, newStatus: Assignment['status']) => {
    try {
      await updateDoc(doc(db, 'assignments', assignmentId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating assignment status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course: '',
      dueDate: '',
      priority: 'medium',
      tags: '',
    })
    setEditingAssignment(null)
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading assignments...</div>
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your cybersecurity coursework and projects
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Assignment
        </button>
      </div>

      {/* Assignment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course
                </label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="cryptography, networking, security"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingAssignment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No assignments yet. Create your first assignment to get started!
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Course: {assignment.course}
                  </p>
                  {assignment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {assignment.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Due: {assignment.dueDate.toDate().toLocaleDateString()}</span>
                    {assignment.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {assignment.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={assignment.status}
                    onChange={(e) => handleStatusChange(assignment.id, e.target.value as Assignment['status'])}
                    className="text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <button
                    onClick={() => handleEdit(assignment)}
                    className="p-2 text-gray-400 hover:text-primary-600"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}