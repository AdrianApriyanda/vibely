import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, X, Copy, Check, Sparkles, Heart, ArrowRight, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GroupMember {
  id: string
  name: string
  avatar: string
  status: 'pending' | 'joined' | 'swiping'
}

interface MatchResult {
  placeId: string
  placeName: string
  placeImage: string
  matchedUsers: string[]
  matchPercentage: number
}

export default function GroupMatchPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'create' | 'invite' | 'swiping' | 'results'>('create')
  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState<GroupMember[]>([
    { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', status: 'joined' },
  ])
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [swipes, setSwipes] = useState<Record<string, 'left' | 'right'>>({})

  const mockPlaces = [
    { id: '1', name: 'The Brew Lab', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', category: 'Coffee' },
    { id: '2', name: 'Midnight Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', category: 'Restaurant' },
    { id: '3', name: 'Iron Paradise', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', category: 'Gym' },
    { id: '4', name: 'Secret Garden', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400', category: 'Cafe' },
  ]

  const mockResults: MatchResult[] = [
    { placeId: '1', placeName: 'The Brew Lab', placeImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', matchedUsers: ['You', 'Sarah', 'Mike'], matchPercentage: 100 },
    { placeId: '2', placeName: 'Midnight Ramen', placeImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', matchedUsers: ['You', 'Sarah'], matchPercentage: 66 },
  ]

  const handleCreateGroup = () => {
    if (!groupName.trim()) return
    setInviteCode(Math.random().toString(36).substring(2, 8).toUpperCase())
    setStep('invite')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartSwiping = () => {
    setMembers(prev => prev.map(m => m.id === '1' ? { ...m, status: 'swiping' } : m))
    setStep('swiping')
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipes(prev => ({ ...prev, [mockPlaces[currentCard].id]: direction }))

    if (currentCard < mockPlaces.length - 1) {
      setCurrentCard(prev => prev + 1)
    } else {
      setTimeout(() => setStep('results'), 500)
    }
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Group Match</h1>
        </div>
        <p className="text-zinc-400 text-sm">Find places everyone will love</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Create Group */}
        {step === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="e.g., Friday Night Crew"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-sm outline-none focus:border-neon-purple/50"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-3 block">Members</label>
              <div className="flex items-center gap-3">
                {members.map(member => (
                  <div key={member.id} className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-zinc-800"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-950" />
                  </div>
                ))}
                <button className="w-12 h-12 rounded-2xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-neon-purple hover:text-neon-purple transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className={cn(
                'w-full py-4 rounded-2xl font-semibold transition-all',
                groupName.trim()
                  ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg'
                  : 'bg-zinc-800 text-zinc-500'
              )}
            >
              Create Group
            </button>
          </motion.div>
        )}

        {/* Step 2: Invite */}
        {step === 'invite' && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Invite Friends</h3>
              <p className="text-sm text-zinc-400 mb-4">Share this code with your friends</p>

              <div className="bg-zinc-900 rounded-2xl p-4 mb-4">
                <div className="text-3xl font-bold tracking-widest text-neon-purple mb-2">
                  {inviteCode}
                </div>
                <p className="text-xs text-zinc-500">Code expires in 24 hours</p>
              </div>

              <button
                onClick={handleCopyCode}
                className={cn(
                  'w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2',
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'glass hover:bg-white/10'
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Joined ({members.length})</h3>
              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-zinc-500">
                        {member.status === 'joined' ? 'Ready to swipe' : 'Swiping...'}
                      </p>
                    </div>
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      member.status === 'joined' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                    )} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSwiping}
              className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl font-semibold text-white shadow-lg"
            >
              Start Swiping
            </button>
          </motion.div>
        )}

        {/* Step 3: Swiping */}
        {step === 'swiping' && (
          <motion.div
            key="swiping"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-1">Card {currentCard + 1} of {mockPlaces.length}</p>
              <div className="flex justify-center gap-1">
                {mockPlaces.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all',
                      i < currentCard ? 'w-6 bg-neon-purple' : 
                      i === currentCard ? 'w-6 bg-white' : 'w-2 bg-zinc-700'
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="relative h-[50vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={mockPlaces[currentCard].image}
                    alt={mockPlaces[currentCard].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-xs bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-2 inline-block">
                      {mockPlaces[currentCard].category}
                    </span>
                    <h3 className="text-2xl font-bold">{mockPlaces[currentCard].name}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
              >
                <X className="w-6 h-6 text-red-400" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/50 transition-colors"
              >
                <Heart className="w-6 h-6 text-green-400" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center"
              >
                <PartyPopper className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">It's a Match!</h2>
              <p className="text-zinc-400 text-sm">Here are places everyone liked</p>
            </div>

            <div className="space-y-4">
              {mockResults.map((result, i) => (
                <motion.div
                  key={result.placeId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => navigate(`/place/${result.placeId}`)}
                  className="glass-card overflow-hidden cursor-pointer hover:border-neon-purple/30 transition-all"
                >
                  <div className="relative h-40">
                    <img src={result.placeImage} alt={result.placeName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 right-3 bg-neon-purple/20 backdrop-blur-md px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-neon-purple">{result.matchPercentage}% Match</span>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-xl font-bold">{result.placeName}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-400">Liked by:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.matchedUsers.map((user, j) => (
                        <span key={j} className="text-xs bg-neon-purple/10 text-neon-purple px-2 py-1 rounded-full">
                          {user}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => navigate('/explore')}
              className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl font-semibold text-white shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Explore Matches
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
