'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Assignment, CertificationProgress, StudySession } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function ProgressPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [certifications, setCertifications] = useState<CertificationProgress[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        // Load assignments
        const assignmentsQuery = query(
          collection(db, 'assignments'),
          where('userId', '==', user.uid)
        )
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Assignment[]
        setAssignments(assignmentsData)

        // Load certifications
        const certificationsQuery = query(
          collection(db, 'certifications'),
          where('userId', '==', user.uid)
        )
        const certificationsSnapshot = await getDocs(certificationsQuery)
        const certificationsData = certificationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CertificationProgress[]
        setCertifications(certificationsData)

        // Load study sessions
        const studySessionsQuery = query(
          collection(db, 'studySessions'),
          where('userId', '==', user.uid)
        )
        const studySessionsSnapshot = await getDocs(studySessionsQuery)
        const studySessionsData = studySessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StudySession[]
        setStudySessions(studySessionsData)

      } catch (error) {
        console.error('Error loading progress data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  // Prepare chart data
  const assignmentStatusData = [
    { name: 'Pending', value: assignments.filter(a => a.status === 'pending').length, color: '#6B7280' },
    { name: 'In Progress', value: assignments.filter(a => a.status === 'in-progress').length, color: '#F59E0B' },
    { name: 'Completed', value: assignments.filter(a => a.status === 'completed').length, color: '#10B981' },
    { name: 'Overdue', value: assignments.filter(a => a.status === 'overdue').length, color: '#EF4444' },
  ]

  const assignmentPriorityData = [
    { name: 'High', value: assignments.filter(a => a.priority === 'high').length },
    { name: 'Medium', value: assignments.filter(a => a.priority === 'medium').length },
    { name: 'Low', value: assignments.filter(a => a.priority === 'low').length },
  ]

  const certificationProgressData = certifications.map(cert => ({
    name: cert.certificationName.length > 15 
      ? cert.certificationName.substring(0, 15) + '...' 
      : cert.certificationName,
    progress: cert.progress,
  }))

  // Calculate study time by week (mock data for now)
  const weeklyStudyData = [
    { week: 'Week 1', hours: 8 },
    { week: 'Week 2', hours: 12 },
    { week: 'Week 3', hours: 6 },
    { week: 'Week 4', hours: 15 },
    { week: 'Week 5', hours: 10 },
    { week: 'Week 6', hours: 14 },
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Overview</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Visual insights into your cybersecurity learning journey
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {assignments.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {assignments.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-secondary-600 mb-2">
            {certifications.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Certifications Tracked</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {certifications.reduce((acc, cert) => acc + cert.progress, 0) / (certifications.length || 1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Cert Progress</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assignment Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Assignment Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assignmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => (value as number) > 0 ? `${name}: ${value}` : ''}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assignmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Assignment Priority */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Assignment Priority Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assignmentPriorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Certification Progress */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Certification Progress
          </h3>
          {certificationProgressData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No certification data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={certificationProgressData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                <Bar dataKey="progress" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Weekly Study Hours */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyStudyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Progress List */}
      {certifications.length > 0 && (
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Detailed Certification Progress
            </h3>
            <div className="space-y-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-primary-500 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {cert.certificationName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Provider: {cert.provider}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">
                      {cert.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${cert.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{cert.completedModules} of {cert.totalModules} modules completed</span>
                    <span className={`capitalize px-2 py-1 rounded text-xs ${
                      cert.status === 'completed' ? 'bg-green-100 text-green-800' :
                      cert.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cert.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}