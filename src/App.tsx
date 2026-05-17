import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Layouts
import MobileLayout from '@/components/layout/MobileLayout'

// Pages
import LandingPage from '@/pages/LandingPage'
import ExplorePage from '@/pages/ExplorePage'
import SwipePage from '@/pages/SwipePage'
import PlaceDetailPage from '@/pages/PlaceDetailPage'
import SavedPage from '@/pages/SavedPage'
import ProfilePage from '@/pages/ProfilePage'
import AISearchPage from '@/pages/AISearchPage'
import GroupMatchPage from '@/pages/GroupMatchPage'
import BusinessDashboard from '@/pages/BusinessDashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import AuthPage from '@/pages/AuthPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 20px',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes */}
          <Route element={<MobileLayout />}>
            <Route path="/explore" element={user ? <ExplorePage /> : <Navigate to="/auth" />} />
            <Route path="/swipe" element={user ? <SwipePage /> : <Navigate to="/auth" />} />
            <Route path="/place/:id" element={user ? <PlaceDetailPage /> : <Navigate to="/auth" />} />
            <Route path="/saved" element={user ? <SavedPage /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" />} />
            <Route path="/search" element={user ? <AISearchPage /> : <Navigate to="/auth" />} />
            <Route path="/group-match" element={user ? <GroupMatchPage /> : <Navigate to="/auth" />} />
            <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
          </Route>

          {/* Business & Admin */}
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function AuthCallback() {
  return <Navigate to="/explore" />
}

export default App
