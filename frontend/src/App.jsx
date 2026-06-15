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
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { api } from './api';

// Custom LaLiga EA Sports Logo SVG Icon Component
function LaLigaLogo({ className = "w-6 h-6" }) {
  return (
    <img 
      src="/logo.png" 
      className={`${className} object-contain`} 
      alt="System Logo" 
    />
  );
}

// Fireworks celebration canvas component
function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let rockets = [];
    let lastLaunch = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#FF4B44', '#FFD700', '#FF6B6B', '#FFA500', '#FF1493',
      '#00CED1', '#7B68EE', '#FF69B4', '#ADFF2F', '#FFE4B5',
      '#FF4500', '#DA70D6', '#40E0D0', '#F0E68C', '#FF8C00'
    ];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.05;
        this.trail = [];
      }
      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 6) this.trail.shift();
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = t.alpha * (i / this.trail.length) * 0.3;
          ctx.fill();
        }
        // Draw particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Rocket {
      constructor(canvas) {
        this.x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
        this.vy = -(Math.random() * 4 + 6);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.trail = [];
        this.exploded = false;
      }
      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 12) this.trail.shift();
        this.y += this.vy;
        this.vy *= 0.98;
        if (this.y <= this.targetY || this.vy > -1.5) {
          this.exploded = true;
        }
      }
      draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = (i / this.trail.length) * 0.4;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const loop = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Launch new rockets periodically
      if (timestamp - lastLaunch > 400 + Math.random() * 600) {
        rockets.push(new Rocket(canvas));
        if (Math.random() > 0.5) rockets.push(new Rocket(canvas));
        lastLaunch = timestamp;
      }

      // Update rockets
      rockets = rockets.filter(r => {
        r.update();
        if (r.exploded) {
          const count = Math.floor(Math.random() * 40) + 50;
          for (let i = 0; i < count; i++) {
            particles.push(new Particle(r.x, r.y, r.color));
          }
          // Secondary ring of particles
          const ringColor = colors[Math.floor(Math.random() * colors.length)];
          for (let i = 0; i < 20; i++) {
            particles.push(new Particle(r.x, r.y, ringColor));
          }
          return false;
        }
        r.draw(ctx);
        return true;
      });

      // Update particles
      particles = particles.filter(p => {
        p.update();
        if (p.alpha <= 0) return false;
        p.draw(ctx);
        return true;
      });

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ zIndex: 51 }}
    />
  );
}

export default function App() {
  // Navigation & Auth
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // App State
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [maxWeeks, setMaxWeeks] = useState(34);
  const [standings, setStandings] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
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
    // Sound effects disabled per user request
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
      if (isSignUp) {
        // Register new admin
        const regRes = await api.register(loginUsername, loginPassword);
        if (regRes.success) {
          // Auto login after successful signup
          const loginRes = await api.login(loginUsername, loginPassword);
          if (loginRes.success) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
            setLoginModalOpen(false);
            setLoginUsername('');
            setLoginPassword('');
            setIsSignUp(false);
            playClick();
          }
        }
      } else {
        // Normal login
        const res = await api.login(loginUsername, loginPassword);
        if (res.success) {
          localStorage.setItem('isAdmin', 'true');
          setIsAdmin(true);
          setLoginModalOpen(false);
          setLoginUsername('');
          setLoginPassword('');
          playClick();
        }
      }
    } catch (err) {
      setLoginError(err.message || 'Hatalı şifre veya kullanıcı adı.');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Oturumu kapatmak istediğinizden emin misiniz?")) {
      localStorage.removeItem('isAdmin');
      setIsAdmin(false);
      playClick();
    }
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
      
      const matchLogs = res.results.map(m => `⚽ [Hafta ${res.week}] ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam}`);
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
      <aside className="w-64 bg-red-50 text-slate-800 flex-shrink-0 flex flex-col h-full border-r border-red-100/80 shadow-sm">
        
        {/* Logo / Header */}
        <div className="h-20 flex items-center px-6 border-b border-red-100 bg-red-100/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-btn shadow-red-600/10 border border-red-100/50 animate-pulse-glow">
              <LaLigaLogo className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-red-950 via-red-800 to-red-600 bg-clip-text text-transparent">
                LALIGA SIM
              </span>
              <span className="block text-[10px] text-red-700 font-bold uppercase tracking-widest mt-0.5">
                Football League Simulator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Anasayfa', icon: LayoutDashboard },
            { id: 'teams', label: 'Takım Yönetimi', icon: Users },
            { id: 'fixtures', label: 'Fikstür', icon: Calendar },
            { id: 'standings', label: 'Puan Durumu', icon: Table },
            { id: 'simulation', label: 'Simülasyon', icon: Play }
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); playClick(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  active 
                    ? 'bg-red-600 text-white shadow-btn shadow-red-600/10 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-red-100/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-red-100 bg-red-100/20 space-y-3">
          
          {/* Admin / Login Block */}
          {isAdmin ? (
            <div className="p-3 bg-red-100/50 border border-red-200/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs font-semibold text-red-700">Yönetici Modu</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-50 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors duration-150"
              >
                <LogOut className="w-3.5 h-3.5" />
                Çıkış Yap
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setLoginModalOpen(true); playClick(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all duration-150 shadow-btn shadow-red-600/10"
            >
              <LogIn className="w-3.5 h-3.5" />
              Yönetici Girişi
            </button>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        
        {/* Main Content Header */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Genel Bakış'}
              {activeTab === 'teams' && 'Takım Yönetimi'}
              {activeTab === 'fixtures' && 'Sezon Fikstürleri'}
              {activeTab === 'standings' && 'Puan Tablosu'}
              {activeTab === 'simulation' && 'Simülasyon Kontrol Merkezi'}
            </h1>
            
            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold">
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
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-slate-950 font-bold rounded-xl text-xs shadow-btn shadow-red-500/10 transition-all duration-150"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isSimulating ? 'Oynatılıyor...' : 'Haftayı Oynat'}
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
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
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
                        <span className="text-[10px] mt-0.5 text-slate-400/80">Haftayı oynatarak başlayın!</span>
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
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      Puan Durumu
                    </h3>
                    <button 
                      onClick={() => { setActiveTab('standings'); playClick(); }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
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

                          // Zone color indicator
                          let zoneColor = 'bg-transparent';
                          if (index <= 3) zoneColor = 'bg-blue-500';
                          else if (index <= 5) zoneColor = 'bg-orange-500';
                          else if (index === 6) zoneColor = 'bg-green-500';
                          else if (isRelegation) zoneColor = 'bg-rose-500';

                          return (
                            <tr key={row.teamId} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2 px-0 text-center">
                                <div className="flex items-center gap-1">
                                  <span className={`w-[3px] self-stretch rounded-sm flex-shrink-0 ${zoneColor}`}></span>
                                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${rankStyle}`}>
                                    {row.rank}
                                  </span>
                                </div>
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

                  {/* Position Legend */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                      <span className="text-slate-500">Şampiyonlar Ligi (1–4)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span>
                      <span className="text-slate-500">Avrupa Ligi (5–6)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-green-500"></span>
                      <span className="text-slate-500">Konferans Ligi (7)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                      <span className="text-slate-500">Küme Düşme (18–20)</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Lider Takım Card & Gol Krallığı Table */}
                <div className="space-y-6 flex flex-col">
                  
                  {/* Lider Takım */}
                  {getLeaderTeam() && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/10 to-red-100/20 border border-red-100/80 rounded-2xl p-5 text-slate-800 shadow-sm">
                      
                      {/* Decorative elements */}
                      <div className="absolute right-0 top-0 w-28 h-28 bg-red-500/5 rounded-full blur-2xl"></div>
                      <div className="absolute right-3 top-3 text-yellow-500/15">
                        <Award className="w-16 h-16 stroke-[1.2]" />
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Trophy className="w-3 h-3 text-yellow-600" />
                        Lider Takım
                      </span>

                      <div className="flex items-start gap-4">
                        {getTeamLogo(getLeaderTeam(), "w-14 h-14 text-lg border-2 border-white shadow-md")}
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold tracking-tight text-slate-950">{getLeaderTeam().name}</h4>
                          <p className="text-xs text-red-600 font-semibold">Teknik Direktör: {getLeaderTeam().manager}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{getLeaderTeam().stadium} ({getLeaderTeam().foundingYear} Kuruluş)</p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 text-center border-t border-red-100/60 pt-4 text-xs">
                        <div className="bg-red-50/40 p-2 rounded-xl border border-red-100/30">
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide">Galibiyet</span>
                          <span className="font-extrabold text-base text-red-600">{standings[0]?.won}</span>
                        </div>
                        <div className="bg-red-50/40 p-2 rounded-xl border border-red-100/30">
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide">Averaj</span>
                          <span className="font-extrabold text-base text-slate-700">
                            {standings[0]?.goalDiff > 0 ? `+${standings[0]?.goalDiff}` : standings[0]?.goalDiff}
                          </span>
                        </div>
                        <div className="bg-red-50/40 p-2 rounded-xl border border-red-100/30">
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide">Puan</span>
                          <span className="font-extrabold text-base text-yellow-600">{standings[0]?.points}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gol Krallığı */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
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
                              <span className="px-2.5 py-1 bg-red-50 border border-red-100 text-red-800 font-bold rounded-lg text-xs">
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-slate-950 font-bold rounded-xl text-xs transition-all duration-150 shadow-btn shadow-red-500/10"
                  >
                    <Plus className="w-4 h-4" />
                    Takım Ekle
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-xs text-red-800 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold block mb-0.5 text-red-950">Yönetici Yetkisi Gerekli</span>
                      Yeni takımlar eklemek, mevcut takımları düzenlemek veya silmek için sol alttaki <strong>Yönetici Girişi</strong> butonundan oturum açabilirsiniz.
                    </div>
                  </div>
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
                          <span className="text-red-600 font-bold block">{team.power} / 100</span>
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
                  <p className="text-xs text-slate-500">Sezonun tüm haftalarını inceleyin ve maç takvimini görün.</p>
                </div>

                {/* Week selector wheels */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full md:max-w-[450px]">
                  {Array.from({ length: maxWeeks }, (_, i) => i + 1).map(week => {
                    const isCurrent = currentWeek === week;
                    const isSelected = selectedWeek === week;

                    let btnStyle = "border-slate-200 text-slate-600 hover:bg-slate-50";
                    if (isSelected) btnStyle = "bg-slate-900 border-slate-900 text-white font-bold shadow-md";
                    else if (isCurrent) btnStyle = "border-red-400 bg-red-50 text-red-700 font-bold";

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
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs shadow-btn shadow-red-500/10 transition-all duration-150"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Bu Haftayı Oynat
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
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
                      } else if (isRelegation) {
                        rankStyle = "bg-rose-100 text-rose-700 font-bold";
                        rowStyle = "bg-rose-50/30";
                      }

                      // Zone color indicator
                      let zoneColor = 'bg-transparent';
                      if (index <= 3) zoneColor = 'bg-blue-500';
                      else if (index <= 5) zoneColor = 'bg-orange-500';
                      else if (index === 6) zoneColor = 'bg-green-500';
                      else if (isRelegation) zoneColor = 'bg-rose-500';

                      return (
                        <tr key={row.teamId} className={`hover:bg-slate-50/50 transition-colors ${rowStyle}`}>
                          <td className="py-3.5 px-0 text-center">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-[3px] self-stretch rounded-sm flex-shrink-0 ${zoneColor}`}></span>
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${rankStyle}`}>
                                {row.rank}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <div className="flex items-center gap-3">
                              {getTeamLogo(row, "w-6 h-6 text-[10px]")}
                              <span>{row.teamName}</span>
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
                            <div className="flex items-center justify-center gap-1.5">
                              {row.form && row.form.length > 0 ? (
                                row.form.map((f, i) => {
                                  let bgColor = "bg-slate-100 border-slate-200";
                                  let iconColor = "text-slate-400";
                                  let icon = '—';
                                  if (f === 'G') { bgColor = "bg-emerald-50 border-emerald-200"; iconColor = "text-emerald-600"; icon = '✓'; }
                                  if (f === 'M') { bgColor = "bg-rose-50 border-rose-200"; iconColor = "text-rose-500"; icon = '✗'; }
                                  if (f === 'B') { bgColor = "bg-slate-50 border-slate-200"; iconColor = "text-slate-400"; icon = '—'; }

                                  return (
                                    <span key={i} className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold ${bgColor} ${iconColor}`}>
                                      {icon}
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

              {/* Position Legend */}
              <div className="flex flex-wrap items-center gap-6 mt-5 pt-4 border-t border-slate-100 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-blue-500 shadow-sm"></span>
                  <span className="text-slate-600">Şampiyonlar Ligi (1–4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-orange-500 shadow-sm"></span>
                  <span className="text-slate-600">Avrupa Ligi (5–6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-500 shadow-sm"></span>
                  <span className="text-slate-600">Konferans Ligi (7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-500 shadow-sm"></span>
                  <span className="text-slate-600">Küme Düşme (18–20)</span>
                </div>
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
                  <p className="text-xs text-slate-500">Tüm sezonu adım adım veya anında oynatın.</p>
                </div>

                <div className="space-y-3.5 border-t border-slate-100 pt-5">
                  <div className="p-4 bg-red-50 border border-red-100/80 rounded-2xl">
                    <span className="block text-[10px] text-red-800 font-extrabold uppercase tracking-wider mb-1">Aktif Durum</span>
                    <div className="text-red-900 font-bold text-sm">
                      Aktif Hafta: Hafta {currentWeek}
                    </div>
                    <div className="text-[11px] text-red-850 mt-1">
                      Kalan fikstür sayısı: {fixtures.filter(m => !m.played).length} maç.
                    </div>
                  </div>

                  <button
                    disabled={isSimulating || (fixtures.length > 0 && fixtures.every(m => m.played))}
                    onClick={handleSimulateWeek}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-btn shadow-red-500/10 transition-all duration-150"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isSimulating ? 'Oynatılıyor...' : `${currentWeek}. Haftayı Oynat`}
                  </button>

                  <button
                    disabled={isSimulating || (fixtures.length > 0 && fixtures.every(m => m.played))}
                    onClick={handleSimulateRemaining}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-800 font-extrabold border border-slate-200 rounded-xl text-sm transition-all duration-150"
                  >
                    Tüm Sezonu Oynat
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
                      &gt; Bekleniyor. Haftayı oynattığınızda sonuçlar burada görünecektir...
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
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl shadow-sm border border-red-100/50">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
                  {isSignUp ? 'Yeni Yönetici Kaydı' : 'Yönetici Oturumu'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {isSignUp ? 'Sistem yöneticisi olarak kaydolun' : 'LaLiga Sim Pro kontrol panelini açın'}
                </p>
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
                  placeholder={isSignUp ? "Yeni kullanıcı adı" : "Kullanıcı adı"}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-slate-950 font-bold rounded-xl text-xs tracking-wide shadow-btn shadow-red-500/10 transition-colors mt-2"
              >
                {isSignUp ? 'Kayıt Ol ve Giriş Yap' : 'Giriş Yap'}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setLoginError(''); playClick(); }}
                className="text-xs text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Yeni yönetici hesabı oluşturun'}
              </button>
            </div>

            <button 
              onClick={() => { setLoginModalOpen(false); setIsSignUp(false); setLoginError(''); playClick(); }}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHAMPION TROPHY modal ================= */}
      {champModalOpen && (
        <>
          <Fireworks />
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-md">
          <div className="bg-white border border-slate-200 text-slate-800 rounded-3xl p-8 w-[450px] shadow-2xl max-w-md flex flex-col items-center text-center relative overflow-hidden" style={{ zIndex: 52 }}>
            
            {/* Sparkle effects */}
            <div className="absolute right-0 top-0 w-36 h-36 bg-amber-400/10 rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 w-36 h-36 bg-yellow-400/10 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div className="p-4 bg-yellow-400 text-slate-950 mb-5 relative animate-bounce rounded-2xl shadow-lg shadow-yellow-400/20">
              <Trophy className="w-12 h-12 stroke-[1.5]" />
            </div>

            <span className="text-[10px] font-extrabold text-yellow-600 uppercase tracking-widest border border-yellow-500/20 bg-yellow-50 px-3 py-1 rounded-full mb-2">
              Sezon Tamamlandı
            </span>

            <h3 className="font-extrabold text-2xl tracking-tight text-slate-900">LALIGA ŞAMPİYONU</h3>
            
            {standings.length > 0 && (
              <div className="mt-6 w-full space-y-4">
                
                {/* Champ team banner */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-4 shadow-sm">
                  {getTeamLogo(teams.find(t => t.id === standings[0].teamId), "w-14 h-14 text-lg border border-slate-100 shadow-sm")}
                  <div className="text-left space-y-1">
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">{standings[0].teamName}</h4>
                    <p className="text-xs text-emerald-600 font-bold">Teknik Direktör: {teams.find(t => t.id === standings[0].teamId)?.manager}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{teams.find(t => t.id === standings[0].teamId)?.stadium}</p>
                  </div>
                </div>

                {/* Scorer and Season stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="block text-[9px] text-slate-500 font-medium uppercase mb-0.5">Şampiyon Puanı</span>
                    <span className="font-extrabold text-lg text-yellow-600">{standings[0].points} Puan</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="block text-[9px] text-slate-500 font-medium uppercase mb-0.5">Sezon Gol Kralı</span>
                    <span className="font-extrabold text-xs text-slate-900 truncate block max-w-[120px] mx-auto">
                      {scorers.length > 0 ? `${scorers[0].name} (${scorers[0].goals} Gol)` : '-'}
                    </span>
                  </div>
                </div>

              </div>
            )}

            <button
              onClick={handleResetSeason}
              className="w-full mt-6 py-3.5 bg-red-500 hover:bg-red-600 text-slate-950 font-bold rounded-2xl text-xs tracking-wider transition-all duration-150 shadow-btn shadow-red-500/10 flex items-center justify-center"
            >
              Yeni Sezon Başlat
            </button>

            <button 
              onClick={() => { setChampModalOpen(false); playClick(); }}
              className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        </>
      )}

      {/* ================= MODAL: TEAM ADD/EDIT FORM ================= */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setTeamModalOpen(false); setIsEditingTeam(false); resetTeamForm(); playClick(); } }}>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 w-full max-w-2xl shadow-2xl flex flex-col relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shadow-sm border border-red-100/50">
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
                  />
                </div>

                {/* Power Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Takım Gücü ({teamForm.power})</label>
                    <span className="text-[10px] font-bold text-red-600">{teamForm.power}/100</span>
                  </div>
                  <input 
                    type="range" 
                    min={30}
                    max={100}
                    value={teamForm.power}
                    onChange={e => setTeamForm({...teamForm, power: parseInt(e.target.value) || 75})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500 mt-3"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all"
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
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-slate-950 font-bold rounded-xl text-xs transition-colors duration-150 shadow-btn shadow-red-500/10"
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
