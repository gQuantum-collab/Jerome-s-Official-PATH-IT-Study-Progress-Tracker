'use client'

import { useAuth } from '@/lib/auth'
import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Assignment, CertificationProgress } from '@/types'
import {
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user, userProfile } = useAuth()
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([])
  const [certifications, setCertifications] = useState<CertificationProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        // Load recent assignments
        const assignmentsQuery = query(
          collection(db, 'assignments'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Assignment[]
        setRecentAssignments(assignmentsData)

        // Load certifications
        const certificationsQuery = query(
          collection(db, 'certifications'),
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc')
        )
        const certificationsSnapshot = await getDocs(certificationsQuery)
        const certificationsData = certificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CertificationProgress[]
        setCertifications(certificationsData)

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <BookOpenIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-green-600 bg-green-100'
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userProfile?.displayName || user?.displayName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Here&apos;s your cybersecurity learning progress overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Assignments
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {recentAssignments.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Completed
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {recentAssignments.filter(a => a.status === 'completed').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-secondary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Certifications
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {certifications.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  In Progress
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {recentAssignments.filter(a => a.status === 'in-progress').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Assignments
          </h2>
          {recentAssignments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No assignments yet. Create your first assignment to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {assignment.course}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      assignment.priority
                    )}`}
                  >
                    {assignment.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certification Progress */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Certification Progress
          </h2>
          {certifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No certifications tracked yet. Add your first certification goal!
            </p>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {cert.certificationName}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cert.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${cert.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cert.completedModules} of {cert.totalModules} modules completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}