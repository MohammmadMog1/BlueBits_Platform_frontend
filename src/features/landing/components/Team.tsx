import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronDown } from 'lucide-react';
import { HexGrid, DiagonalBands, TabLabel } from './shared/VisualHelpers';
import type { Batch } from '../data/landingData';
import  {  ROLE_CONFIG } from '../data/landingData';

interface TeamProps {
  isDark: boolean;
  batches: Batch[];
  activeBatch: string;
  setActiveBatch: (id: string) => void;
  expandedRole: string | null;
  setExpandedRole: (role: string | null) => void;
}

export function Team({
  isDark,
  batches,
  activeBatch,
  setActiveBatch,
  expandedRole,
  setExpandedRole
}: TeamProps) {
  const selectedBatch = batches.find(b => b.id === activeBatch)!;

  return (
    <section id="team" className={`relative py-20 sm:py-32 overflow-hidden ${isDark ? 'bg-[#111217]' : 'bg-[#F1FFFA]'}`}>
      <div className="absolute left-0 top-0 h-full pointer-events-none overflow-hidden">
        <DiagonalBands className="h-full w-auto max-w-[50px] sm:max-w-[70px] opacity-40" />
      </div>
      <HexGrid className="absolute right-0 bottom-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px]" opacity={isDark ? 0.04 : 0.03} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-12 sm:mb-16">
          <TabLabel className="mb-4 sm:mb-6 mx-auto">
            <Users className="w-3 h-3" />فريق العمل
          </TabLabel>
          <h2 className={`mb-4 ${isDark ? 'text-white' : 'text-[#1a1b2e]'}`}
              style={{ fontSize: 'clamp(1.7rem, 4vw, 3rem)', fontWeight: 800 }}>
            تعرّف على فريق BlueBits
          </h2>
          <p className={`text-base sm:text-lg max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            مجموعة من طلاب الحاسب الآلي المتحمسين، يعملون معاً عبر الدفعات لتطوير أفضل منصة أكاديمية.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {batches.map(b => (
            <button
              key={b.id}
              onClick={() => { setActiveBatch(b.id); setExpandedRole(null); }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                activeBatch === b.id
                  ? 'bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-lg shadow-[#404293]/30 -translate-y-0.5'
                  : isDark
                  ? 'bg-white/6 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#404293]/30 hover:text-[#404293] shadow-sm'
              }`}
            >
              {b.label}
              {b.current && (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  activeBatch === b.id ? 'bg-white/25 text-white' : 'bg-emerald-500/15 text-emerald-600'
                }`}>
                  حالي
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeBatch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`relative overflow-hidden rounded-3xl border mb-6 p-6 sm:p-8 ${
              isDark ? 'bg-gradient-to-br from-[#404293]/15 to-[#2376BB]/10 border-[#404293]/25' : 'bg-gradient-to-br from-[#404293]/5 to-[#2376BB]/5 border-[#404293]/15'
            }`}>
              <div className="absolute top-0 right-0 h-full pointer-events-none overflow-hidden opacity-30">
                <DiagonalBands className="h-full w-auto max-w-[60px] scale-x-[-1]" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#1a1b2e]'}`}>
                      {selectedBatch.label}
                    </h3>
                    {selectedBatch.current && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        الدفعة الحالية
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    العام الدراسي {selectedBatch.academicYear}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {[
                    { label: 'المسؤولون', count: 2 + selectedBatch.subjectManagers.length },
                    { label: 'العلميون',  count: selectedBatch.scientificMembers.length },
                    { label: 'التقنيون',  count: selectedBatch.technicalMembers.length },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#404293]'}`}>{s.count}</div>
                      <div className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {ROLE_CONFIG.map(role => {
                const isExpanded = expandedRole === role.key;
                const members: any[] = role.single
                  ? [(selectedBatch as any)[role.key]]
                  : (selectedBatch as any)[role.key];
                const Icon = role.icon;

                return (
                  <div key={role.key} className={`rounded-2xl border overflow-hidden transition-all ${
                    isDark ? 'border-white/8 bg-white/3' : 'border-gray-200 bg-white shadow-sm'
                  }`}>
                    <button
                      onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                      className={`w-full flex items-center justify-between p-4 sm:p-5 transition-colors ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ backgroundColor: role.bg, border: `1.5px solid ${role.color}20` }}>
                          <Icon className="w-4 h-4" style={{ color: role.color }} />
                        </div>
                        <div className="text-left">
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {role.label}
                          </span>
                          <span className={`mr-2 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            ({members.length} {members.length === 1 ? 'عضو' : 'أعضاء'})
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className={`px-4 sm:px-5 pb-5 pt-1 border-t ${isDark ? 'border-white/6' : 'border-gray-100'}`}>
                            <div className="flex flex-wrap gap-2 pt-3">
                              {members.map((m, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.04 }}
                                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all hover:-translate-y-0.5 ${
                                    isDark
                                      ? 'bg-white/5 border-white/10 hover:border-white/20'
                                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-sm'
                                  }`}
                                >
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black"
                                       style={{ background: `linear-gradient(135deg, ${role.color}, ${role.color}cc)` }}>
                                    {m?.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <div className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                      {m?.name}
                                    </div>
                                    {m?.subject && (
                                      <div className="text-[10px] font-medium" style={{ color: role.color }}>
                                        {m.subject}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
