import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Table, 
  Play, 
  Volume2, 
  VolumeX, 
  LogIn, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Info,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { api } from './api';

export default function App() {
  // Navigation & Auth
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // App State
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [maxWeeks, setMaxWeeks] = useState(34);
  const [standings, setStandings] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // View specific state
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [simLogs, setSimLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [champModalOpen, setChampModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  // Team Management Form State
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    shortName: '',
    foundingYear: 2026,
    primaryColor: '#10b981',
    logoUrl: '',
    power: 75,
    manager: '',
    stadium: '',
    capacity: ''
  });

  // Sound Engine Helper
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch(e) {
      // Audio support check
    }
  };

  // Load Initial Data
  const loadData = async () => {
    try {
      const allTeams = await api.getTeams();
      const curWeek = await api.getCurrentWeek();
      const maxW = await api.getMaxWeek();
      const curStandings = await api.getStandings();
      const curScorers = await api.getScorers();
      const allMatches = await api.getFixtures();

      setTeams(allTeams);
      setCurrentWeek(curWeek);
      setMaxWeeks(maxW);
      setStandings(curStandings);
      setScorers(curScorers);
      setFixtures(allMatches);

      // Default selected week to currentWeek if valid
      if (curWeek > 0 && curWeek <= maxW) {
        setSelectedWeek(curWeek);
      } else if (curWeek > maxW) {
        setSelectedWeek(maxW);
      }
    } catch (err) {
      console.error("Failed loading data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Watch for Championship condition
  useEffect(() => {
    // If we've played all matches, trigger championship modal
    if (fixtures.length > 0 && fixtures.every(m => m.played)) {
      setChampModalOpen(true);
    }
  }, [fixtures]);

  // Auth Handling
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.login(loginUsername, loginPassword);
      if (res.success) {
        setIsAdmin(true);
        setLoginModalOpen(false);
        setLoginUsername('');
        setLoginPassword('');
        playClick();
      }
    } catch (err) {
      setLoginError(err.message || 'Hatalı şifre veya kullanıcı adı.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    playClick();
  };

  // Team CRUD Handling
  const handleTeamFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      if (isEditingTeam) {
        await api.updateTeam(editingTeamId, teamForm);
      } else {
        await api.createTeam(teamForm);
      }
      setIsEditingTeam(false);
      setEditingTeamId(null);
      setTeamModalOpen(false);
      resetTeamForm();
      await loadData();
      playClick();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: '',
      shortName: '',
      foundingYear: 2026,
      primaryColor: '#10b981',
      logoUrl: '',
      power: 75,
      manager: '',
      stadium: '',
      capacity: ''
    });
  };

  const handleEditTeam = (team) => {
    setIsEditingTeam(true);
    setEditingTeamId(team.id);
    setTeamForm({
      name: team.name,
      shortName: team.shortName,
      foundingYear: team.foundingYear,
      primaryColor: team.primaryColor,
      logoUrl: team.logoUrl || '',
      power: team.power,
      manager: team.manager,
      stadium: team.stadium,
      capacity: team.capacity
    });
    setTeamModalOpen(true);
    playClick();
  };

  const handleDeleteTeam = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Bu takımı silmek istediğinize emin misiniz? Fikstürler sıfırlanacaktır.")) {
      try {
        await api.deleteTeam(id);
        await loadData();
        playClick();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Simulation Controls
  const handleSimulateWeek = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    playClick();
    try {
      const res = await api.simulateWeek(currentWeek);
      
      const matchLogs = res.results.map(m => `⚽ ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}`);
      setSimLogs(prev => [...matchLogs, ...prev]);

      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateRemaining = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    playClick();
    try {
      const res = await api.simulateRemaining();
      
      const matchLogs = res.results.map(m => `⚡ [Hafta ${res.week}] ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}`);
      setSimLogs(prev => [...matchLogs, ...prev]);

      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSeason = async () => {
    if (window.confirm("Tüm sezonu ve gol istatistiklerini sıfırlamak istiyor musunuz?")) {
      try {
        await api.resetSeason();
        setSimLogs([]);
        setChampModalOpen(false);
        await loadData();
        playClick();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Standings / Stats helpers
  const getPlayedMatches = () => fixtures.filter(m => m.played);
  const getUnplayedMatches = () => fixtures.filter(m => !m.played);
  
  const getRecentResults = () => {
    return getPlayedMatches()
      .slice(-6)
      .reverse();
  };

  const getUpcomingMatches = () => {
    return getUnplayedMatches()
      .filter(m => m.weekNumber === currentWeek)
      .slice(0, 6);
  };

  const getLeaderTeam = () => {
    if (standings.length === 0) return null;
    const leaderRow = standings[0];
    return teams.find(t => t.id === leaderRow.teamId) || null;
  };

  const getMoraleColor = (morale) => {
    if (morale >= 70) return 'bg-emerald-500 shadow-emerald-400/50';
    if (morale >= 40) return 'bg-yellow-500 shadow-yellow-400/50';
    return 'bg-rose-500 shadow-rose-400/50';
  };

  const getTeamLogo = (team, size = "w-8 h-8 text-xs") => {
    if (!team) return null;
    
    // High-performance developer-friendly SVG crests from football-data.org (bypasses CORS/hotlink restrictions)
    const FALLBACK_LOGOS = {
      'RM': 'https://crests.football-data.org/86.svg',
      'BAR': 'https://crests.football-data.org/81.svg',
      'ATM': 'https://crests.football-data.org/78.svg',
      'GIR': 'https://crests.football-data.org/298.svg',
      'ATH': 'https://crests.football-data.org/77.svg',
      'VIL': 'https://crests.football-data.org/94.svg',
      'RSO': 'https://crests.football-data.org/92.svg',
      'BET': 'https://crests.football-data.org/90.svg',
      'LPA': 'https://crests.football-data.org/275.svg',
      'RAY': 'https://crests.football-data.org/87.svg',
      'OSA': 'https://crests.football-data.org/79.svg',
      'SEV': 'https://crests.football-data.org/559.svg',
      'CEL': 'https://crests.football-data.org/558.svg',
      'GET': 'https://crests.football-data.org/82.svg',
      'VAL': 'https://crests.football-data.org/95.svg',
      'MAL': 'https://crests.football-data.org/89.svg',
      'CAD': 'https://crests.football-data.org/264.svg',
      'GRA': 'https://crests.football-data.org/84.svg'
    };

    const logoUrl = (team.logoUrl && team.logoUrl.trim().length > 0)
      ? team.logoUrl
      : (FALLBACK_LOGOS[team.shortName?.toUpperCase()] || "");

    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt={team.name} 
          className={`${size} rounded-full object-contain p-0.5 bg-white border border-slate-200 shadow-sm`}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }

    // fallback CSS logo
    return (
      <div 
        className={`${size} rounded-full font-bold flex items-center justify-center text-white border select-none ${team.logoColor || 'bg-slate-700 border-slate-500'}`}
        style={{ backgroundColor: team.primaryColor }}
      >
        {team.shortName}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex overflow-hidden font-sans bg-slate-50">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-950 text-slate-100 flex-shrink-0 flex flex-col h-full border-r border-slate-800">
        
        {/* Logo / Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 rounded-xl shadow-btn shadow-emerald-500/20 text-slate-950 animate-pulse-glow">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                LEAGUE SIM
              </span>
              <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                Football League Simulator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Anasayfa', icon: Sparkles },
            { id: 'teams', label: 'Takım Yönetimi', icon: Users },
            { id: 'fixtures', label: 'Fikstürler', icon: Calendar },
            { id: 'standings', label: 'Puan Durumu', icon: Table },
            { id: 'simulation', label: 'Simülasyon Merkezi', icon: Play }
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); playClick(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  active 
                    ? 'bg-emerald-500 text-slate-950 shadow-btn shadow-emerald-500/10 font-semibold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-100'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/80 space-y-3">
          
          {/* Sound Controls */}
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900/40 rounded-lg border border-slate-800/60 text-xs">
            <span className="text-slate-400">Ses Efektleri</span>
            <button 
              onClick={() => { setSoundEnabled(!soundEnabled); playClick(); }}
              className={`p-1.5 rounded ${soundEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Admin / Login Block */}
          {isAdmin ? (
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-400">Yönetici Modu</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors duration-150"
              >
                <LogOut className="w-3.5 h-3.5" />
                Çıkış Yap
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setLoginModalOpen(true); playClick(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition-all duration-150 shadow-btn shadow-emerald-500/10"
            >
              <LogIn className="w-3.5 h-3.5" />
              Yönetici Girişi
            </button>
          )}

          <div className="text-center text-[10px] text-slate-600">
            LigaSim Pro v2.0 &copy; 2026
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        
        {/* Main Content Header */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
              {activeTab === 'dashboard' && 'Genel Bakış'}
              {activeTab === 'teams' && 'Takım Yönetimi'}
              {activeTab === 'fixtures' && 'Sezon Fikstürleri'}
              {activeTab === 'standings' && 'Puan Tablosu'}
              {activeTab === 'simulation' && 'Simülasyon Kontrol Merkezi'}
            </h1>
            
            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hafta {currentWeek} / {maxWeeks}</span>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetSeason}
              className="px-4 py-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition-all duration-150"
            >
              Yeni Sezon Başlat
            </button>
            <button
              disabled={isSimulating || (fixtures.length > 0 && fixtures.every(m => m.played))}
              onClick={handleSimulateWeek}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-btn shadow-emerald-500/10 transition-all duration-150"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isSimulating ? 'Simüle Ediliyor...' : 'Haftayı Simüle Et'}
            </button>
          </div>
        </header>

        {/* ================= VIEW AREA ================= */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Row 1 Grid: Son Maç Sonuçları on left, Yaklaşan Maçlar on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Son Maç Sonuçları */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Son Maç Sonuçları
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Son Oynananlar
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {getRecentResults().length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs">
                        <span>Henüz hiçbir maç oynanmadı.</span>
                        <span className="text-[10px] mt-0.5 text-slate-400/80">Haftayı simüle ederek başlayın!</span>
                      </div>
                    ) : (
                      getRecentResults().map(match => (
                        <div key={match.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200/80 transition-all duration-150 text-sm">
                          <div className="flex items-center gap-3 w-5/12">
                            {getTeamLogo({ shortName: match.homeTeamShortName, logoColor: match.homeLogoColor, logoUrl: match.homeLogoUrl }, "w-6 h-6 text-[10px]")}
                            <span className="font-semibold text-slate-700 truncate">{match.homeTeamName}</span>
                          </div>
                          
                          <div className="w-2/12 flex justify-center">
                            <span className="px-2.5 py-1 bg-slate-950 text-white font-mono font-bold rounded-lg text-xs tracking-wider">
                              {match.homeScore} - {match.awayScore}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 w-5/12 justify-end">
                            <span className="font-semibold text-slate-700 truncate">{match.awayTeamName}</span>
                            {getTeamLogo({ shortName: match.awayTeamShortName, logoColor: match.awayLogoColor, logoUrl: match.awayLogoUrl }, "w-6 h-6 text-[10px]")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Yaklaşan Maçlar */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      Yaklaşan Maçlar (Hafta {currentWeek})
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Gelecek Program
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {getUpcomingMatches().length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs">
                        <span>Sezon tamamlandı veya yaklaşan fikstür bulunamadı.</span>
                      </div>
                    ) : (
                      getUpcomingMatches().map(match => (
                        <div key={match.id} className="flex items-center justify-between p-3 bg-slate-50/60 rounded-xl border border-slate-100/80 hover:border-slate-200/60 transition-all duration-150 text-sm">
                          <div className="flex items-center gap-3 w-5/12">
                            {getTeamLogo({ shortName: match.homeTeamShortName, logoColor: match.homeLogoColor, logoUrl: match.homeLogoUrl }, "w-6 h-6 text-[10px]")}
                            <span className="font-medium text-slate-700 truncate">{match.homeTeamName}</span>
                          </div>
                          
                          <div className="w-2/12 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-lg py-0.5 px-1 shadow-sm">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{match.matchDate}</span>
                            <span className="text-[10px] font-semibold text-slate-700">{match.matchTime}</span>
                          </div>

                          <div className="flex items-center gap-3 w-5/12 justify-end">
                            <span className="font-medium text-slate-700 truncate">{match.awayTeamName}</span>
                            {getTeamLogo({ shortName: match.awayTeamShortName, logoColor: match.awayLogoColor, logoUrl: match.awayLogoUrl }, "w-6 h-6 text-[10px]")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2 Grid: Standings Table on left, Lider Takım & Gol Krallığı on right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Puan Durumu (Takes 2 columns in lg) */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Puan Durumu
                    </h3>
                    <button 
                      onClick={() => { setActiveTab('standings'); playClick(); }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                    >
                      Tüm Tabloyu Gör <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                          <th className="py-2.5 px-3 text-center">Sıra</th>
                          <th className="py-2.5 px-3">Takım</th>
                          <th className="py-2.5 px-3 text-center">O</th>
                          <th className="py-2.5 px-3 text-center">G</th>
                          <th className="py-2.5 px-3 text-center">B</th>
                          <th className="py-2.5 px-3 text-center">M</th>
                          <th className="py-2.5 px-3 text-center">A</th>
                          <th className="py-2.5 px-3 text-center">Y</th>
                          <th className="py-2.5 px-3 text-center">AV</th>
                          <th className="py-2.5 px-3 text-center font-bold text-slate-950">P</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {standings.slice(0, 10).map((row, index) => {
                          const isLeader = index === 0;
                          const isRelegation = index >= (standings.length - 3) && standings.length >= 4;
                          
                          let rankStyle = "bg-slate-100 text-slate-600";
                          if (index === 0) rankStyle = "bg-yellow-500 text-slate-950 font-bold";
                          else if (index === 1) rankStyle = "bg-slate-300 text-slate-900 font-bold";
                          else if (index === 2) rankStyle = "bg-amber-600 text-white font-bold";
                          else if (isRelegation) rankStyle = "bg-rose-100 text-rose-700 font-semibold";

                          return (
                            <tr key={row.teamId} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2 px-3 text-center">
                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${rankStyle}`}>
                                  {row.rank}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-semibold text-slate-800">
                                <div className="flex items-center gap-2">
                                  {getTeamLogo(row, "w-5 h-5 text-[9px]")}
                                  <span className="truncate max-w-[130px]">{row.teamName}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center font-medium text-slate-600">{row.played}</td>
                              <td className="py-2 px-3 text-center font-medium text-emerald-600 bg-emerald-50/20">{row.won}</td>
                              <td className="py-2 px-3 text-center font-medium text-amber-600 bg-amber-50/20">{row.drawn}</td>
                              <td className="py-2 px-3 text-center font-medium text-rose-600 bg-rose-50/20">{row.lost}</td>
                              <td className="py-2 px-3 text-center text-slate-500">{row.goalsFor}</td>
                              <td className="py-2 px-3 text-center text-slate-500">{row.goalsAgainst}</td>
                              <td className={`py-2 px-3 text-center font-medium ${row.goalDiff >= 0 ? 'text-slate-600' : 'text-rose-600'}`}>
                                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                              </td>
                              <td className="py-2 px-3 text-center font-extrabold text-slate-900 bg-slate-50/50">{row.points}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right side: Lider Takım Card & Gol Krallığı Table */}
                <div className="space-y-6 flex flex-col">
                  
                  {/* Lider Takım */}
                  {getLeaderTeam() && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border border-slate-800 rounded-2xl p-5 text-white shadow-lg">
                      
                      {/* Decorative elements */}
                      <div className="absolute right-0 top-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl"></div>
                      <div className="absolute right-3 top-3 text-yellow-500/30">
                        <Award className="w-16 h-16 stroke-[1.2]" />
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        Lider Takım
                      </span>

                      <div className="flex items-start gap-4">
                        {getTeamLogo(getLeaderTeam(), "w-14 h-14 text-lg border-2 border-slate-700/80 shadow-md")}
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold tracking-tight">{getLeaderTeam().name}</h4>
                          <p className="text-xs text-emerald-400 font-medium">Teknik Direktör: {getLeaderTeam().manager}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{getLeaderTeam().stadium} ({getLeaderTeam().foundingYear} Kuruluş)</p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 text-center border-t border-slate-800/80 pt-4 text-xs">
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Galibiyet</span>
                          <span className="font-extrabold text-base text-emerald-400">{standings[0]?.won}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Averaj</span>
                          <span className="font-extrabold text-base text-slate-200">
                            {standings[0]?.goalDiff > 0 ? `+${standings[0]?.goalDiff}` : standings[0]?.goalDiff}
                          </span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Puan</span>
                          <span className="font-extrabold text-base text-yellow-400">{standings[0]?.points}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gol Krallığı */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Gol Krallığı
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LFP Pichichi</span>
                    </div>

                    <div className="overflow-y-auto max-h-[220px] flex-1 pr-1">
                      {scorers.length === 0 ? (
                        <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs">
                          <span>Henüz gol kaydedilmedi.</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {scorers.slice(0, 5).map((player, index) => (
                            <div key={player.name} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors text-xs">
                              <div className="flex items-center gap-3">
                                <span className={`font-bold text-[11px] ${index === 0 ? 'text-yellow-600' : 'text-slate-400'}`}>
                                  #{index + 1}
                                </span>
                                <div>
                                  <div className="font-bold text-slate-800">{player.name}</div>
                                  <div className="text-[10px] text-slate-500 font-semibold">{player.teamName}</div>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                                {player.goals} Gol
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* 2. TEAMS MANAGEMENT VIEW (CRUD) */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              
              {/* Top bar with Takım Ekle button or admin notice */}
              {isAdmin ? (
                <div className="flex items-center justify-between">
                  <div />
                  <button
                    onClick={() => { setIsEditingTeam(false); resetTeamForm(); setTeamModalOpen(true); playClick(); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all duration-150 shadow-btn shadow-emerald-500/10"
                  >
                    <Plus className="w-4 h-4" />
                    Takım Ekle
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-emerald-800 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold block mb-0.5 text-emerald-950">Yönetici Yetkisi Gerekli</span>
                      Yeni takımlar eklemek, mevcut takımları düzenlemek veya silmek için sol alttaki <strong>Yönetici Girişi</strong> butonundan oturum açabilirsiniz (admin / admin123).
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsAdmin(true); playClick(); }}
                    className="flex-shrink-0 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl shadow-btn shadow-emerald-500/10 transition-all duration-150 flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Hızlı Oturum Aç
                  </button>
                </div>
              )}

              {/* Team list */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Takımlar Listesi ({teams.length})</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LaLiga Ekipleri</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map(team => (
                    <div key={team.id} className="relative overflow-hidden border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white rounded-2xl p-4 transition-all duration-200 hover:shadow-soft flex flex-col justify-between space-y-4">
                      
                      {/* Top section */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getTeamLogo(team, "w-10 h-10 text-sm border shadow-sm")}
                          <div>
                            <h4 className="font-bold text-slate-900 leading-tight">{team.name}</h4>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{team.shortName}</span>
                          </div>
                        </div>

                        {/* Morale and edit button row */}
                        <div className="flex items-center gap-2">
                          {/* Morale Dot */}
                          <div className="flex items-center gap-1.5 bg-white border border-slate-150 py-1 px-2 rounded-lg text-[9px] font-bold text-slate-500 shadow-sm">
                            <span className={`w-2 h-2 rounded-full ${getMoraleColor(team.morale)}`}></span>
                            <span>{team.morale}% Moral</span>
                          </div>
                        </div>
                      </div>

                      {/* Mid details */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold border-t border-slate-100/80 pt-3">
                        <div>
                          <span className="block text-[8px] text-slate-400 font-medium uppercase">Teknik Direktör</span>
                          <span className="text-slate-700 truncate block">{team.manager || 'Belirtilmedi'}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-medium uppercase">Stadyum</span>
                          <span className="text-slate-700 truncate block">{team.stadium || 'Belirtilmedi'}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-medium uppercase">Kapasite</span>
                          <span className="text-slate-700 block">{team.capacity || 'Belirtilmedi'}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-400 font-medium uppercase">Güç</span>
                          <span className="text-emerald-600 font-bold block">{team.power} / 100</span>
                        </div>
                      </div>

                      {/* Admin CRUD actions */}
                      {isAdmin && (
                        <div className="flex justify-end gap-1.5 border-t border-slate-100 pt-3 flex-shrink-0">
                          <button
                            onClick={() => handleEditTeam(team)}
                            className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="p-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3. FIXTURES VIEW */}
          {activeTab === 'fixtures' && (
            <div className="space-y-6">
              
              {/* Week selector */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">Haftalık Fikstür Gözlemcisi</h3>
                  <p className="text-xs text-slate-500">Sezonun tüm haftalarını inceleyin ve simülasyon takvimini görün.</p>
                </div>

                {/* Week selector wheels */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full md:max-w-[450px]">
                  {Array.from({ length: maxWeeks }, (_, i) => i + 1).map(week => {
                    const isCurrent = currentWeek === week;
                    const isSelected = selectedWeek === week;

                    let btnStyle = "border-slate-200 text-slate-600 hover:bg-slate-50";
                    if (isSelected) btnStyle = "bg-slate-900 border-slate-900 text-white font-bold shadow-md";
                    else if (isCurrent) btnStyle = "border-emerald-400 bg-emerald-50 text-emerald-700 font-bold";

                    return (
                      <button
                        key={week}
                        onClick={() => { setSelectedWeek(week); playClick(); }}
                        className={`px-3 py-1.5 border rounded-lg text-xs transition-all flex-shrink-0 ${btnStyle}`}
                      >
                        H{week}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Match list */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 uppercase tracking-tight block">
                      {selectedWeek}. Hafta Fikstürleri
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {fixtures.filter(m => m.weekNumber === selectedWeek && m.played).length} / {fixtures.filter(m => m.weekNumber === selectedWeek).length} Tamamlandı
                    </span>
                  </div>
                  
                  {selectedWeek === currentWeek && fixtures.some(m => m.weekNumber === currentWeek && !m.played) && (
                    <button
                      disabled={isSimulating}
                      onClick={handleSimulateWeek}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs shadow-btn shadow-emerald-500/10 transition-all duration-150"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Bu Haftayı Oynat
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixtures.filter(m => m.weekNumber === selectedWeek).map(match => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-slate-50/60 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-white transition-all duration-150">
                      
                      {/* Home */}
                      <div className="flex items-center gap-3 w-5/12">
                        {getTeamLogo({ shortName: match.homeTeamShortName, logoColor: match.homeLogoColor, logoUrl: match.homeLogoUrl }, "w-8 h-8 text-xs border shadow-sm")}
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block truncate">{match.homeTeamName}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{match.homeTeamShortName}</span>
                        </div>
                      </div>

                      {/* Score or time/date details */}
                      <div className="w-2/12 flex flex-col items-center justify-center">
                        {match.played ? (
                           <span className="px-3 py-1.5 bg-slate-950 text-white font-mono font-extrabold rounded-xl text-xs tracking-wider shadow-sm">
                            {match.homeScore} - {match.awayScore}
                          </span>
                        ) : (
                          <div className="flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-xl py-1 px-2.5 shadow-sm text-center">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{match.matchDate}</span>
                            <span className="text-[10px] font-bold text-slate-700 mt-0.5">{match.matchTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex items-center gap-3 w-5/12 justify-end text-right">
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block truncate">{match.awayTeamName}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{match.awayTeamShortName}</span>
                        </div>
                        {getTeamLogo({ shortName: match.awayTeamShortName, logoColor: match.awayLogoColor, logoUrl: match.awayLogoUrl }, "w-8 h-8 text-xs border shadow-sm")}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 4. STANDINGS TABLE VIEW */}
          {activeTab === 'standings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">LaLiga Puan Durumu</h3>
                  <p className="text-xs text-slate-500">
                    O: Oynanan, G: Galibiyet, B: Beraberlik, M: Mağlubiyet, A: Atılan Gol, Y: Yenilen Gol, AV: Averaj, P: Puan
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="text-slate-500">Şampiyon / Lider</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-slate-500">Küme Düşme Hattı</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                      <th className="py-3.5 px-4 text-center">Sıra</th>
                      <th className="py-3.5 px-4">Takım</th>
                      <th className="py-3.5 px-4 text-center">O</th>
                      <th className="py-3.5 px-4 text-center">G</th>
                      <th className="py-3.5 px-4 text-center">B</th>
                      <th className="py-3.5 px-4 text-center">M</th>
                      <th className="py-3.5 px-4 text-center">A</th>
                      <th className="py-3.5 px-4 text-center">Y</th>
                      <th className="py-3.5 px-4 text-center">AV</th>
                      <th className="py-3.5 px-4 text-center font-bold text-slate-950 bg-slate-100/50">P</th>
                      <th className="py-3.5 px-4 text-center">Form (Son 5)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {standings.map((row, index) => {
                      const isLeader = index === 0;
                      const isRelegation = index >= (standings.length - 3) && standings.length >= 4;

                      let rankStyle = "bg-slate-100 text-slate-600";
                      let rowStyle = "";
                      
                      if (isLeader) {
                        rankStyle = "bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20";
                        rowStyle = "bg-yellow-500/5";
                      } else if (index === 1) {
                        rankStyle = "bg-slate-350 text-slate-900 font-bold";
                      } else if (index === 2) {
                        rankStyle = "bg-amber-600 text-white font-bold";
                      } else if (isRelegation) {
                        rankStyle = "bg-rose-100 text-rose-700 font-bold";
                        rowStyle = "bg-rose-50/30";
                      }

                      return (
                        <tr key={row.teamId} className={`hover:bg-slate-50/50 transition-colors ${rowStyle}`}>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${rankStyle}`}>
                              {row.rank}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <div className="flex items-center gap-3">
                              {getTeamLogo(row, "w-6 h-6 text-[10px]")}
                              <span>{row.teamName}</span>
                              
                              {/* Morale Dot indicator */}
                              <span className={`w-2 h-2 rounded-full shadow-sm ml-1 ${getMoraleColor(row.morale)}`} title={`Takım Morali: ${row.morale}%`}></span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium text-slate-600">{row.played}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/30">{row.won}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-amber-600 bg-amber-50/30">{row.drawn}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/30">{row.lost}</td>
                          <td className="py-3.5 px-4 text-center text-slate-500">{row.goalsFor}</td>
                          <td className="py-3.5 px-4 text-center text-slate-500">{row.goalsAgainst}</td>
                          <td className={`py-3.5 px-4 text-center font-extrabold ${row.goalDiff >= 0 ? 'text-slate-600' : 'text-rose-600'}`}>
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-slate-950 bg-slate-100/50 text-base">{row.points}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1">
                              {row.form && row.form.length > 0 ? (
                                row.form.map((f, i) => {
                                  let style = "bg-slate-200 text-slate-600";
                                  if (f === 'G') style = "bg-emerald-500 text-slate-950 font-bold";
                                  if (f === 'M') style = "bg-rose-500 text-white font-bold";
                                  if (f === 'B') style = "bg-amber-400 text-slate-950 font-bold";

                                  return (
                                    <span key={i} className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[9px] shadow-sm ${style}`}>
                                      {f}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-[10px] text-slate-400 font-semibold">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SIMULATION LOG HISTORY VIEW */}
          {activeTab === 'simulation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Controls Column */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">Simülasyon Merkezi</h3>
                  <p className="text-xs text-slate-500">Tüm sezonu adım adım veya anında simüle edin.</p>
                </div>

                <div className="space-y-3.5 border-t border-slate-100 pt-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-100/80 rounded-2xl">
                    <span className="block text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider mb-1">Aktif Durum</span>
                    <div className="text-emerald-900 font-bold text-sm">
                      Aktif Hafta: Hafta {currentWeek}
                    </div>
                    <div className="text-[11px] text-emerald-850 mt-1">
                      Kalan fikstür sayısı: {fixtures.filter(m => !m.played).length} maç.
                    </div>
                  </div>

                  <button
                    disabled={isSimulating || (fixtures.length > 0 && fixtures.every(m => m.played))}
                    onClick={handleSimulateWeek}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-btn shadow-emerald-500/10 transition-all duration-150"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isSimulating ? 'Simüle Ediliyor...' : `${currentWeek}. Haftayı Simüle Et`}
                  </button>

                  <button
                    disabled={isSimulating || (fixtures.length > 0 && fixtures.every(m => m.played))}
                    onClick={handleSimulateRemaining}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white font-extrabold border border-slate-850 rounded-xl text-sm transition-all duration-150"
                  >
                    <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                    Kalan Tüm Sezonu Simüle Et
                  </button>

                  <button
                    onClick={handleResetSeason}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition-all duration-150"
                  >
                    Tüm Sezonu Sıfırla
                  </button>
                </div>
              </div>

              {/* Simulation Log stream column (takes 2 cols) */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl text-slate-200 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Canlı Simülasyon Akışı
                  </h3>
                  <button 
                    onClick={() => { setSimLogs([]); playClick(); }}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest"
                  >
                    Konsolu Temizle
                  </button>
                </div>

                <div className="flex-1 font-mono text-xs space-y-2 overflow-y-auto max-h-[350px] pr-2 text-emerald-400/90 scrollbar-thin">
                  {simLogs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 select-none">
                      &gt; Bekleniyor. Haftayı simüle ettiğinizde sonuçlar burada görünecektir...
                    </div>
                  ) : (
                    simLogs.map((log, index) => (
                      <div key={index} className="border-b border-slate-900/40 pb-1.5 last:border-0 hover:text-white transition-colors">
                        <span className="text-slate-500 select-none">&gt;</span> {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* ================= MODAL: LIGHT THEME LOGIN CARD ================= */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 w-96 shadow-2xl max-w-sm flex flex-col relative animate-pulse-glow">
            
            {/* Header logo / Title */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100/50">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Yönetici Oturumu</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">LaLiga Sim Pro kontrol panelini açın</p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-xs font-bold text-center">
                  {loginError}
                </div>
              )}

              {/* Username */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  required
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Şifre</label>
                <input 
                  type="password" 
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs tracking-wide shadow-btn shadow-emerald-500/10 transition-colors mt-2"
              >
                Giriş Yap
              </button>
            </form>

            <button 
              onClick={() => { setLoginModalOpen(false); playClick(); }}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHAMPION TROPHY modal ================= */}
      {champModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-md">
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 border border-slate-800 text-white rounded-3xl p-8 w-[450px] shadow-2xl max-w-md flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Sparkle effects */}
            <div className="absolute right-0 top-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 w-36 h-36 bg-yellow-500/10 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="p-4 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/30 text-slate-950 mb-5 relative animate-bounce">
              <Trophy className="w-12 h-12 stroke-[1.5]" />
            </div>

            <span className="text-[10px] font-extrabold text-yellow-400 uppercase tracking-widest border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 rounded-full mb-2">
              Sezon Tamamlandı
            </span>

            <h3 className="font-extrabold text-2xl tracking-tight text-white">LALIGA ŞAMPİYONU</h3>
            
            {standings.length > 0 && (
              <div className="mt-6 w-full space-y-4">
                
                {/* Champ team banner */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-center gap-4">
                  {getTeamLogo(teams.find(t => t.id === standings[0].teamId), "w-14 h-14 text-lg border border-slate-700/80 shadow-md")}
                  <div className="text-left space-y-1">
                    <h4 className="text-lg font-bold text-white leading-tight">{standings[0].teamName}</h4>
                    <p className="text-xs text-emerald-400 font-medium">Teknik Direktör: {teams.find(t => t.id === standings[0].teamId)?.manager}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{teams.find(t => t.id === standings[0].teamId)?.stadium}</p>
                  </div>
                </div>

                {/* Scorer and Season stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-850/80">
                    <span className="block text-[9px] text-slate-400 font-medium uppercase mb-0.5">Şampiyon Puanı</span>
                    <span className="font-extrabold text-lg text-yellow-400">{standings[0].points} Puan</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-850/80">
                    <span className="block text-[9px] text-slate-400 font-medium uppercase mb-0.5">Sezon Gol Kralı</span>
                    <span className="font-extrabold text-xs text-white truncate block max-w-[120px] mx-auto">
                      {scorers.length > 0 ? `${scorers[0].name} (${scorers[0].goals} Gol)` : '-'}
                    </span>
                  </div>
                </div>

              </div>
            )}

            <button
              onClick={handleResetSeason}
              className="w-full mt-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs tracking-wider transition-all duration-150 shadow-btn shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Yeni Sezon Başlat
            </button>

            <button 
              onClick={() => { setChampModalOpen(false); playClick(); }}
              className="absolute right-4 top-4 p-1.5 hover:bg-slate-900 rounded-full text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: TEAM ADD/EDIT FORM ================= */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setTeamModalOpen(false); setIsEditingTeam(false); resetTeamForm(); playClick(); } }}>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 w-full max-w-2xl shadow-2xl flex flex-col relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm border border-emerald-100/50">
                  {isEditingTeam ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                    {isEditingTeam ? 'Takım Düzenle' : 'Yeni Takım Ekle'}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {isEditingTeam ? 'Takım bilgilerini güncelleyin' : 'Lige yeni bir takım ekleyin'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setTeamModalOpen(false); setIsEditingTeam(false); resetTeamForm(); playClick(); }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleTeamFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Takım Adı</label>
                  <input 
                    type="text" 
                    required
                    value={teamForm.name}
                    onChange={e => setTeamForm({...teamForm, name: e.target.value})}
                    placeholder="Real Madrid"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

                {/* ShortName */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kısa Kod (Short Name)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={3}
                    value={teamForm.shortName}
                    onChange={e => setTeamForm({...teamForm, shortName: e.target.value.toUpperCase()})}
                    placeholder="RM"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

                {/* Founding Year */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kuruluş Yılı</label>
                  <input 
                    type="number" 
                    required
                    value={teamForm.foundingYear}
                    onChange={e => setTeamForm({...teamForm, foundingYear: parseInt(e.target.value) || 2026})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

                {/* Primary Color Picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ana Renk (HEX / Picker)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={teamForm.primaryColor}
                      onChange={e => setTeamForm({...teamForm, primaryColor: e.target.value})}
                      className="w-10 h-10 p-0.5 border border-slate-200 rounded-xl cursor-pointer"
                    />
                    <input 
                      type="text" 
                      required
                      value={teamForm.primaryColor}
                      onChange={e => setTeamForm({...teamForm, primaryColor: e.target.value})}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Logo URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logo URL (Boş bırakılabilir)</label>
                  <input 
                    type="text" 
                    value={teamForm.logoUrl}
                    onChange={e => setTeamForm({...teamForm, logoUrl: e.target.value})}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

                {/* Power Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Takım Gücü ({teamForm.power})</label>
                    <span className="text-[10px] font-bold text-emerald-600">{teamForm.power}/100</span>
                  </div>
                  <input 
                    type="range" 
                    min={30}
                    max={100}
                    value={teamForm.power}
                    onChange={e => setTeamForm({...teamForm, power: parseInt(e.target.value) || 75})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-3"
                  />
                </div>

                {/* Manager */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Teknik Direktör</label>
                  <input 
                    type="text" 
                    value={teamForm.manager}
                    onChange={e => setTeamForm({...teamForm, manager: e.target.value})}
                    placeholder="Carlo Ancelotti"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

                {/* Stadium */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stadyum</label>
                  <input 
                    type="text" 
                    value={teamForm.stadium}
                    onChange={e => setTeamForm({...teamForm, stadium: e.target.value})}
                    placeholder="Santiago Bernabéu"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kapasite</label>
                  <input 
                    type="text" 
                    value={teamForm.capacity}
                    onChange={e => setTeamForm({...teamForm, capacity: e.target.value})}
                    placeholder="85,000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm transition-all"
                  />
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setTeamModalOpen(false); setIsEditingTeam(false); resetTeamForm(); playClick(); }}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs transition-colors duration-150"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors duration-150 shadow-btn shadow-emerald-500/10"
                >
                  <Save className="w-4 h-4" />
                  {isEditingTeam ? 'Değişiklikleri Kaydet' : 'Takım Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
