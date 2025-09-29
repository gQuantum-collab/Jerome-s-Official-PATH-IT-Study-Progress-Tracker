import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'CyberSecure Study Tracker',
  description: 'A comprehensive progress tracker for cybersecurity students pursuing IEEE and Red Hat certifications',
  keywords: ['cybersecurity', 'education', 'IEEE', 'Red Hat', 'certifications', 'study tracker'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}