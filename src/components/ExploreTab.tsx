import React, { useMemo, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { playSynthBeep, INITIAL_MISSIONS } from '../gameData';
import { Mission } from '../types';

interface ExploreTabProps {
  completedMissions: string[];
  onDeployMission: (mission: Mission) => void;
}

export default function ExploreTab({ completedMissions, onDeployMission }: ExploreTabProps) {
  const missions = useMemo<Mission[]>(() => {
    return INITIAL_MISSIONS.map((m, index) => ({
      ...m,
      isCompleted: completedMissions.includes(m.id) || m.id === 'mission-01',
      locked: index > 1 && !completedMissions.includes(INITIAL_MISSIONS[index - 1].id),
    }));
  }, [completedMissions]);

  const [selectedMissionId, setSelectedMissionId] = useState<string>('mission-02');
  const selectedMission = missions.find(m => m.id === selectedMissionId) || missions[1];

  // Map panning/tilting effect variables
  const [rotationX, setRotationX] = useState<number>(20);
  const [rotationZ, setRotationZ] = useState<number>(-5);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - startX.current) * 0.05;
    const dy = (e.clientY - startY.current) * 0.05;
    setRotationX(prev => Math.min(35, Math.max(5, prev + dy)));
    setRotationZ(prev => Math.min(15, Math.max(-25, prev + dx)));
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleSelectMission = (id: string) => {
    playSynthBeep('click');
    setSelectedMissionId(id);
  };

  const handleDeployClick = () => {
    if (selectedMission.locked) {
      alert('This Sector Mission is currently LOCKED! Complete previous active sector missions first.');
      return;
    }
    playSynthBeep('select');
    onDeployMission(selectedMission);
  };

  // Determine theme color of active sector
  const isAdventureZone = selectedMission.id === 'mission-01';
  const themeAccentColor = isAdventureZone ? 'text-tertiary border-tertiary' : 'text-primary border-primary';
  const buttonBg = isAdventureZone ? 'bg-tertiary text-on-tertiary' : 'bg-primary-container text-on-primary-container';

  return (
    <div
      className="relative w-full h-screen pt-20 pb-24 overflow-hidden mission-map-container select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Scanline Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="scan-line absolute inset-0 w-full h-full opacity-20"></div>

        {/* Sector Name Indicator */}
        <div className={`absolute top-24 left-4 md:left-8 p-4 border-l-2 bg-[#1a0a08]/75 backdrop-blur-md chamfered transition-all duration-300 ${themeAccentColor}`}>
          <p className="font-label-caps text-xs tracking-wider uppercase">
            SECTOR: {selectedMission.sectorName}
          </p>
          <p className="text-[10px] text-on-surface-variant uppercase font-mono mt-0.5">
            Interference: {selectedMission.isCompleted ? '0.00% (SECURE)' : '0.42% (THREAT DETECTED)'}
          </p>
        </div>

        {/* Satellite Signal Status indicator */}
        <div className="absolute bottom-28 left-4 md:left-8">
          <div className="flex items-center gap-2 text-on-surface-variant/80 font-mono text-[10px] bg-background/60 backdrop-blur-md px-3 py-1 border border-outline-variant/30 rounded">
            <span className="w-2 h-2 bg-primary-container animate-pulse rounded-full"></span>
            UPLINK: {selectedMission.locked ? 'DISCONNECTED' : 'ESTABLISHED'}
          </div>
        </div>
      </div>

      {/* 3D Map Rendering Frame */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-75 ease-out scale-100 md:scale-105"
        style={{
          transform: `rotateX(${rotationX}deg) rotateZ(${rotationZ}deg) scale(1.05)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative w-[1100px] h-[750px] bg-surface-container-low rounded-[80px] overflow-hidden border border-outline-variant shadow-2xl transition-all duration-500">
          {/* Futuristic Isometric schematic background */}
          <div className="absolute inset-0 grayscale opacity-30 mix-blend-overlay pointer-events-none">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjj7zXH31dymkIyEbb5rvFKFOAWjWuDa5NGKIlXB44A74CGnHVoV0Gx6e0ji3xxLDX8dsN92KeYsG1y6crzj6698Gt0k8XNTHfic5vfbH5PXSH7TI5SQks-ON0saqx-MqvIYg38BlmCy2nK6eiOddTu3i2RxSXZ5QnLjR1LQM7RpNxD0IrhA8ntY5TXknYbHoOCHowo2iGX9fVN28yAYXnZrXqZb0tQo8ITfm4UYWuVz_z1irIPBENAw')`,
              }}
            />
          </div>

          {/* Connected SVG lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 800">
            {/* Level 1 -> 2 */}
            <path
              className="opacity-70 transition-all"
              d="M 220 420 L 400 320"
              fill="none"
              stroke={missions[0].isCompleted ? '#e9c400' : '#5e3f3b'}
              strokeWidth="4"
            />
            {/* Level 2 -> 3 */}
            <path
              className="node-line opacity-60"
              d="M 400 320 L 650 480"
              fill="none"
              stroke={missions[1].isCompleted ? '#ffb4a8' : '#5e3f3b'}
              strokeWidth="4"
              strokeDasharray="10"
            />
            {/* Level 3 -> 4 */}
            <path d="M 650 480 L 850 280" fill="none" stroke="#5e3f3b" strokeWidth="4" />
            {/* Level 4 -> 5 */}
            <path d="M 850 280 L 1050 520" fill="none" stroke="#5e3f3b" strokeWidth="4" />
          </svg>

          {/* Interactive Mission Nodes */}
          {missions.map(mission => {
            const isSelected = selectedMission.id === mission.id;
            let nodeIcon = 'lock';
            let statusLabel = mission.statusText;

            if (mission.id === 'mission-01') {
              nodeIcon = 'check_circle';
              statusLabel = 'COMPLETED';
            } else if (mission.id === 'mission-02') {
              nodeIcon = 'location_searching';
              statusLabel = 'ACTIVE';
            } else if (mission.id === 'mission-05') {
              nodeIcon = 'skull';
              statusLabel = 'BOSS';
            } else {
              nodeIcon = 'lock';
              statusLabel = 'LOCKED';
            }

            // Adjust actual coordinates slightly to fit nicely inside container
            const coordsMap: Record<string, { top: number; left: number }> = {
              'mission-01': { top: 420, left: 220 },
              'mission-02': { top: 320, left: 400 },
              'mission-03': { top: 480, left: 650 },
              'mission-04': { top: 280, left: 850 },
              'mission-05': { top: 520, left: 1050 },
            };
            const pos = coordsMap[mission.id];

            return (
              <button
                key={mission.id}
                onClick={() => handleSelectMission(mission.id)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 active:scale-95 cursor-pointer"
                style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
              >
                <div className="relative">
                  {/* Outer Pulsing Glow */}
                  {isSelected && (
                    <div className={`absolute -inset-4 rounded-full blur-md opacity-70 animate-ping ${mission.id === 'mission-01' ? 'bg-tertiary' : 'bg-primary-container'}`} />
                  )}

                  {/* Hexagon Shape Button */}
                  <div
                    className={`w-16 h-16 hex-shape flex items-center justify-center shadow-lg transition-transform duration-300 ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container scale-110'
                        : mission.isCompleted
                        ? 'bg-tertiary text-on-tertiary'
                        : 'bg-surface-variant text-on-surface-variant border border-outline-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {nodeIcon}
                    </span>
                  </div>

                  {/* Status Indicator Tag */}
                  <div
                    className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-0.5 chamfered border text-[9px] font-bold font-label-caps whitespace-nowrap shadow-sm ${
                      isSelected
                        ? 'bg-primary border-primary-container text-on-primary-container'
                        : mission.isCompleted
                        ? 'bg-tertiary/20 border-tertiary/40 text-tertiary'
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                    }`}
                  >
                    {statusLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Mission Card (HUD) */}
      <div className="absolute top-36 md:top-32 right-4 md:right-8 w-64 z-25 chamfered bg-surface-container/90 backdrop-blur-md border border-outline-variant p-4 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`font-headline-sm text-base uppercase font-extrabold ${isAdventureZone ? 'text-tertiary' : 'text-primary'}`}>
              {selectedMission.name}
            </h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              {selectedMission.id === 'mission-01' ? 'FUN LEVEL: HIGH' : `DIFFICULTY: ${selectedMission.difficulty}`}
            </p>
          </div>
          <span className={`material-symbols-outlined ${isAdventureZone ? 'text-tertiary' : 'text-primary'}`}>
            {selectedMission.id === 'mission-01' ? 'auto_awesome' : 'warning'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-[11px] font-label-caps">
            <span className="text-on-surface-variant">SECTOR PROGRESS</span>
            <span className={isAdventureZone ? 'text-tertiary' : 'text-primary'}>
              {selectedMission.isCompleted ? '3 / 3' : '0 / 3'}
            </span>
          </div>

          <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isAdventureZone ? 'bg-tertiary' : 'bg-primary-container'}`}
              style={{ width: selectedMission.isCompleted ? '100%' : '0%' }}
            />
          </div>

          {/* List of Objectives */}
          <div className="py-2 border-y border-outline-variant/30">
            <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-label-caps mb-1">Sector Objectives</p>
            <div className="space-y-1">
              {selectedMission.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-on-surface">
                  <span className={`material-symbols-outlined text-xs ${selectedMission.isCompleted ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                    {selectedMission.isCompleted ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className="truncate">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-surface-variant/50 p-2 rounded-sm border border-outline-variant">
              <p className="text-[8px] text-on-surface-variant uppercase">XP REWARD</p>
              <p className="text-tertiary font-bold font-mono">+{selectedMission.xpReward}</p>
            </div>
            <div className="bg-surface-variant/50 p-2 rounded-sm border border-outline-variant">
              <p className="text-[8px] text-on-surface-variant uppercase">RESOURCES</p>
              <p className="text-secondary font-bold font-mono">{selectedMission.scrapReward}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating GO Deploy Button */}
      <div className="absolute bottom-28 right-4 md:right-8 z-30">
        <button
          onClick={handleDeployClick}
          className={`group flex items-center gap-4 px-6 py-4 md:px-8 md:py-6 chamfered shadow-2xl border-b-4 border-on-tertiary-fixed-variant active:translate-y-1 active:border-b-0 transition-all duration-75 cursor-pointer ${buttonBg}`}
        >
          <div className="flex flex-col items-start leading-none text-left">
            <span className="font-label-caps text-[10px] md:text-[11px] opacity-80 tracking-widest">DEPLOY TO</span>
            <span className="font-display-lg text-lg md:text-xl font-extrabold italic uppercase">
              {selectedMission.name}
            </span>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className={`material-symbols-outlined text-xl md:text-2xl ${isAdventureZone ? 'text-tertiary' : 'text-primary'}`}>
              {selectedMission.isCompleted ? 'replay' : 'play_arrow'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
