import { motion } from 'motion/react';
import { playSynthBeep } from '../gameData';
import { Mech } from '../types';

interface HomeTabProps {
  pilotName: string;
  level: number;
  xp: number;
  highScore: number;
  selectedMech: Mech;
  onDeployBattle: () => void;
  onNavTab: (tab: 'home' | 'garage' | 'explore' | 'battle') => void;
  onUpdatePilotName: (name: string) => void;
}

export default function HomeTab({
  pilotName,
  level,
  xp,
  highScore,
  selectedMech,
  onDeployBattle,
  onNavTab,
  onUpdatePilotName,
}: HomeTabProps) {
  const handleDeployClick = () => {
    playSynthBeep('select');
    onDeployBattle();
  };

  return (
    <div className="relative w-full min-h-screen pt-20 pb-32 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Cyberpunk Cinematic City */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 blur-sm brightness-50"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_U0eikxv7AAIEaPtrKJHqqo_3AA931oh5cZTPHQDV_YPTgiePClIb7t2tjoQLnWdB48XZPFSNWJBZu0CJvFoIrvILQjnZW0BzHzy-WeT1nv3EDyIRQOgLO5f2tayHzPZ6EhGdWo8MFPmHGALAIWUSAX8M4NLaq1Q04YZ7fvjCpt4gIwTOF4jFD3lKRJbLsIdwVBzQYQLaE39rQob4QCdLJoFt8Fw9ZlM9bYbzI-vj0qPJ_1Tt04yqQ')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-transparent to-[#0F0F12]/80"></div>
        {/* Animated Scanline Overlay */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="w-full h-[2px] bg-primary-container animate-[scanline_4s_linear_infinite]"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-6xl px-4 md:px-8">
        <div className="relative group flex flex-col items-center">
          {/* Glowing Aura backdrop */}
          <div className="absolute -inset-10 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/30 transition-all duration-700 animate-pulse"></div>

          {/* Main Hero Emblem (IRON CLASH shield) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              alt="IRON CLASH Shield Emblem"
              referrerPolicy="no-referrer"
              className="w-56 h-56 md:w-80 md:h-80 object-contain drop-shadow-[0_0_25px_rgba(230,33,23,0.4)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACE06i29uXEOc3QoNmTym3zUwoga0z_fGmerppvbAVTXoHly2zC2o0K8WCYN28ogixWI0ByBvkaJ7cCuAHBVQD9y4PtBj28OP--rAx3GHrB4xIvOX5nA-NyMjrzq7WUn87WK26PRfrwRB4JVpZJBRD_qxMeZd535LPUok7FazO53zezKKBhlOBrmM6PoLzzrEHIe_eaeM20esD1tzIfeRoUhz98Nfs1hMwhBBpDw3KfPukcbtSNGEzsg"
            />
          </motion.div>

          {/* Floating Stats Plates */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -left-4 top-1/4 glass-panel chamfer-card p-3 md:p-4 border-l-4 border-primary-container shadow-xl"
          >
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Pilot Rank</p>
            <p className="font-headline-sm text-sm md:text-lg text-primary font-bold">ACE-IV</p>
            <p className="text-[10px] text-tertiary font-mono">High Score: {highScore}</p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -right-4 bottom-1/4 glass-panel chamfer-card p-3 md:p-4 border-r-4 border-secondary-container shadow-xl"
          >
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">Selected Mech</p>
            <p className="font-headline-sm text-sm md:text-lg text-secondary font-bold">{selectedMech.name}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] text-on-surface-variant">HP:</span>
              <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-container"
                  style={{ width: `${selectedMech.chassisIntegrity}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-primary-dim font-mono">{selectedMech.chassisIntegrity}%</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Pilot Naming Port */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col items-center gap-2 max-w-sm w-full"
        >
          <div className="bg-surface-container/60 backdrop-blur border border-outline-variant/40 px-4 py-1.5 rounded-lg flex items-center gap-2 w-full">
            <span className="material-symbols-outlined text-xs text-primary">account_circle</span>
            <input
              type="text"
              value={pilotName}
              id="pilot-name-input"
              onChange={(e) => onUpdatePilotName(e.target.value.toUpperCase())}
              className="bg-transparent border-none text-on-surface font-label-caps text-xs focus:ring-0 focus:outline-none w-full tracking-wider"
              placeholder="PILOT NAME..."
            />
            <span className="text-[8px] text-tertiary bg-tertiary/15 px-1.5 py-0.5 rounded uppercase font-mono">ONLINE</span>
          </div>
        </motion.div>

        {/* Tactical Cinematic Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center space-y-1 max-w-md px-4"
        >
          <p className="font-label-caps text-xs text-tertiary tracking-[0.25em] uppercase">Sector 42 Active Conflict</p>
          <p className="text-sm text-on-surface-variant italic">
            "The iron remains silent until the first strike is thrown."
          </p>
        </motion.div>

        {/* Center Battle Deployment Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 w-full"
        >
          <button
            onClick={handleDeployClick}
            id="battle-deploy-btn"
            className="relative group active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            {/* Ambient Button Glow */}
            <div className="absolute inset-0 bg-primary-container blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
            {/* Plated Actuator Button */}
            <div className="relative bg-primary-container px-12 py-5 chamfer-btn border-b-4 border-on-primary shadow-2xl flex items-center gap-3 animate-[metallic-pulse_2.5s_infinite] text-on-primary-container">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>swords</span>
              <span className="font-display-lg text-2xl md:text-3xl italic tracking-tighter uppercase font-extrabold">BATTLE</span>
            </div>
          </button>

          <div className="flex gap-4 items-center">
            <div className="h-[1px] w-12 bg-outline-variant"></div>
            <p className="font-label-caps text-xs text-on-surface-variant tracking-wider uppercase">READY TO DEPLOY</p>
            <div className="h-[1px] w-12 bg-outline-variant"></div>
          </div>

          <section className="w-full max-w-xl bg-surface-container/75 backdrop-blur border border-outline-variant/50 rounded-2xl p-4 md:p-5 text-left">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-headline-sm text-sm md:text-base text-primary font-bold uppercase tracking-wider">
                Quick Pilot Guide
              </h2>
              <span className="material-symbols-outlined text-primary text-lg">sports_esports</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-on-surface-variant">
              <p><span className="text-on-surface font-bold">Explore:</span> choose missions and unlock new sectors by winning battles.</p>
              <p><span className="text-on-surface font-bold">Garage:</span> select a mech, repair damage, and equip stat mods.</p>
              <p><span className="text-on-surface font-bold">Attack:</span> strike the titan, build combo, and raise your score.</p>
              <p><span className="text-on-surface font-bold">Defend:</span> charge a shield before the next enemy hit lands.</p>
            </div>
          </section>
        </motion.div>
      </div>

      {/* Side Missions Teaser (Desktop only Asymmetric layout) */}
      <aside className="hidden lg:flex fixed right-8 xl:right-12 top-1/2 -translate-y-1/2 flex-col gap-6 w-64 pointer-events-none z-25">
        <div
          onClick={() => { playSynthBeep('select'); onNavTab('explore'); }}
          className="glass-panel chamfer-card p-5 border-l-2 border-tertiary pointer-events-auto hover:-translate-x-2 transition-transform cursor-pointer group"
        >
          <h3 className="font-headline-sm text-sm text-tertiary flex items-center justify-between">
            DAILY OPS <span className="material-symbols-outlined text-xs animate-pulse">flash_on</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-1.5">Sabotage the mining core in Neo-Tokyo.</p>
          <div className="mt-3 flex justify-between items-center">
            <span className="font-label-caps text-[10px] text-tertiary">REWARD: 500 GEAR</span>
            <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </div>

        <div
          onClick={() => { playSynthBeep('select'); onNavTab('explore'); }}
          className="glass-panel chamfer-card p-5 border-l-2 border-secondary pointer-events-auto hover:-translate-x-2 transition-transform cursor-pointer opacity-80 hover:opacity-100 group"
        >
          <h3 className="font-headline-sm text-sm text-secondary flex items-center justify-between">
            CLAN WAR <span className="material-symbols-outlined text-xs">shield_with_heart</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-1.5">Defend territory against Titan Squad.</p>
          <div className="mt-3 flex justify-between items-center">
            <span className="font-label-caps text-[10px] text-secondary">STATUS: ACTIVE</span>
            <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
