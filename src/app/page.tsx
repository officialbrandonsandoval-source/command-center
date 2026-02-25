import state from '@/data/state.json'

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  'funded-pre-build': { label: 'Funded — Pre-Build', color: 'text-yellow-400', dot: 'bg-yellow-400' },
  'active-pilots':    { label: 'Active Pilots',       color: 'text-blue-400',   dot: 'bg-blue-400'   },
  'live-pre-launch':  { label: 'Live — Pre-Launch',   color: 'text-violet-400', dot: 'bg-violet-400' },
  'live':             { label: 'Live',                 color: 'text-emerald-400',dot: 'bg-emerald-400'},
  'live-pre-users':   { label: 'Live — Pre-Users',    color: 'text-emerald-400',dot: 'bg-emerald-400'},
  'active':           { label: 'Active',               color: 'text-emerald-400',dot: 'bg-emerald-400'},
  'studying':         { label: 'Studying',             color: 'text-gray-400',   dot: 'bg-gray-400'   },
  'building':         { label: 'Building',             color: 'text-blue-400',   dot: 'bg-blue-400'   },
  'proposed':         { label: 'Proposed',             color: 'text-gray-500',   dot: 'bg-gray-600'   },
}

const MS_CONFIG: Record<string, { icon: string; color: string }> = {
  'done':        { icon: '✓', color: 'text-emerald-400' },
  'pending':     { icon: '◎', color: 'text-yellow-400'  },
  'not-started': { icon: '○', color: 'text-gray-600'    },
}

const LAYER_COLOR: Record<string, string> = {
  layer1: 'border-amber-500/30 bg-amber-500/5',
  layer2: 'border-blue-500/30 bg-blue-500/5',
  layer3: 'border-violet-500/30 bg-violet-500/5',
}

function ProgressBar({ value, max, color = 'bg-blue-500' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{children}</h2>
}

export default function CommandCenter() {
  const s = state as typeof import('@/data/state.json')
  const mrrPct = Math.round((s.revenue.currentMRR / s.revenue.targetMRR) * 100)
  const now = new Date()
  const lastUpdated = new Date(s._meta.lastUpdated)
  const activeAgents = s.agents.filter(a => a.status === 'active').length
  const proposedAgents = s.agents.filter(a => a.status === 'proposed').length
  const liveProjects = s.projects.filter(p => p.status === 'live' || p.status === 'live-pre-users' || p.status === 'live-pre-launch' || p.status === 'active-pilots').length

  return (
    <main className="min-h-screen bg-gray-950 pb-20">
      {/* Top bar */}
      <div className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <span className="text-violet-400 text-xl">⚔️</span>
          <div>
            <div className="font-bold tracking-tight">Sovereign Command Center</div>
            <div className="text-xs text-gray-500">Brandon Sandoval / Operaxon</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          <div>Updated {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          <div>{s._meta.updatedBy}</div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-5xl mx-auto space-y-8">

        {/* Mission banner */}
        <div className="bg-gradient-to-r from-violet-950/60 to-gray-950 border border-violet-500/20 rounded-2xl px-6 py-5">
          <div className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-2">North Star</div>
          <p className="text-gray-200 font-medium leading-relaxed">"{s.principal.mission}"</p>
          <p className="text-xs text-gray-500 mt-2">The Question: <span className="text-violet-300 italic">{s.principal.theQuestion}</span></p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-2xl font-bold text-white">${s.revenue.currentMRR.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Current MRR</div>
            <div className="text-xs text-gray-600">of ${s.revenue.targetMRR.toLocaleString()} target</div>
            <ProgressBar value={s.revenue.currentMRR} max={s.revenue.targetMRR} color="bg-emerald-500" />
          </Card>
          <Card>
            <div className="text-2xl font-bold text-blue-400">{activeAgents}</div>
            <div className="text-xs text-gray-500 mt-1">Active Agents</div>
            <div className="text-xs text-gray-600">{proposedAgents} proposed</div>
          </Card>
          <Card>
            <div className="text-2xl font-bold text-violet-400">{liveProjects}</div>
            <div className="text-xs text-gray-500 mt-1">Live Projects</div>
            <div className="text-xs text-gray-600">{s.projects.length} total in pipeline</div>
          </Card>
          <Card>
            <div className="text-2xl font-bold text-amber-400">$6K</div>
            <div className="text-xs text-gray-500 mt-1">Monthly Retainer</div>
            <div className="text-xs text-gray-600">Shiftly Auto · 90 days</div>
          </Card>
        </div>

        {/* Three Layer Thesis */}
        <section>
          <SectionLabel>The Three-Layer Thesis</SectionLabel>
          <div className="grid md:grid-cols-3 gap-4">
            {(['layer1', 'layer2', 'layer3'] as const).map((key) => {
              const layer = s.threeLayerThesis[key]
              return (
                <div key={key} className={`border rounded-2xl p-5 ${LAYER_COLOR[key]}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">{key.replace('layer', 'Layer ')}</div>
                      <div className="font-bold text-lg">{layer.name}</div>
                    </div>
                    <div className="text-2xl font-bold text-white">{layer.progress}%</div>
                  </div>
                  <ProgressBar
                    value={layer.progress}
                    max={100}
                    color={key === 'layer1' ? 'bg-amber-500' : key === 'layer2' ? 'bg-blue-500' : 'bg-violet-500'}
                  />
                  <p className="text-xs text-gray-400 mt-3 mb-3">{layer.description}</p>
                  <div className="space-y-1">
                    {layer.built.slice(0, 3).map((b: string) => (
                      <div key={b} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {b}
                      </div>
                    ))}
                    {layer.next.slice(0, 2).map((n: string) => (
                      <div key={n} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">→</span> {n}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Projects */}
        <section>
          <SectionLabel>Active Projects</SectionLabel>
          <div className="space-y-3">
            {s.projects.map((project) => {
              const cfg = STATUS_CONFIG[project.status] || { label: project.status, color: 'text-gray-400', dot: 'bg-gray-400' }
              const done = project.milestones.filter((m) => m.status === 'done').length
              const total = project.milestones.length
              return (
                <Card key={project.id}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-bold text-base">{project.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        </div>
                        {project.layer.map((l: string) => (
                          <span key={l} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-md">{l}</span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm">{project.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-white">{done}/{total}</div>
                      <div className="text-xs text-gray-500">milestones</div>
                    </div>
                  </div>

                  <ProgressBar value={done} max={total} color="bg-violet-500" />

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                    {project.milestones.map((m) => {
                      const ms = MS_CONFIG[m.status] || MS_CONFIG['not-started']
                      return (
                        <div key={m.name} className="flex items-start gap-2 text-xs">
                          <span className={`${ms.color} mt-0.5 shrink-0 font-bold`}>{ms.icon}</span>
                          <span className={m.status === 'done' ? 'text-gray-400 line-through' : m.status === 'pending' ? 'text-gray-200' : 'text-gray-600'}>
                            {m.name}
                          </span>
                          <span className="text-gray-600 ml-auto shrink-0">{m.due}</span>
                        </div>
                      )
                    })}
                  </div>

                  {project.blockers && project.blockers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      {project.blockers.map((b: string) => (
                        <div key={b} className="flex items-start gap-2 text-xs text-red-300">
                          <span className="text-red-400 shrink-0">⚠</span> {b}
                        </div>
                      ))}
                    </div>
                  )}

                  {'url' in project && project.url && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:underline">
                        {project.url} →
                      </a>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </section>

        {/* Agent Roster */}
        <section>
          <SectionLabel>Agent Roster</SectionLabel>
          <div className="grid md:grid-cols-2 gap-3">
            {s.agents.map((agent) => {
              const cfg = STATUS_CONFIG[agent.status] || { label: agent.status, color: 'text-gray-400', dot: 'bg-gray-400' }
              return (
                <div
                  key={agent.id}
                  className={`border rounded-xl p-4 ${agent.status === 'proposed' ? 'border-gray-800 bg-gray-900/30 opacity-60' : 'border-gray-800 bg-gray-900'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-500">{agent.id}</span>
                        <div className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                          <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      </div>
                      <div className="font-semibold text-sm mt-0.5">{agent.name}</div>
                      <div className="text-xs text-gray-500">{agent.role}</div>
                    </div>
                  </div>
                  {'schedule' in agent && (
                    <div className="text-xs text-gray-600 mt-1">🕐 {agent.schedule}</div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {agent.owns.slice(0, 2).map((o: string) => (
                      <span key={o} className="text-xs bg-gray-800/60 text-gray-400 px-2 py-0.5 rounded">{o}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Legal & Admin */}
        <section>
          <SectionLabel>Legal & Admin Checklist</SectionLabel>
          <Card>
            <div className="space-y-3">
              {[
                {
                  label: 'DBA Filing — "Operaxon"',
                  status: s.legalAdmin.dbaFiling.status,
                  note: `azsos.gov/business/tntm · $10 · Due ${s.legalAdmin.dbaFiling.deadline}`,
                  urgent: true,
                },
                {
                  label: 'LLC Operating Agreement',
                  status: s.legalAdmin.operatingAgreement.status,
                  note: 'Drafted — needs attorney review (Articles V & VI)',
                  urgent: false,
                },
                {
                  label: 'IP Carve-Out — Ethan Signature',
                  status: s.legalAdmin.ipCarveOut.status,
                  note: 'MUST be signed before any PONS code is written',
                  urgent: true,
                },
                {
                  label: 'Business Checking Account',
                  status: s.legalAdmin.businessChecking.status,
                  note: 'Open after DBA is filed',
                  urgent: false,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 text-sm font-bold ${
                    item.status === 'done' || item.status === 'drafted' ? 'text-emerald-400' :
                    item.status === 'pending' || item.status === 'pending-signature' ? 'text-yellow-400' :
                    'text-gray-600'
                  }`}>
                    {item.status === 'done' || item.status === 'drafted' ? '✓' : '○'}
                  </span>
                  <div>
                    <div className={`text-sm font-medium ${item.urgent && item.status !== 'done' ? 'text-red-300' : 'text-gray-200'}`}>
                      {item.label} {item.urgent && item.status !== 'done' ? '⚠' : ''}
                    </div>
                    <div className="text-xs text-gray-500">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Revenue */}
        <section>
          <SectionLabel>Revenue Pipeline</SectionLabel>
          <Card>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-white">${s.revenue.currentMRR.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Current MRR</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">${s.revenue.targetMRR.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Target MRR</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">${(s.revenue.targetMRR - s.revenue.currentMRR).toLocaleString()}</div>
                <div className="text-xs text-gray-500">Gap to close</div>
              </div>
            </div>
            <ProgressBar value={s.revenue.currentMRR} max={s.revenue.targetMRR} color="bg-emerald-500" />
            <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
              <div className="flex items-center justify-between">
                <span>Shiftly Retainer (not MRR)</span>
                <span className="text-white font-medium">$6,000/mo</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Monthly goal deadline</span>
                <span className="text-yellow-400">{s.revenue.monthlyGoalDeadline}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Paid clients needed</span>
                <span className="text-white">{s.revenue.paidClients} / {s.revenue.targetPaidClients}</span>
              </div>
            </div>
          </Card>
        </section>

        <div className="text-center text-xs text-gray-600 pt-4">
          Sovereign Agent Civilization · {s.principal.entity}<br />
          Dashboard auto-updates on every agent push · Built by AGT-000
        </div>
      </div>
    </main>
  )
}
