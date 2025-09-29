import { User } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  lastLogin: Timestamp
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    slackWebhook?: string
  }
}

export interface Assignment {
  id: string
  userId: string
  title: string
  description: string
  course: string
  dueDate: Timestamp
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
  ipfsHash?: string
  nftMetadata?: {
    name: string
    description: string
    image: string
    attributes: Array<{ trait_type: string; value: string }>
  }
}

export interface CertificationProgress {
  id: string
  userId: string
  certificationName: string
  provider: 'IEEE' | 'Red Hat' | 'Other'
  progress: number // 0-100
  totalModules: number
  completedModules: number
  targetDate?: Timestamp
  status: 'not-started' | 'in-progress' | 'completed' | 'expired'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface StudySession {
  id: string
  userId: string
  assignmentId?: string
  certificationId?: string
  duration: number // minutes
  topics: string[]
  notes?: string
  createdAt: Timestamp
}

export interface PerplexityFeed {
  id: string
  userId: string
  query: string
  response: string
  sources: Array<{
    title: string
    url: string
    snippet: string
  }>
  createdAt: Timestamp
}

export interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}