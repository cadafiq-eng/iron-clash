import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSynthBeep, INITIAL_MECHS, INITIAL_MISSIONS } from './gameData';
import { GameMode, Mech, Mission } from './types';
import HomeTab from './components/HomeTab';
import GarageTab from './components/GarageTab';
import ExploreTab from './components/ExploreTab';
import BattleEngineTab from './components/BattleEngineTab';

export default function App() {
  const loadSavedJson = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) as T : fallback;
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  };

  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'home' | 'garage' | 'explore' | 'battle'>('home');

  // Player state persisted in local storage
  const [pilotName, setPilotName] = useState<string>(() => {
    return localStorage.getItem('pilotName') || 'PILOT_X_01';
  });

  const [level, setLevel] = useState<number>(() => {
    return Number(localStorage.getItem('pilotLevel')) || 42;
  });

  const [xp, setXp] = useState<number>(() => {
    return Number(localStorage.getItem('pilotXp')) || 2450;
  });

  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('highScore')) || 42850;
  });

  const [selectedMechId, setSelectedMechId] = useState<string>(() => {
    return localStorage.getItem('selectedMechId') || 'red-leader';
  });

  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return localStorage.getItem('gameMode') === 'kids' ? 'kids' : 'adult';
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    return loadSavedJson('completedMissions', ['mission-01']);
  });

  // Dynamic mechs and custom modifications lists
  const [mechs, setMechs] = useState<Mech[]>(() => {
    return loadSavedJson('mechsState', INITIAL_MECHS);
  });

  // Keep track of equipped modifications for each mech
  const [equippedMods, setEquippedMods] = useState<Record<string, string[]>>(() => {
    const saved = loadSavedJson<Record<string, string[]> | null>('equippedModsState', null);
    if (saved) return saved;

    // Default mods
    const defaults: Record<string, string[]> = {};
    INITIAL_MECHS.forEach(m => {
      defaults[m.id] = m.equippedMods;
    });
    return defaults;
  });

  // Active mission state for the battle simulator
  const [activeMission, setActiveMission] = useState<Mission | null>(() => {
    return INITIAL_MISSIONS[1]; // default to mission-02 (IRON FORGE)
  });

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('pilotName', pilotName);
  }, [pilotName]);

  useEffect(() => {
    localStorage.setItem('pilotLevel', String(level));
  }, [level]);

  useEffect(() => {
    localStorage.setItem('pilotXp', String(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('highScore', String(highScore));
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('selectedMechId', selectedMechId);
  }, [selectedMechId]);

  useEffect(() => {
    localStorage.setItem('gameMode', gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  useEffect(() => {
    localStorage.setItem('mechsState', JSON.stringify(mechs));
  }, [mechs]);

  useEffect(() => {
    localStorage.setItem('equippedModsState', JSON.stringify(equippedMods));
  }, [equippedMods]);

  const activeMech = mechs.find(m => m.id === selectedMechId) || mechs[0];
  const activeMechWithMods = {
    ...activeMech,
    equippedMods: equippedMods[activeMech.id] || activeMech.equippedMods,
  };

  // Callback triggers for battle outcomes
  const handleBattleVictory = (xpEarned: number, finalScore: number) => {
    setXp(prev => {
      const nextXp = prev + xpEarned;
      if (nextXp >= 5000) {
        setLevel(lvl => lvl + 1);
        playSynthBeep('level-up');
        return nextXp - 5000;
      }
      return nextXp;
    });

    if (finalScore > highScore) {
      setHighScore(finalScore);
    }

    // Unlock and update completed missions list
    if (activeMission && !completedMissions.includes(activeMission.id)) {
      setCompletedMissions(prev => [...prev, activeMission.id]);
    }
  };

  const handleBattleDefeat = (damageTaken: number) => {
    setMechs(prev =>
      prev.map(m => {
        if (m.id === selectedMechId) {
          return {
            ...m,
            chassisIntegrity: Math.max(10, m.chassisIntegrity - damageTaken),
          };
        }
        return m;
      })
    );
  };

  const handleRepairMech = (mechId: string) => {
    setMechs(prev =>
      prev.map(m => {
        if (m.id === mechId) {
          return { ...m, chassisIntegrity: 100 };
        }
        return m;
      })
    );
  };

  const handleUpdateEquippedMods = (mechId: string, modIds: string[]) => {
    setEquippedMods(prev => ({
      ...prev,
      [mechId]: modIds,
    }));
  };

  const handleDeployMission = (mission: Mission) => {
    setActiveMission(mission);
    setActiveTab('battle');
  };

  const handleExitBattle = (destination: 'explore' | 'garage') => {
    setActiveTab(destination);
  };

  const handleResetProgress = () => {
    const confirmed = window.confirm('Reset all saved progress and start over?');
    if (!confirmed) return;

    const defaultEquippedMods: Record<string, string[]> = {};
    INITIAL_MECHS.forEach(m => {
      defaultEquippedMods[m.id] = m.equippedMods;
    });

    setPilotName('PILOT_X_01');
    setLevel(42);
    setXp(2450);
    setHighScore(42850);
    setSelectedMechId('red-leader');
    setGameMode('adult');
    setCompletedMissions(['mission-01']);
    setMechs(INITIAL_MECHS);
    setEquippedMods(defaultEquippedMods);
    setActiveMission(INITIAL_MISSIONS[1]);
    setActiveTab('home');
    playSynthBeep('level-up');
  };

  const handleTabChange = (tab: 'home' | 'garage' | 'explore' | 'battle') => {
    playSynthBeep('click');
    setActiveTab(tab);
  };

  return (
    <div className="relative min-h-screen bg-background text-on-background overflow-x-hidden font-sans">
      {/* GLOBAL TOP APP HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile py-2 bg-gradient-to-r from-surface-container via-surface-bright to-surface-container border-b-2 border-outline-variant shadow-[0_0_15px_rgba(230,33,23,0.3)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => playSynthBeep('click')}
            className="text-primary hover:text-tertiary transition-colors flex items-center cursor-pointer"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-display-lg text-lg md:text-2xl font-black italic uppercase tracking-tighter text-primary">
            IRON CLASH
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* LEVEL BAR & EXP */}
          <div className="flex flex-col items-end">
            <span className="font-label-caps text-[10px] md:text-xs text-tertiary font-bold">
              LVL {level}
            </span>
            <div className="w-20 md:w-28 h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-tertiary transition-all duration-500"
                style={{ width: `${(xp / 5000) * 100}%` }}
              ></div>
            </div>
            <span className="text-[8px] text-on-surface-variant font-mono">
              {xp}/5000 XP
            </span>
          </div>

          <button
            onClick={() => {
              playSynthBeep('click');
              alert('Settings interface unlocked! Current Version v1.4.2 [Production Active]');
            }}
            className="text-primary hover:text-tertiary transition-colors flex items-center cursor-pointer"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* RENDER ACTIVE TAB WITH DYNAMIC ROUTE TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-screen"
        >
          {activeTab === 'home' && (
            <HomeTab
              pilotName={pilotName}
              level={level}
              xp={xp}
              highScore={highScore}
              selectedMech={activeMechWithMods}
              gameMode={gameMode}
              onDeployBattle={() => setActiveTab('battle')}
              onNavTab={handleTabChange}
              onUpdatePilotName={setPilotName}
              onUpdateGameMode={setGameMode}
              onResetProgress={handleResetProgress}
            />
          )}

          {activeTab === 'garage' && (
            <GarageTab
              mechs={mechs}
              selectedMechId={selectedMechId}
              equippedMods={equippedMods}
              onSelectMech={setSelectedMechId}
              onUpdateEquippedMods={handleUpdateEquippedMods}
              onRepairMech={handleRepairMech}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreTab
              completedMissions={completedMissions}
              onDeployMission={handleDeployMission}
            />
          )}

          {activeTab === 'battle' && (
            <BattleEngineTab
              selectedMech={activeMechWithMods}
              activeMission={activeMission}
              pilotName={pilotName}
              gameMode={gameMode}
              onUpdateGameMode={setGameMode}
              onBattleVictory={handleBattleVictory}
              onBattleDefeat={handleBattleDefeat}
              onExitBattle={handleExitBattle}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* BOTTOM NAVIGATION SHELL BAR */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-highest border-t-4 border-primary-container shadow-[0_-4px_25px_rgba(0,0,0,0.6)] rounded-t-[2rem]">
        {/* HOME BUTTON */}
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-primary text-on-primary rounded-full px-5 py-2.5 shadow-[0_0_15px_#ffb4a8] scale-105'
              : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:text-tertiary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-wider font-bold">HOME</span>
        </button>

        {/* GARAGE BUTTON */}
        <button
          onClick={() => handleTabChange('garage')}
          className={`flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
            activeTab === 'garage'
              ? 'bg-primary text-on-primary rounded-full px-5 py-2.5 shadow-[0_0_15px_#ffb4a8] scale-105'
              : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:text-tertiary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'garage' ? "'FILL' 1" : "'FILL' 0" }}>
            build
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-wider font-bold">CRAFT</span>
        </button>

        {/* EXPLORE BUTTON */}
        <button
          onClick={() => handleTabChange('explore')}
          className={`flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
            activeTab === 'explore'
              ? 'bg-primary text-on-primary rounded-full px-5 py-2.5 shadow-[0_0_15px_#ffb4a8] scale-105'
              : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:text-tertiary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'explore' ? "'FILL' 1" : "'FILL' 0" }}>
            explore
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-wider font-bold">EXPLORE</span>
        </button>

        {/* BATTLE / LEADER BUTTON */}
        <button
          onClick={() => handleTabChange('battle')}
          className={`flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
            activeTab === 'battle'
              ? 'bg-primary text-on-primary rounded-full px-5 py-2.5 shadow-[0_0_15px_#ffb4a8] scale-105 animate-pulse'
              : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:text-tertiary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'battle' ? "'FILL' 1" : "'FILL' 0" }}>
            swords
          </span>
          <span className="font-label-caps text-[10px] mt-0.5 tracking-wider font-bold">BATTLE</span>
        </button>
      </nav>
    </div>
  );
}
