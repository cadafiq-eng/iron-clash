import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSynthBeep, getCustomizedStats } from '../gameData';
import { Mech, Mission } from '../types';

interface BattleEngineTabProps {
  selectedMech: Mech;
  activeMission: Mission | null;
  pilotName: string;
  onBattleVictory: (xpEarned: number, scoreGained: number) => void;
  onBattleDefeat: (damageTaken: number) => void;
  onExitBattle: (destination: 'explore' | 'garage') => void;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'damage' | 'heal' | 'combo' | 'shield';
}

export default function BattleEngineTab({
  selectedMech,
  activeMission,
  pilotName,
  onBattleVictory,
  onBattleDefeat,
  onExitBattle,
}: BattleEngineTabProps) {
  // Toggle between Cybernetic Dark (cockpit) and Neon Quest (friendly sky city)
  const [engineMode, setEngineMode] = useState<'dark' | 'neon'>('dark');

  // Game state
  const [playerHP, setPlayerHP] = useState<number>(() => selectedMech.chassisIntegrity);
  const [enemyHP, setEnemyHP] = useState<number>(100);
  const [score, setScore] = useState<number>(42850);
  const [combo, setCombo] = useState<number>(12);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [battleLogs, setBattleLogs] = useState<string[]>(['BATTLE SYSTEM ENGAGED. PILOT LOCKED.']);
  const [enemyAttackCooldown, setEnemyAttackCooldown] = useState<number>(100);
  const [battleState, setBattleState] = useState<'fighting' | 'victory' | 'defeat'>('fighting');

  // Get current mech stats with mods
  const customizedStats = getCustomizedStats(selectedMech, selectedMech.equippedMods);

  useEffect(() => {
    setPlayerHP(selectedMech.chassisIntegrity);
    setEnemyHP(100);
    setScore(42850);
    setCombo(12);
    setIsShieldActive(false);
    setFloatingTexts([]);
    setBattleLogs(['BATTLE SYSTEM ENGAGED. PILOT LOCKED.']);
    setEnemyAttackCooldown(100);
    setBattleState('fighting');
  }, [selectedMech.id, selectedMech.chassisIntegrity, activeMission?.id]);

  // Auto-ticking score simulator
  useEffect(() => {
    if (battleState !== 'fighting') return;
    const interval = setInterval(() => {
      setScore(prev => prev + Math.floor(Math.random() * 50) + 20);
    }, 2000);
    return () => clearInterval(interval);
  }, [battleState]);

  // Periodic enemy attack simulation
  useEffect(() => {
    if (battleState !== 'fighting') return;

    const interval = setInterval(() => {
      setEnemyAttackCooldown(prev => {
        if (prev <= 10) {
          // Trigger Enemy Attack!
          triggerEnemyStrike();
          return 100;
        }
        return prev - 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [battleState, isShieldActive]);

  const addFloatingText = (text: string, type: 'damage' | 'heal' | 'combo' | 'shield') => {
    const id = Math.random().toString();
    const x = Math.random() * 120 + 80;
    const y = Math.random() * 100 + 200;
    setFloatingTexts(prev => [...prev, { id, text, x, y, type }]);

    // auto cleanup
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1200);
  };

  const logEvent = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev.slice(0, 10)]);
  };

  const triggerEnemyStrike = () => {
    // Enemy deals random damage based on current mech armor
    const baseEnemyDmg = engineMode === 'dark' ? 18 : 12;
    // Lower damage if player has higher armor
    const armorMitigation = (customizedStats.armor / 100) * 8;
    let finalDmg = Math.max(3, Math.round(baseEnemyDmg - armorMitigation));

    if (isShieldActive) {
      finalDmg = Math.round(finalDmg * 0.2); // 80% shield mitigation
      addFloatingText('SHIELD REFLECT!', 'shield');
      logEvent('SHIELD: ENEMY ATTACK REDUCED BY DEFENSE FIELD');
      playSynthBeep('shield');
      setIsShieldActive(false); // consume shield
    } else {
      addFloatingText(`-${finalDmg} HP`, 'damage');
      logEvent(`IMPACT: ENEMY STRIKES BACK: -${finalDmg} CHASSIS DAMAGE`);
      playSynthBeep('damage');
    }

    setPlayerHP(prev => {
      const nextHP = Math.max(0, prev - finalDmg);
      if (nextHP <= 0) {
        setBattleState('defeat');
        playSynthBeep('game-over');
        onBattleDefeat(customizedStats.armor > 80 ? 30 : 50); // damage taken to selectedMech
      }
      return nextHP;
    });
  };

  const handleAttack = () => {
    if (battleState !== 'fighting') return;
    playSynthBeep('click');

    // Base damage depends on customize stats power
    const powerBias = customizedStats.power / 4;
    const baseDamage = engineMode === 'dark' ? 12 : 15;
    const finalPlayerDmg = Math.round(baseDamage + powerBias + Math.random() * 6);

    addFloatingText(`-${finalPlayerDmg} DMG`, 'combo');
    setCombo(prev => prev + 1);

    setEnemyHP(prev => {
      const nextEnemyHP = Math.max(0, prev - finalPlayerDmg);
      if (nextEnemyHP <= 0) {
        setBattleState('victory');
        playSynthBeep('victory');
        const xpReward = activeMission ? activeMission.xpReward : 2000;
        const finalScore = score + 1500 + (combo + 1) * 100;
        onBattleVictory(xpReward, finalScore);
      }
      return nextEnemyHP;
    });

    logEvent(`ATTACK: PILOT STRIKES TITAN: DELIVERED ${finalPlayerDmg} DAMAGE`);
  };

  const handleDefend = () => {
    if (battleState !== 'fighting') return;
    playSynthBeep('select');
    setIsShieldActive(true);
    addFloatingText('SHIELD CHARGED!', 'heal');
    logEvent('SHIELD: TACTICAL FORCE FIELD CHARGED');
  };

  // Environment and theme variables depending on mode
  const isDark = engineMode === 'dark';
  const playerLabel = isDark ? 'PILOT_X_01' : 'HERO_ONE';
  const enemyLabel = isDark ? 'V_TITAN_7' : 'ROBO_FRIEND';
  const environmentTitle = isDark ? 'BATTLE_ZONE_09' : 'QUEST_WORLD_01';
  const backdropUrl = isDark
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVeAmjGeZqyXFr0hwT16PmoSkkJN3L5EDZedXDfyEAONZ_pTjc_z7J-HfyYK1LWKx7iSyNf2ZlALWfj1ESs1rDWdggxH9ZptQYiE067EwXd3xMPXQ_PiF0Dwq4CumWODkTKY72gPFmgA-bfgsl8TjFLp6WdK9ToCdvLfTpdq03NReA7SAQgB38tX-FJcFMa0POXc-YpOplfrCsCjqTZOuHTxfcJNTBIYSCKefiUwqVD0sDemCMHVIhqw'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3PAdamHqTSr-sTEs46YxKGx8svWQ6R0c5coevJL7cI2vRfdx1-sBnZ90Ridj8cgMKCj9qD1bv8cTwm3FliyeFNlIkY5-bLIzB0990fKiJhquMQUbp5IwGOur7m6BPnJSETcniT9ZESW7VHhF5sXYSslhv_mReQnbss2RtgRqSwsiYS8m96EPcNrj32Mo3a-lX6JGCrN1tk7hSMEbTudG57D9BVZAjh3WmrNKspBsVxvS69PLVYFBBEw';

  return (
    <div className="relative w-full h-screen overflow-hidden select-none text-on-surface">
      {/* Background Arena Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div
          key={engineMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backdropUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-65"></div>
        <div className="hud-scanline absolute inset-0 opacity-20"></div>
      </div>

      {/* TOP HUD HEADER */}
      <header className="fixed top-0 left-0 w-full z-30 flex justify-between items-center px-4 py-4 md:py-6 bg-gradient-to-b from-[#1a0a08]/90 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-4 w-full max-w-5xl mx-auto">
          {/* PLAYER STATUS */}
          <div className="flex-1 flex flex-col gap-1 text-left">
            <div className="flex justify-between items-end">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest">{pilotName || playerLabel}</span>
              <span className="font-label-caps text-[10px] text-primary opacity-90 font-mono">INTEGRITY {playerHP}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container border border-outline-variant/50 overflow-hidden rounded-full p-0.5">
              <motion.div
                className="h-full bg-primary-container energy-pulse rounded-full"
                animate={{ width: `${playerHP}%` }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
              </motion.div>
            </div>
          </div>

          {/* VS CENTER POINT */}
          <div className="flex flex-col items-center px-4 md:px-6">
            <div className="font-display-lg text-2xl md:text-3xl italic uppercase tracking-tighter text-tertiary drop-shadow-[0_0_15px_rgba(233,196,0,0.6)] font-extrabold animate-pulse">
              {isDark ? 'VS' : 'GO!'}
            </div>
            <div className="text-[9px] font-label-caps text-on-surface-variant opacity-70 font-mono">{environmentTitle}</div>
          </div>

          {/* ENEMY STATUS */}
          <div className="flex-1 flex flex-col gap-1 text-right">
            <div className="flex justify-between items-end">
              <span className="font-label-caps text-xs text-secondary font-bold tracking-widest uppercase">{enemyLabel}</span>
              <span className="font-label-caps text-[10px] text-secondary opacity-90 font-mono">THREAT {enemyHP}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container border border-outline-variant/50 overflow-hidden rounded-full p-0.5">
              <motion.div
                className="h-full bg-secondary-container energy-pulse ml-auto rounded-full"
                animate={{ width: `${enemyHP}%` }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Arena environment Engine Switcher */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 bg-surface-container/85 border border-outline-variant/50 rounded-full px-4 py-1 flex items-center gap-3">
        <span className="text-[10px] font-label-caps text-on-surface-variant font-bold">MODE:</span>
        <button
          onClick={() => { playSynthBeep('click'); setEngineMode('dark'); }}
          className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${isDark ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
        >
          DARK COCKPIT
        </button>
        <button
          onClick={() => { playSynthBeep('click'); setEngineMode('neon'); }}
          className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${!isDark ? 'bg-tertiary text-on-tertiary' : 'text-on-surface-variant'}`}
        >
          NEON QUEST
        </button>
      </div>

      {/* FLOAT DAMAGE TEXT LAYER */}
      <div className="absolute inset-0 pointer-events-none z-25">
        <AnimatePresence>
          {floatingTexts.map(t => (
            <motion.div
              key={t.id}
              initial={{ y: t.y, x: t.x, opacity: 1, scale: 0.8 }}
              animate={{ y: t.y - 120, opacity: 0, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute font-display-lg text-2xl md:text-3xl italic font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] ${
                t.type === 'damage'
                  ? 'text-error-container'
                  : t.type === 'heal'
                  ? 'text-tertiary'
                  : t.type === 'shield'
                  ? 'text-secondary'
                  : 'text-tertiary shadow-yellow-200'
              }`}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CORE FIGHTING CANVAS */}
      <main className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none">
        {battleState === 'fighting' && (
          <div className="flex flex-col items-center gap-2">
            {/* Live Score Hud Card */}
            <div className="bg-[#1a0a08]/85 backdrop-blur-md border border-outline-variant/30 px-6 py-2.5 rounded-xl shadow-2xl flex flex-col items-center">
              <div className="font-label-caps text-[10px] text-on-surface-variant tracking-wider font-bold">
                {isDark ? 'CURRENT SCORE' : 'QUEST SCORE'}
              </div>
              <div className="font-display-lg text-3xl md:text-4xl text-tertiary font-extrabold tracking-widest font-mono">
                {score.toString().padStart(7, '0')}
              </div>
            </div>

            {/* Combo Streak meter */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 flex flex-col items-center"
            >
              <div className="text-secondary font-display-lg italic text-4xl md:text-5xl font-black drop-shadow-[0_0_15px_rgba(166,200,255,0.6)]">
                {combo}X
              </div>
              <div className="font-label-caps text-[10px] text-on-secondary-container bg-secondary-container/60 border border-secondary/30 px-4 py-1 rounded shadow-lg uppercase font-bold tracking-widest">
                {isDark ? 'COMBO STREAK' : 'STREAK BONUS'}
              </div>
            </motion.div>

            {/* Tactical Live logs */}
            <div className="mt-8 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-outline-variant/20 w-80 text-center">
              <p className="text-[10px] text-tertiary font-mono tracking-wider mb-1 uppercase font-bold">SENSOR READOUTS</p>
              <p className="text-[10px] text-on-surface-variant font-mono truncate">{battleLogs[0]}</p>
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {battleState === 'victory' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-container border-2 border-tertiary p-8 rounded-xl shadow-2xl w-full max-w-md text-center pointer-events-auto"
          >
            <span className="material-symbols-outlined text-6xl text-tertiary animate-bounce">military_tech</span>
            <h3 className="font-display-lg text-3xl font-extrabold text-tertiary italic uppercase mt-3">
              VICTORY ACHIEVED
            </h3>
            <p className="text-xs text-on-surface-variant mt-2">
              The titan defenses have been crushed! Planet security level stabilized.
            </p>

            <div className="bg-surface-container-low p-4 rounded-lg my-4 space-y-2 border border-outline-variant/40">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">XP Reward:</span>
                <span className="text-tertiary font-bold font-mono">+{activeMission ? activeMission.xpReward : 2500} XP</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Missions unlocked:</span>
                <span className="text-secondary font-bold font-mono">Sector 03 & 04</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Loot Scrap recovered:</span>
                <span className="text-primary font-bold font-mono">1.2K Scrap</span>
              </div>
            </div>

            <button
              onClick={() => { playSynthBeep('select'); onExitBattle('explore'); }}
              className="w-full bg-tertiary text-on-tertiary font-bold py-3 uppercase rounded shadow-[0_0_15px_rgba(233,196,0,0.4)] cursor-pointer"
            >
              RETURN TO MISSIONS
            </button>
          </motion.div>
        )}

        {/* Defeat Screen */}
        {battleState === 'defeat' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-container border-2 border-error p-8 rounded-xl shadow-2xl w-full max-w-md text-center pointer-events-auto"
          >
            <span className="material-symbols-outlined text-6xl text-error animate-pulse">heart_broken</span>
            <h3 className="font-display-lg text-3xl font-extrabold text-error italic uppercase mt-3">
              CHASSIS DESTROYED
            </h3>
            <p className="text-xs text-on-surface-variant mt-2">
              Critical structural damage was sustained. Deploying cockpit capsule safety protocol.
            </p>

            <div className="bg-surface-container-low p-4 rounded-lg my-4 border border-outline-variant/40 text-left">
              <p className="text-xs text-on-surface-variant">
                - Mech chassis integrity has dropped.
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                - Repair your active mech in the Garage Hangar.
              </p>
            </div>

            <button
              onClick={() => { playSynthBeep('select'); onExitBattle('garage'); }}
              className="w-full bg-error text-on-error font-bold py-3 uppercase rounded shadow-[0_0_15px_rgba(255,180,168,0.4)] cursor-pointer"
            >
              HANGAR PROTOCOL
            </button>
          </motion.div>
        )}
      </main>

      {/* COMBAT ACTUATORS FOOTER */}
      {battleState === 'fighting' && (
        <div className="fixed bottom-32 left-0 w-full z-40 px-6 flex justify-between items-end pointer-events-none">
          {/* DEFEND ACTUATOR */}
          <button
            onClick={handleDefend}
            className="pointer-events-auto actuator-btn w-24 h-24 md:w-32 md:h-32 bg-surface-container-highest border-l-4 border-b-4 border-secondary text-secondary chamfer-both flex flex-col items-center justify-center gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-secondary/10 active:bg-secondary active:text-on-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
            <span className="font-label-caps text-xs font-extrabold">DEFEND</span>
          </button>

          {/* ATTACK ACTUATOR */}
          <button
            onClick={handleAttack}
            className="pointer-events-auto actuator-btn w-24 h-24 md:w-32 md:h-32 bg-surface-container-highest border-r-4 border-b-4 border-primary-container text-primary-container chamfer-both flex flex-col items-center justify-center gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-primary-container/10 active:bg-primary-container active:text-on-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl md:text-5xl">
              {isDark ? 'swords' : 'bolt'}
            </span>
            <span className="font-label-caps text-xs font-extrabold">
              {isDark ? 'ATTACK' : 'ENERGY'}
            </span>
          </button>
        </div>
      )}

      {/* VIGNETTE ATMOSPHERIC PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]"></div>
        {/* Magic Glowing Sparks */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-primary rounded-full energy-pulse shadow-[0_0_8px_#ffb4a8]" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-secondary rounded-full energy-pulse shadow-[0_0_10px_#a6c8ff]" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-tertiary rounded-full energy-pulse shadow-[0_0_6px_#e9c400]" />
      </div>
    </div>
  );
}
