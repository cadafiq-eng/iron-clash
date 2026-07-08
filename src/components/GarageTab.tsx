import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSynthBeep, AVAILABLE_MODS, getCustomizedStats } from '../gameData';
import { Mech } from '../types';

interface GarageTabProps {
  mechs: Mech[];
  selectedMechId: string;
  equippedMods: Record<string, string[]>;
  onSelectMech: (id: string) => void;
  onUpdateEquippedMods: (mechId: string, modIds: string[]) => void;
  onRepairMech: (mechId: string) => void;
}

export default function GarageTab({
  mechs,
  selectedMechId,
  equippedMods,
  onSelectMech,
  onUpdateEquippedMods,
  onRepairMech,
}: GarageTabProps) {
  const [activeCustomizeId, setActiveCustomizeId] = useState<string | null>(null);

  // Find currently active customizing mech
  const customizingMech = mechs.find(m => m.id === activeCustomizeId);
  const selectedMech = mechs.find(m => m.id === selectedMechId) || mechs[0];

  // Handler for equipping/unequipping a mod
  const handleToggleMod = (modId: string) => {
    if (!activeCustomizeId) return;
    const currentEquipped = equippedMods[activeCustomizeId] || [];
    let updated: string[];

    if (currentEquipped.includes(modId)) {
      // Unequip
      updated = currentEquipped.filter(id => id !== modId);
      playSynthBeep('click');
    } else {
      // Equip if space is available
      const maxSlots = mechs.find(m => m.id === activeCustomizeId)?.maxModSlots || 5;
      if (currentEquipped.length >= maxSlots) {
        alert(`Maximum Modification Slots reached (${maxSlots})! Unequip another mod first.`);
        return;
      }
      updated = [...currentEquipped, modId];
      playSynthBeep('select');
    }

    onUpdateEquippedMods(activeCustomizeId, updated);
  };

  const handleRepair = (mechId: string) => {
    playSynthBeep('level-up');
    onRepairMech(mechId);
  };

  return (
    <div className="relative z-10 mt-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden pb-32">
      {/* Section Header */}
      <div className="relative py-6 mb-4 flex justify-between items-end">
        <div>
          <p className="font-label-caps text-xs text-secondary uppercase tracking-widest">Hangar 07</p>
          <h2 className="font-display-lg text-3xl md:text-4xl text-on-surface font-extrabold italic uppercase">
            GARAGE
          </h2>
        </div>
        <div className="hidden md:block">
          <div className="px-4 py-2 bg-surface-container border border-outline-variant chamfered-container">
            <span className="font-label-caps text-xs text-tertiary">SYNC STATUS: STABLE</span>
          </div>
        </div>
      </div>

      {/* Mech Selection Carousel */}
      <div className="relative flex overflow-x-auto carousel-scrollbar gap-6 pb-8 px-2 snap-x snap-mandatory">
        {mechs.map(mech => {
          const isActive = mech.id === selectedMechId;
          const currentMechMods = equippedMods[mech.id] || [];
          const customizedStats = getCustomizedStats(mech, currentMechMods);

          return (
            <div key={mech.id} className="flex-shrink-0 w-[290px] md:w-[330px] snap-center">
              <div
                className={`armor-card bg-surface-container-high border-2 p-4 flex flex-col gap-4 relative group transition-all duration-300 ${
                  isActive
                    ? 'border-primary-container shadow-[0_0_20px_rgba(255,180,168,0.4)]'
                    : 'border-outline-variant opacity-75 hover:opacity-100'
                }`}
              >
                <div className="absolute -top-2 -right-2 bg-primary-container text-on-primary-container px-3 py-1 font-label-caps text-[10px] rounded-full z-20 font-bold">
                  LVL {mech.level}
                </div>

                {/* Mech Portrait Area */}
                <div className="h-60 rounded-lg overflow-hidden bg-surface-dim metallic-gradient relative border border-outline-variant">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    alt={mech.name}
                    src={mech.image}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-background to-transparent">
                    <p className={`font-headline-sm text-lg uppercase ${mech.id === 'red-leader' ? 'text-primary' : mech.id === 'blue-defender' ? 'text-secondary' : 'text-tertiary'}`}>
                      {mech.name}
                    </p>
                  </div>
                </div>

                {/* Stats Bar Display */}
                <div className="flex flex-col gap-3">
                  {/* POWER STAT */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-label-caps text-[10px] tracking-wider mb-0.5">
                      <span className="text-on-surface-variant">POWER</span>
                      <span className={isActive ? 'text-primary' : 'text-on-surface'}>{customizedStats.power}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary progress-segment transition-all duration-300"
                        style={{ width: `${customizedStats.power}%`, color: '#ffb4a8' }}
                      />
                    </div>
                  </div>

                  {/* SPEED STAT */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-label-caps text-[10px] tracking-wider mb-0.5">
                      <span className="text-on-surface-variant">SPEED</span>
                      <span className={isActive ? 'text-primary' : 'text-on-surface'}>{customizedStats.speed}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary progress-segment transition-all duration-300"
                        style={{ width: `${customizedStats.speed}%`, color: '#ffb4a8' }}
                      />
                    </div>
                  </div>

                  {/* ARMOR STAT */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-label-caps text-[10px] tracking-wider mb-0.5">
                      <span className="text-on-surface-variant">ARMOR</span>
                      <span className={isActive ? 'text-primary' : 'text-on-surface'}>{customizedStats.armor}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary progress-segment transition-all duration-300"
                        style={{ width: `${customizedStats.armor}%`, color: '#ffb4a8' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Button */}
                {isActive ? (
                  <button
                    onClick={() => {
                      playSynthBeep('select');
                      setActiveCustomizeId(mech.id);
                    }}
                    className="actuator-btn w-full bg-primary text-on-primary font-headline-sm text-sm py-2.5 uppercase font-bold border-b-4 border-on-primary-fixed shadow-[0_0_15px_rgba(255,180,168,0.4)] hover:brightness-110 duration-150 cursor-pointer"
                  >
                    CUSTOMIZE MODS
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playSynthBeep('select');
                      onSelectMech(mech.id);
                    }}
                    className="actuator-btn w-full bg-surface-container text-on-surface-variant font-label-caps text-xs py-2.5 uppercase font-bold border-b-4 border-outline-variant hover:text-on-surface duration-150 cursor-pointer"
                  >
                    SELECT MECH
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech Stats Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* CHASSIS INTEGRITY Box */}
        <div className="chamfered-container bg-surface-container border border-outline-variant p-6 flex flex-col gap-2 relative group">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-xs text-primary font-bold">CHASSIS INTEGRITY</span>
            {selectedMech.chassisIntegrity < 100 && (
              <button
                onClick={() => handleRepair(selectedMech.id)}
                className="text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded hover:bg-primary/25 cursor-pointer"
              >
                REPAIR
              </button>
            )}
          </div>
          <span className="font-headline-md text-3xl font-bold">{selectedMech.chassisIntegrity}%</span>
          <div className="w-full h-1.5 bg-primary-container/20 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-primary-container"
              style={{ width: `${selectedMech.chassisIntegrity}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-on-surface-variant font-mono uppercase mt-1">
            Status: {selectedMech.chassisIntegrity === 100 ? 'OPTIMAL CONDITION' : 'STRUCTURAL DAMAGE DETECTED'}
          </p>
        </div>

        {/* CORE RESONANCE Box */}
        <div className="chamfered-container bg-surface-container border border-outline-variant p-6 flex flex-col gap-2">
          <span className="font-label-caps text-xs text-secondary font-bold">CORE RESONANCE</span>
          <span className="font-headline-md text-3xl text-secondary font-bold">STABLE</span>
          <div className="w-full h-1.5 bg-secondary-container/20 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-secondary w-3/4"></div>
          </div>
          <p className="text-[10px] text-on-surface-variant font-mono uppercase mt-1">
            Telemetry Uplink: Stable 42.4 GHz
          </p>
        </div>

        {/* MOD SLOTS Box */}
        <div className="chamfered-container bg-surface-container border border-outline-variant p-6 flex flex-col gap-2">
          <span className="font-label-caps text-xs text-tertiary font-bold">MOD SLOTS EQUIPPED</span>
          <span className="font-headline-md text-3xl font-bold text-tertiary">
            {(equippedMods[selectedMech.id] || []).length} / {selectedMech.maxModSlots}
          </span>
          {/* Diamond Icons representing mod slots */}
          <div className="flex gap-3 mt-1.5">
            {Array.from({ length: selectedMech.maxModSlots }).map((_, idx) => {
              const currentModsCount = (equippedMods[selectedMech.id] || []).length;
              const isFilled = idx < currentModsCount;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rotate-45 transition-all duration-300 ${
                    isFilled ? 'bg-tertiary shadow-[0_0_8px_#e9c400]' : 'border border-tertiary/40 bg-transparent'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Customize Mods Modal/Overlay */}
      <AnimatePresence>
        {activeCustomizeId && customizingMech && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container border-2 border-outline-variant w-full max-w-2xl p-6 rounded-xl shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  playSynthBeep('click');
                  setActiveCustomizeId(null);
                }}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="mb-6">
                <span className="font-label-caps text-xs text-primary uppercase">Active Customization Protocol</span>
                <h3 className="font-headline-md text-2xl text-on-surface font-extrabold italic uppercase">
                  {customizingMech.name} MODS
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Active slots: {(equippedMods[customizingMech.id] || []).length} / {customizingMech.maxModSlots}
                </p>
              </div>

              {/* Stats Preview showing before-and-after customizations */}
              <div className="grid grid-cols-3 gap-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant/50 mb-6">
                {['POWER', 'SPEED', 'ARMOR'].map(statName => {
                  const statLower = statName.toLowerCase() as 'power' | 'speed' | 'armor';
                  const baseVal = customizingMech[statLower];
                  const curMods = equippedMods[customizingMech.id] || [];
                  const customized = getCustomizedStats(customizingMech, curMods);
                  const difference = customized[statLower] - baseVal;

                  return (
                    <div key={statName} className="text-center">
                      <p className="text-[10px] text-on-surface-variant font-label-caps">{statName}</p>
                      <p className="text-xl font-bold font-mono text-on-surface">
                        {customized[statLower]}%
                      </p>
                      <p className={`text-[10px] font-mono ${difference > 0 ? 'text-primary' : difference < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
                        {difference > 0 ? `+${difference}` : difference < 0 ? `${difference}` : '0'} (Mod bias)
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* List of Available Mods */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {AVAILABLE_MODS.map(mod => {
                  const currentEquipped = equippedMods[customizingMech.id] || [];
                  const isEquipped = currentEquipped.includes(mod.id);

                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleToggleMod(mod.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                        isEquipped
                          ? 'border-tertiary bg-tertiary/10 shadow-[0_0_10px_rgba(233,196,0,0.15)]'
                          : 'border-outline-variant/60 bg-surface-container hover:border-outline'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${isEquipped ? 'bg-tertiary/20 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined">{mod.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{mod.name}</p>
                          <p className="text-xs text-on-surface-variant">{mod.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEquipped ? (
                          <span className="text-xs text-tertiary font-bold font-mono bg-tertiary/15 px-2 py-1 rounded">
                            EQUIPPED
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface-variant group-hover:text-on-surface font-mono bg-surface-container-high px-2 py-1 rounded">
                            EQUIP
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant flex justify-end">
                <button
                  onClick={() => {
                    playSynthBeep('click');
                    setActiveCustomizeId(null);
                  }}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-sm uppercase cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
