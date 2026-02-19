'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PomodoroPreset } from '@/types/preset'
import { getAccent } from '@/lib/preset-accents'

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

const MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

type TimerModalProps = {
  onClose: () => void
  onStart: (mode: TimerMode, duration: number) => void
  currentMode: TimerMode
  presets: PomodoroPreset[]
  activePresetId: string
  onActivePresetChange: (id: string) => void
  onPresetDurationsChange: (presetId: string, field: 'pomodoro' | 'shortBreak' | 'longBreak', value: number) => void
  onPresetsChange: (presets: PomodoroPreset[]) => void
  onResetDefaults: () => void
}

export default function TimerModal({
  onClose,
  onStart,
  currentMode,
  presets,
  activePresetId,
  onActivePresetChange,
  onPresetDurationsChange,
  onPresetsChange,
  onResetDefaults,
}: TimerModalProps) {
  const activePreset = presets.find((p) => p.id === activePresetId) || presets[0]
  const [mode, setMode] = useState<TimerMode>(currentMode)
  const [duration, setDuration] = useState(activePreset?.[currentMode] ?? 25)

  // Inline rename state
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  // New preset creation state
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const newNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (activePreset) {
      setDuration(activePreset[mode])
    }
  }, [activePresetId, mode, activePreset])

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingId])

  useEffect(() => {
    if (isCreating && newNameInputRef.current) {
      newNameInputRef.current.focus()
    }
  }, [isCreating])

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    if (activePreset) {
      setDuration(activePreset[newMode])
    }
  }

  const handleDurationChange = (newDuration: number) => {
    const validDuration = Math.max(1, Math.min(120, newDuration))
    setDuration(validDuration)
    if (activePreset) {
      onPresetDurationsChange(activePreset.id, mode, validDuration)
    }
  }

  const handleStart = () => {
    onStart(mode, duration * 60)
  }

  const handlePresetSelect = (presetId: string) => {
    if (renamingId) return
    onActivePresetChange(presetId)
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      setDuration(preset[mode])
    }
  }

  const startRename = (preset: PomodoroPreset, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingId(preset.id)
    setRenameValue(preset.name)
  }

  const commitRename = () => {
    if (!renamingId) return
    const trimmed = renameValue.trim()
    if (trimmed) {
      const updated = presets.map((p) =>
        p.id === renamingId ? { ...p, name: trimmed } : p
      )
      onPresetsChange(updated)
    }
    setRenamingId(null)
    setRenameValue('')
  }

  const cancelRename = () => {
    setRenamingId(null)
    setRenameValue('')
  }

  const handleDelete = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = presets.filter((p) => p.id !== presetId)
    onPresetsChange(updated)
    if (activePresetId === presetId && updated.length > 0) {
      onActivePresetChange(updated[0].id)
    }
  }

  const handleCreate = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    const preset: PomodoroPreset = {
      id: crypto.randomUUID(),
      name: trimmed,
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    }
    onPresetsChange([...presets, preset])
    onActivePresetChange(preset.id)
    setNewName('')
    setIsCreating(false)
  }

  const modes: TimerMode[] = ['pomodoro', 'shortBreak', 'longBreak']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
        className="glass-effect rounded-3xl p-8 w-[460px] text-center"
      >
        {/* Preset selector */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Cycle</span>
            <button
              onClick={onResetDefaults}
              className="cursor-pointer text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.07] uppercase tracking-wider font-medium"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, idx) => {
              const isActive = activePresetId === preset.id
              const accent = getAccent(preset.id, idx)
              const isRenaming = renamingId === preset.id

              return (
                <div
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`group relative cursor-pointer text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${accent.activeBg} ring-1 ${accent.ring}`
                      : `${accent.bg} hover:brightness-150`
                  }`}
                >
                  {/* Hover actions */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => startRename(preset, e)}
                      className="cursor-pointer p-1 text-white/25 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      title="Rename"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {!preset.isDefault && (
                      <button
                        onClick={(e) => handleDelete(preset.id, e)}
                        className="cursor-pointer p-1 text-white/25 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-0.5 h-5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accent.dot} ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                    {isRenaming ? (
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename()
                          if (e.key === 'Escape') cancelRename()
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[13px] leading-5 font-medium text-white bg-transparent border-b border-white/30 min-w-0 w-full p-0 focus:outline-none focus:border-white/50"
                      />
                    ) : (
                      <span className={`text-[13px] leading-5 font-medium truncate ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {preset.name}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] pl-3.5 tabular-nums ${isActive ? 'text-white/45' : 'text-white/25'}`}>
                    {preset.pomodoro}m · {preset.shortBreak}m · {preset.longBreak}m
                  </span>
                </div>
              )
            })}

            {/* Add preset card */}
            {isCreating ? (
              <div className="text-left px-3.5 py-2.5 rounded-xl bg-white/[0.08] ring-1 ring-white/10">
                <input
                  ref={newNameInputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate()
                    if (e.key === 'Escape') { setIsCreating(false); setNewName('') }
                  }}
                  placeholder="Preset name"
                  className="w-full text-[13px] font-medium text-white bg-transparent placeholder:text-white/25 focus:outline-none mb-1"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/25 tabular-nums">25m · 5m · 15m</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setIsCreating(false); setNewName('') }}
                      className="cursor-pointer text-[11px] text-white/30 hover:text-white/60 px-1.5 py-0.5 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="cursor-pointer text-[11px] text-white font-medium bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="cursor-pointer flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/12 text-white/30 hover:text-white/60 hover:border-white/25 hover:bg-white/[0.03] transition-all duration-200 py-2.5 text-xs font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Preset
              </button>
            )}
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex justify-center rounded-xl bg-white/[0.05] p-1 mb-8">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`cursor-pointer flex-1 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                mode === m
                  ? 'bg-white/15 text-white font-medium shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Duration editor */}
        <div className="mb-8">
          <p className="text-[11px] text-white/35 uppercase tracking-widest mb-4 font-medium">Minutes</p>
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => handleDurationChange(duration - 5)}
              className="cursor-pointer w-11 h-11 rounded-full bg-white/[0.07] hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white text-lg transition-all duration-200"
            >
              −
            </button>
            <input
              type="number"
              value={duration}
              onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
              className="w-24 bg-transparent text-center text-5xl font-light text-white focus:outline-none tabular-nums"
              min="1"
              max="120"
            />
            <button
              onClick={() => handleDurationChange(duration + 5)}
              className="cursor-pointer w-11 h-11 rounded-full bg-white/[0.07] hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white text-lg transition-all duration-200"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="cursor-pointer w-full py-3.5 text-base font-medium rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200 uppercase tracking-widest"
        >
          Start
        </button>
      </motion.div>
    </motion.div>
  )
}
