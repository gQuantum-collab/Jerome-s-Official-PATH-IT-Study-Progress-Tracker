import { ShieldCheckIcon, BookOpenIcon, ChartBarIcon, CloudIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          CyberSecure Study Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your cybersecurity education journey, manage assignments, and monitor progress toward IEEE and Red Hat certifications.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card text-center">
          <ShieldCheckIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Security Focus</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Specialized for cybersecurity education and certification tracking.
          </p>
        </div>

        <div className="card text-center">
          <BookOpenIcon className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Assignment Management</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and track all your cybersecurity coursework and projects.
          </p>
        </div>

        <div className="card text-center">
          <ChartBarIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Visual charts showing your advancement toward certifications.
          </p>
        </div>

        <div className="card text-center">
          <CloudIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Cloud Integration</h3>
          <p className="text-gray-600 dark:text-gray-400">
            IPFS pinning, NFT metadata, and cloud-based notifications.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="card max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to access your personalized dashboard and start tracking your cybersecurity education journey.
          </p>
          <button className="btn-primary w-full">
            Sign In with Google
          </button>
        </div>
      </div>
    </main>
  )
}