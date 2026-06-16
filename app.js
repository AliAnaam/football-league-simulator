

// ================= STATE MANAGEMENT =================
const STATE = {
  currentWeek: 1,
  maxWeeks: 34,
  isSimulating: false,
  soundEnabled: false,
  searchQuery: "",
  isLoggedIn: false,
  editingTeamId: null,

  // Added: foundingYear, color (hex), logoUrl (base64 or URL), morale (0-100)
  teams: [
    { id: 'rm', name: 'Real Madrid', shortName: 'RM', power: 95, foundingYear: 1902, color: '#1e3a5f', morale: 75, logoColor: 'bg-indigo-900 border-indigo-700', textLight: 'text-indigo-200', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Carlo Ancelotti', stadium: 'Santiago Bernabéu', capacity: '85,000', logoUrl: '' },
    { id: 'bar', name: 'Barcelona', shortName: 'BAR', power: 93, foundingYear: 1899, color: '#a80532', morale: 70, logoColor: 'bg-red-800 border-blue-900', textLight: 'text-red-200', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Hansi Flick', stadium: 'Spotify Camp Nou', capacity: '99,354', logoUrl: '' },
    { id: 'atm', name: 'Atletico Madrid', shortName: 'ATM', power: 90, foundingYear: 1903, color: '#ce1b2b', morale: 65, logoColor: 'bg-red-600 border-blue-700', textLight: 'text-red-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Diego Simeone', stadium: 'Cívitas Metropolitano', capacity: '70,460', logoUrl: '' },
    { id: 'gir', name: 'Girona', shortName: 'GIR', power: 84, foundingYear: 1930, color: '#c8102e', morale: 60, logoColor: 'bg-red-500 border-red-400', textLight: 'text-red-50', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Míchel', stadium: 'Montilivi', capacity: '14,624', logoUrl: '' },
    { id: 'ath', name: 'Athletic Club', shortName: 'ATH', power: 85, foundingYear: 1898, color: '#ee2423', morale: 62, logoColor: 'bg-red-700 border-slate-200', textLight: 'text-red-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Ernesto Valverde', stadium: 'San Mamés', capacity: '53,289', logoUrl: '' },
    { id: 'vil', name: 'Villarreal', shortName: 'VIL', power: 83, foundingYear: 1923, color: '#fcbe00', morale: 58, logoColor: 'bg-yellow-400 border-yellow-300', textLight: 'text-yellow-950', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Marcelino', stadium: 'Estadio de la Cerámica', capacity: '23,000', logoUrl: '' },
    { id: 'rso', name: 'Real Sociedad', shortName: 'RSO', power: 84, foundingYear: 1909, color: '#1a4e9c', morale: 60, logoColor: 'bg-blue-600 border-slate-200', textLight: 'text-blue-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Imanol Alguacil', stadium: 'Reale Arena', capacity: '39,500', logoUrl: '' },
    { id: 'bet', name: 'Betis', shortName: 'BET', power: 82, foundingYear: 1907, color: '#00954c', morale: 55, logoColor: 'bg-emerald-700 border-slate-200', textLight: 'text-emerald-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Manuel Pellegrini', stadium: 'Benito Villamarín', capacity: '60,720', logoUrl: '' },
    { id: 'lpa', name: 'Las Palmas', shortName: 'LPA', power: 76, foundingYear: 1949, color: '#f5a800', morale: 50, logoColor: 'bg-yellow-500 border-blue-600', textLight: 'text-yellow-950', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Luis Carrión', stadium: 'Gran Canaria', capacity: '32,400', logoUrl: '' },
    { id: 'ray', name: 'Rayo Vallecano', shortName: 'RAY', power: 75, foundingYear: 1924, color: '#e60026', morale: 50, logoColor: 'bg-slate-100 border-red-500', textLight: 'text-slate-800', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Íñigo Pérez', stadium: 'Vallecas', capacity: '14,700', logoUrl: '' },
    { id: 'osa', name: 'Osasuna', shortName: 'OSA', power: 78, foundingYear: 1920, color: '#6b0000', morale: 52, logoColor: 'bg-red-900 border-slate-300', textLight: 'text-red-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Vicente Moreno', stadium: 'El Sadar', capacity: '23,576', logoUrl: '' },
    { id: 'sev', name: 'Sevilla', shortName: 'SEV', power: 80, foundingYear: 1890, color: '#d81920', morale: 48, logoColor: 'bg-red-700 border-slate-200', textLight: 'text-red-50', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'García Pimienta', stadium: 'Ramón Sánchez-Pizjuán', capacity: '43,883', logoUrl: '' },
    { id: 'cel', name: 'Celta Vigo', shortName: 'CEL', power: 75, foundingYear: 1923, color: '#8ecae6', morale: 45, logoColor: 'bg-sky-400 border-slate-200', textLight: 'text-sky-950', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Claudio Giráldez', stadium: 'Abanca-Balaídos', capacity: '29,000', logoUrl: '' },
    { id: 'get', name: 'Getafe', shortName: 'GET', power: 77, foundingYear: 1946, color: '#003d7e', morale: 48, logoColor: 'bg-blue-800 border-blue-600', textLight: 'text-blue-200', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'José Bordalás', stadium: 'Coliseum', capacity: '16,500', logoUrl: '' },
    { id: 'val', name: 'Valencia', shortName: 'VAL', power: 79, foundingYear: 1919, color: '#d4a017', morale: 40, logoColor: 'bg-slate-200 border-slate-400', textLight: 'text-slate-800', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Rubén Baraja', stadium: 'Mestalla', capacity: '49,430', logoUrl: '' },
    { id: 'mal', name: 'Mallorca', shortName: 'MAL', power: 74, foundingYear: 1916, color: '#c8102e', morale: 38, logoColor: 'bg-red-600 border-black', textLight: 'text-red-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Jagoba Arrasate', stadium: 'Son Moix', capacity: '23,142', logoUrl: '' },
    { id: 'cad', name: 'Cadiz', shortName: 'CAD', power: 70, foundingYear: 1910, color: '#f5d800', morale: 35, logoColor: 'bg-yellow-400 border-blue-800', textLight: 'text-yellow-950', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Paco López', stadium: 'Nuevo Mirandilla', capacity: '20,724', logoUrl: '' },
    { id: 'gra', name: 'Granada', shortName: 'GRA', power: 68, foundingYear: 1931, color: '#c8102e', morale: 30, logoColor: 'bg-red-600 border-slate-200', textLight: 'text-red-100', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [], manager: 'Guillermo Abascal', stadium: 'Nuevo Los Cármenes', capacity: '19,336', logoUrl: '' }
  ],

  // Top players/scorers mapped to teams for Gol Krallığı
  scorers: [
    { name: 'Kylian Mbappé', teamId: 'rm', goals: 14 },
    { name: 'R. Lewandowski', teamId: 'bar', goals: 12 },
    { name: 'A. Griezmann', teamId: 'atm', goals: 10 },
    { name: 'C. Stuani', teamId: 'gir', goals: 9 },
    { name: 'J. Bellingham', teamId: 'rm', goals: 8 },
    { name: 'Vinicius Jr.', teamId: 'rm', goals: 8 },
    { name: 'Raphinha', teamId: 'bar', goals: 7 },
    { name: 'I. Williams', teamId: 'ath', goals: 7 },
    { name: 'M. Oyarzabal', teamId: 'rso', goals: 6 },
    { name: 'A. Dovbyk', teamId: 'gir', goals: 6 }
  ],


  fixtures: [],
  history: []
};

// Seed dynamic roster for scorers & team goals
const PLAYER_NAMES = {
  rm: ['Kylian Mbappé', 'J. Bellingham', 'Vinicius Jr.', 'Rodrygo', 'F. Valverde'],
  bar: ['R. Lewandowski', 'Raphinha', 'Lamine Yamal', 'F. de Jong', 'Pedri'],
  atm: ['A. Griezmann', 'A. Morata', 'Angel Correa', 'R. De Paul', 'Marcos Llorente'],
  gir: ['C. Stuani', 'A. Dovbyk', 'Viktor Tsygankov', 'Yangel Herrera', 'Savinho'],
  ath: ['I. Williams', 'N. Williams', 'O. Sancet', 'G. Guruzeta', 'Alex Berenguer'],
  vil: ['G. Moreno', 'A. Sorloth', 'Alex Baena', 'Yeremy Pino', 'Jose Morales'],
  rso: ['M. Oyarzabal', 'Takefusa Kubo', 'Brais Mendez', 'Mikel Merino', 'A. Barrenetxea'],
  bet: ['Willian Jose', 'Isco', 'Ayoze Perez', 'Nabil Fekir', 'Pablo Fornals'],
  lpa: ['Kirian Rodriguez', 'Munir El Haddadi', 'Sandro Ramirez', 'Moleiro'],
  ray: ['Isi Palazon', 'Alvaro Garcia', 'R. de Tomas', 'Oscar Trejo'],
  osa: ['Ante Budimir', 'Chimy Avila', 'Ruben Garcia', 'Moi Gomez'],
  sev: ['Y. En-Nesyri', 'Lucas Ocampos', 'Dodi Lukebakio', 'Suso'],
  cel: ['Iago Aspas', 'Jorgen Strand Larsen', 'Jonathan Bamba', 'Fran Beltran'],
  get: ['Borja Mayoral', 'Mason Greenwood', 'Maksimovic', 'Juan Latasa'],
  val: ['Hugo Duro', 'Javi Guerra', 'Diego Lopez', 'Pepelu'],
  mal: ['Vedat Muriqi', 'Abdon Prats', 'Cyle Larin', 'Dani Rodriguez'],
  cad: ['Chris Ramos', 'Darwin Machis', 'Roger Marti', 'Ruben Alcaraz'],
  gra: ['Myrto Uzuni', 'Lucas Boye', 'Bryan Zaragoza', 'Gonzalo Villar']
};


// ================= SOUND ENGINE (WEB AUDIO API) =================
const SOUNDS = {
  ctx: null,

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  },

  playClick() {
    if (!STATE.soundEnabled || !this.ctx) return;
    this.init();

    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  },

  playWhistle(pitch = 587.33, duration = 0.4) {
    if (!STATE.soundEnabled || !this.ctx) return;
    this.init();

    let osc1 = this.ctx.createOscillator();
    let osc2 = this.ctx.createOscillator();
    let gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(pitch + 10, this.ctx.currentTime + duration);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(pitch * 1.5, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();

    osc1.stop(this.ctx.currentTime + duration);
    osc2.stop(this.ctx.currentTime + duration);
  },

  playGoal() {
    if (!STATE.soundEnabled || !this.ctx) return;
    this.init();

    // Low bass boom + high cheering chime
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);

    setTimeout(() => {
      this.playWhistle(880, 0.15);
    }, 50);
  },

  playTrophy() {
    if (!STATE.soundEnabled || !this.ctx) return;
    this.init();

    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C arpeggio
    notes.forEach((freq, index) => {
      setTimeout(() => {
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      }, index * 120);
    });
  }
};

// ================= FIXTURES SCHEDULER =================

function generateFixtures() {
  const teamIds = STATE.teams.map(t => t.id);

  // Shuffle teamIds to randomize matchups on every reset
  for (let i = teamIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teamIds[i], teamIds[j]] = [teamIds[j], teamIds[i]];
  }

  const numTeams = teamIds.length;

  // Ensure even number of teams (add a dummy BYE if needed)
  const ids = numTeams % 2 === 0 ? [...teamIds] : [...teamIds, '__bye__'];
  const n = ids.length;
  const totalWeeks = (n - 1) * 2;
  STATE.maxWeeks = totalWeeks;

  const weeks = [];

  // First half: standard circle rotation
  for (let round = 0; round < n - 1; round++) {
    const weekMatches = [];
    const rotated = [ids[0], ...ids.slice(1).slice(round).concat(ids.slice(1).slice(0, round))];

    for (let i = 0; i < n / 2; i++) {
      const homeId = rotated[i];
      const awayId = rotated[n - 1 - i];
      if (homeId === '__bye__' || awayId === '__bye__') continue;
      weekMatches.push({
        homeId, awayId,
        homeScore: null, awayScore: null,
        played: false,
        date: getMatchDate(i),
        time: getMatchTime(i)
      });
    }
    weeks.push(weekMatches);
  }

  // Second half: reverse home/away
  const firstHalf = weeks.slice(0);
  firstHalf.forEach(weekMatches => {
    const returnWeek = weekMatches.map(m => ({
      homeId: m.awayId,
      awayId: m.homeId,
      homeScore: null, awayScore: null,
      played: false,
      date: m.date,
      time: m.time
    }));
    weeks.push(returnWeek);
  });

  STATE.fixtures = weeks;
}

function getMatchDate(index) {
  const totalMatches = Math.ceil(STATE.teams.length / 2);
  if (index === totalMatches - 1) {
    return 'SAL';
  }
  if (index === 0) return 'CUM';
  if (index >= 1 && index <= 3) return 'CMT';
  if (index >= 4 && index <= 7) return 'PAZ';
  return 'PZT';
}

function getMatchTime(index) {
  const times = ['21:00', '14:00', '16:15', '18:30', '21:00', '14:00', '16:15', '18:30', '21:00', '21:00'];
  return times[index % times.length];
}

// ================= MORAL SİSTEMİ =================

function updateMorale(team, result) {
  if (result === 'win') team.morale = Math.min(100, team.morale + 10);
  if (result === 'draw') team.morale = Math.min(100, team.morale + 2);
  if (result === 'loss') team.morale = Math.max(0, team.morale - 8);
}

function getMoraleBonus(team) {
  // Morale 50 = neutral, 100 = +2.5, 0 = -2.5
  return Math.round((team.morale - 50) / 20);
}

// ================= SIMULATION MATH MODEL =================

function simulateMatch(homeTeam, awayTeam) {
  const homeAdvantage = 3;
  const moraleHome = getMoraleBonus(homeTeam);
  const moraleAway = getMoraleBonus(awayTeam);

  const rawPowerHome = homeTeam.power + homeAdvantage + moraleHome;
  const rawPowerAway = awayTeam.power + moraleAway;

  const powerDiff = rawPowerHome - rawPowerAway;

  // Base expected goals with power difference scaling (stronger team gets higher win probability)
  let homeExpected = 1.35 + (powerDiff * 0.075);
  let awayExpected = 1.15 - (powerDiff * 0.075);

  // Ensure expected goals don't drop below 0.2 to allow occasional goals even for weak teams
  homeExpected = Math.max(0.2, homeExpected);
  awayExpected = Math.max(0.2, awayExpected);

  // Calculate scores with variance centered around the expectation
  let homeScore = Math.round(homeExpected + (Math.random() - 0.5) * 1.1);
  let awayScore = Math.round(awayExpected + (Math.random() - 0.5) * 1.1);

  // Ensure scores are non-negative and cap at realistic limits
  homeScore = Math.max(0, Math.min(homeScore, 6));
  awayScore = Math.max(0, Math.min(awayScore, 6));

  return { homeScore, awayScore };
}

/**
 * Simulates a single week of football matches
 */
function simulateWeek(weekIndex) {
  if (weekIndex < 1 || weekIndex > STATE.maxWeeks) return;
  const weekMatches = STATE.fixtures[weekIndex - 1];

  weekMatches.forEach(match => {
    if (match.played) return; // Already simulated

    const homeTeam = STATE.teams.find(t => t.id === match.homeId);
    const awayTeam = STATE.teams.find(t => t.id === match.awayId);

    const result = simulateMatch(homeTeam, awayTeam);
    match.homeScore = result.homeScore;
    match.awayScore = result.awayScore;
    match.played = true;

    // Update standings logic
    homeTeam.played += 1;
    awayTeam.played += 1;
    homeTeam.goalsFor += result.homeScore;
    homeTeam.goalsAgainst += result.awayScore;
    awayTeam.goalsFor += result.awayScore;
    awayTeam.goalsAgainst += result.homeScore;
    homeTeam.goalDiff = homeTeam.goalsFor - homeTeam.goalsAgainst;
    awayTeam.goalDiff = awayTeam.goalsFor - awayTeam.goalsAgainst;

    if (result.homeScore > result.awayScore) {
      homeTeam.won += 1;
      homeTeam.points += 3;
      awayTeam.lost += 1;
      homeTeam.form.push('G');
      awayTeam.form.push('M');
      updateMorale(homeTeam, 'win');
      updateMorale(awayTeam, 'loss');
    } else if (result.homeScore < result.awayScore) {
      awayTeam.won += 1;
      awayTeam.points += 3;
      homeTeam.lost += 1;
      homeTeam.form.push('M');
      awayTeam.form.push('G');
      updateMorale(awayTeam, 'win');
      updateMorale(homeTeam, 'loss');
    } else {
      homeTeam.drawn += 1;
      homeTeam.points += 1;
      awayTeam.drawn += 1;
      awayTeam.points += 1;
      homeTeam.form.push('B');
      awayTeam.form.push('B');
      updateMorale(homeTeam, 'draw');
      updateMorale(awayTeam, 'draw');
    }

    // Cap form array at last 5 matches
    if (homeTeam.form.length > 5) homeTeam.form.shift();
    if (awayTeam.form.length > 5) awayTeam.form.shift();

    // Dynamic Scorer simulation
    simulateScorersForMatch(match, result.homeScore, result.awayScore);
  });

  // Sort teams table dynamically
  sortStandings();

  // Store in simulation log history
  STATE.history.push({
    week: weekIndex,
    matches: JSON.parse(JSON.stringify(weekMatches))
  });
}

function simulateScorersForMatch(match, homeScore, awayScore) {
  // Home scorers
  for (let i = 0; i < homeScore; i++) {
    const list = PLAYER_NAMES[match.homeId] || [];
    const name = list[Math.floor(Math.random() * list.length)] || 'Bilinmeyen';
    addGoalToPlayer(name, match.homeId);
  }
  // Away scorers
  for (let i = 0; i < awayScore; i++) {
    const list = PLAYER_NAMES[match.awayId] || [];
    const name = list[Math.floor(Math.random() * list.length)] || 'Bilinmeyen';
    addGoalToPlayer(name, match.awayId);
  }
}

function addGoalToPlayer(name, teamId) {
  const existing = STATE.scorers.find(s => s.name === name);
  if (existing) {
    existing.goals += 1;
  } else {
    STATE.scorers.push({ name, teamId, goals: 1 });
  }
  // Sort scorers dynamically
  STATE.scorers.sort((a, b) => b.goals - a.goals);
}

function sortStandings() {
  STATE.teams.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points; // Higher points first
    }
    if (b.goalDiff !== a.goalDiff) {
      return b.goalDiff - a.goalDiff; // Better goal difference
    }
    return b.goalsFor - a.goalsFor; // Most goals scored
  });
}

// ================= DYNAMIC DOM RENDERERS =================

// Utility functions
const getLeaderTeam = () => STATE.teams[0];
const LOGO_URLS = {
  rm: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  bar: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  atm: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  gir: 'https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_logo.svg',
  ath: 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg',
  vil: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg',
  rso: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg',
  bet: 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_Betis_balompie_logo.svg',
  lpa: 'https://upload.wikimedia.org/wikipedia/en/b/b9/UD_Las_Palmas_logo.svg',
  ray: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Rayo_Vallecano_logo.svg',
  osa: 'https://upload.wikimedia.org/wikipedia/en/d/db/CA_Osasuna_logo.svg',
  sev: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg',
  cel: 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg',
  get: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Getafe_CF_logo.svg',
  val: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg',
  mal: 'https://upload.wikimedia.org/wikipedia/en/e/e0/RCD_Mallorca_logo.svg',
  cad: 'https://upload.wikimedia.org/wikipedia/en/5/58/C%C3%A1diz_CF_logo.svg',
  gra: 'https://upload.wikimedia.org/wikipedia/en/d/d5/Granada_CF_logo.svg'
};

const getTeamLogoHTML = (team, size = "w-8 h-8 text-xs") => {
  // Prefer user-uploaded logo (from CRUD), fall back to CDN URLs for pre-loaded teams
  const logoUrl = (team.logoUrl && team.logoUrl.length > 0) ? team.logoUrl : (LOGO_URLS[team.id] || "");
  return `
    <div class="relative ${size} flex items-center justify-center shrink-0 select-none overflow-hidden rounded-lg ${team.logoColor} shadow-inner" title="${team.name}">
      <!-- Fallback Initials (always visible behind) -->
      <span class="absolute font-bold text-white transition-opacity duration-300 leading-none">${team.shortName}</span>
      <!-- Real SVG Logo (fades in on load, hides initials, hides on error) -->
      ${logoUrl ? `
      <img src="${logoUrl}" 
           alt="${team.name}" 
           class="absolute w-[80%] h-[80%] object-contain opacity-0 transition-opacity duration-300 pointer-events-none z-10" 
           onload="this.previousElementSibling.style.opacity = '0'; this.classList.remove('opacity-0'); this.classList.add('opacity-100');" 
           onerror="this.style.display='none';">
      ` : ""}
    </div>
  `;
};

// Render form badges
const renderFormBadges = (formArray) => {
  return formArray.map(badge => {
    let bg = 'bg-slate-100 text-slate-700';
    if (badge === 'G') bg = 'bg-emerald-100 text-emerald-800 border border-emerald-200/50';
    if (badge === 'B') bg = 'bg-amber-100 text-amber-800 border border-amber-200/50';
    if (badge === 'M') bg = 'bg-rose-100 text-rose-800 border border-rose-200/50';
    return `<span class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${bg}">${badge}</span>`;
  }).join(' ');
};

// 1. HOME DASHBOARD RENDERER
function renderHome() {
  const leader = getLeaderTeam();
  const weekMatches = STATE.fixtures[STATE.currentWeek - 1] || [];
  const prevWeekMatches = STATE.fixtures[STATE.currentWeek - 2] || [];

  // Calculate aggregate stats
  const totalTeams = STATE.teams.length;
  const playedMatches = STATE.teams.reduce((acc, t) => acc + t.played, 0) / 2;
  const totalGoals = STATE.teams.reduce((acc, t) => acc + t.goalsFor, 0);
  const avgGoals = playedMatches > 0 ? (totalGoals / playedMatches).toFixed(2) : "0.00";

  const content = `
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Anasayfa</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">${STATE.currentWeek}. haftaya güncel sezon özeti</p>
    </div>

    <!-- STATS CARDS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Teams Card -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Toplam Takım</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i data-lucide="shield" class="w-5 h-5"></i>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-slate-900 mb-1">${totalTeams}</h3>
          <p class="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif sezon
          </p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 transform scale-x-100 transition-transform"></div>
      </div>

      <!-- Matches Played Card -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Oynanan Maç</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i data-lucide="activity" class="w-5 h-5"></i>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-slate-900 mb-1">${playedMatches}</h3>
          <p class="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 9 bu hafta
          </p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 transform scale-x-100 transition-transform"></div>
      </div>

      <!-- Leader Team Card -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Lider Takım</span>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <i data-lucide="trophy" class="w-5 h-5"></i>
          </div>
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 mb-1 truncate">${leader.name}</h3>
          <p class="text-[11px] font-medium text-amber-600 flex items-center gap-1">
            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> ${leader.points} puan
          </p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 transform scale-x-100 transition-transform"></div>
      </div>

      <!-- Total Goals Card -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Toplam Gol</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i data-lucide="goal" class="w-5 h-5"></i>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-slate-900 mb-1">${totalGoals}</h3>
          <p class="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <i data-lucide="percent" class="w-3.5 h-3.5"></i> Maç başı ${avgGoals}
          </p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 transform scale-x-100 transition-transform"></div>
      </div>
    </div>

    <!-- ACTION BUTTONS ROW -->
    <div id="sim-controls-panel" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Big green "Play Week" button -->
      <button onclick="handleSimulateWeek()" class="lg:col-span-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] hover-scale text-white p-5 rounded-2xl shadow-md hover:shadow-lg shadow-emerald-500/10 flex items-center justify-between border border-emerald-400/10 cursor-pointer group text-left">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <i data-lucide="play" class="w-6 h-6 fill-white"></i>
          </div>
          <div>
            <h4 class="text-base font-extrabold">Haftayı Oynat</h4>
            <span class="text-xs text-emerald-100 font-medium">${STATE.currentWeek}. hafta - 9 karşılaşma simüle edilecek</span>
          </div>
        </div>
        <i data-lucide="arrow-right" class="w-5 h-5 text-emerald-100 group-hover:translate-x-1 transition-transform"></i>
      </button>

      <!-- Second button "Play Season" -->
      <button onclick="handleSimulateSeason()" class="bg-white border border-slate-200/80 hover:bg-slate-50 active:scale-[0.99] hover-scale text-slate-700 p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer group text-left">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <i data-lucide="fast-forward" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800">Tüm Sezonu Oynat</h4>
            <span class="text-[11px] text-slate-400 font-medium">Kalan ${STATE.maxWeeks - STATE.currentWeek + 1} hafta simüle edilir</span>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform"></i>
      </button>
    </div>

    <!-- MAIN BUNDLE GRID -->
    <div class="space-y-6">
      
      <!-- TOP ROW: Son Sonuçlar & Yaklaşan Maçlar side-by-side -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Son Maç Sonuçları -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <i data-lucide="award" class="w-4.5 h-4.5 text-slate-400"></i>
                <h3 class="text-sm font-bold text-slate-800">Son Maç Sonuçları</h3>
              </div>
              <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200/50">
                ${STATE.currentWeek - 1}. Hafta
              </span>
            </div>
            <div class="divide-y divide-slate-100">
              ${prevWeekMatches.slice(0, 5).map(m => {
    const home = STATE.teams.find(t => t.id === m.homeId);
    const away = STATE.teams.find(t => t.id === m.awayId);
    return `
                  <div class="py-3.5 flex items-center justify-between text-xs font-semibold">
                    <div class="flex items-center gap-3 w-5/12">
                      ${getTeamLogoHTML(home, "w-7 h-7 text-[10px]")}
                      <span class="text-slate-800 truncate">${home.name}</span>
                    </div>
                    <div class="flex items-center justify-center gap-3 w-2/12 font-black text-slate-900 text-sm">
                      <span>${m.homeScore}</span>
                      <span class="text-slate-300 font-normal">-</span>
                      <span>${m.awayScore}</span>
                    </div>
                    <div class="flex items-center gap-3 w-5/12 justify-end">
                      <span class="text-slate-800 truncate text-right">${away.name}</span>
                      ${getTeamLogoHTML(away, "w-7 h-7 text-[10px]")}
                    </div>
                    <span class="ml-4 bg-slate-100/75 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-slate-200/30 uppercase shrink-0">BİTTİ</span>
                  </div>
                `;
  }).join('')}
            </div>
          </div>
        </div>

        <!-- Yaklaşan Maçlar -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-4.5 h-4.5 text-slate-400"></i>
                <h3 class="text-sm font-bold text-slate-800">Yaklaşan Maçlar</h3>
              </div>
              <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-200/50">
                ${STATE.currentWeek}. Hafta
              </span>
            </div>
            <div class="divide-y divide-slate-100">
              ${weekMatches.length === 0 ? `
                <div class="py-6 text-center text-slate-400 text-xs font-semibold">
                  Sezon tamamlandı! Fikstür ayarlarından sıfırlayabilirsiniz.
                </div>
              ` : weekMatches.slice(0, 5).map(m => {
    const home = STATE.teams.find(t => t.id === m.homeId);
    const away = STATE.teams.find(t => t.id === m.awayId);
    return `
                  <div class="py-3.5 flex items-center justify-between text-xs font-semibold">
                    <!-- Match Date/Badge -->
                    <div class="flex items-center gap-2 w-3/12 shrink-0">
                      <span class="bg-slate-100/80 text-slate-600 px-1.5 py-1 rounded text-[9px] font-black tracking-wider text-center w-12 border border-slate-200/40">${m.date}</span>
                      <span class="text-slate-400 text-[10px] font-medium">${m.time}</span>
                    </div>
                    <!-- Matchup teams -->
                    <div class="flex items-center justify-center gap-4 w-9/12">
                      <div class="flex items-center gap-2.5 w-5/12 justify-end">
                        <span class="text-slate-800 text-right truncate">${home.name}</span>
                        ${getTeamLogoHTML(home, "w-7 h-7 text-[10px]")}
                      </div>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200/40 select-none">VS</span>
                      <div class="flex items-center gap-2.5 w-5/12 justify-start">
                        ${getTeamLogoHTML(away, "w-7 h-7 text-[10px]")}
                        <span class="text-slate-800 text-left truncate">${away.name}</span>
                      </div>
                    </div>
                  </div>
                `;
  }).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- BOTTOM ROW: Standings Table (Left, 2/3 width) & Leaders Stack (Right, 1/3 width) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Puan Durumu Tablosu (lg:col-span-2) -->
        <div class="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="list-ordered" class="w-4 h-4 text-slate-400"></i> Puan Durumu
              </h3>
              <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">İlk 8 Takım</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-[11px] font-bold text-slate-800 text-left min-w-[450px]">
                <thead>
                  <tr class="text-slate-400 border-b border-slate-100 uppercase text-[9px] tracking-wider font-extrabold">
                    <th class="pb-2.5 w-8 text-center">#</th>
                    <th class="pb-2.5">Takım</th>
                    <th class="pb-2.5 text-center w-10">O</th>
                    <th class="pb-2.5 text-center w-10">G</th>
                    <th class="pb-2.5 text-center w-10">B</th>
                    <th class="pb-2.5 text-center w-10">M</th>
                    <th class="pb-2.5 text-center w-10">AV</th>
                    <th class="pb-2.5 text-center w-12">P</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  ${STATE.teams.slice(0, 8).map((team, idx) => {
    let zoneClass = "";
    if (idx < 4) zoneClass = "zone-cl";
    else if (idx < 6) zoneClass = "zone-el";

    return `
                      <tr class="hover:bg-slate-50/50 cursor-pointer ${zoneClass}" onclick="showTeamModal('${team.id}')">
                        <td class="py-2.5 text-center text-slate-500 font-bold w-8 pl-1.5">${idx + 1}</td>
                        <td class="py-2.5 flex items-center gap-2">
                          ${getTeamLogoHTML(team, "w-6 h-6 text-[9px]")}
                          <span class="truncate max-w-[120px] text-slate-800 text-xs font-bold">${team.name}</span>
                        </td>
                        <td class="py-2.5 text-center text-slate-500 w-10">${team.played}</td>
                        <td class="py-2.5 text-center text-slate-500 w-10">${team.won}</td>
                        <td class="py-2.5 text-center text-slate-500 w-10">${team.drawn}</td>
                        <td class="py-2.5 text-center text-slate-500 w-10">${team.lost}</td>
                        <td class="py-2.5 text-center text-slate-500 w-10">${team.goalDiff > 0 ? '+' : ''}${team.goalDiff}</td>
                        <td class="py-2.5 text-center text-emerald-600 font-extrabold text-xs w-12">${team.points}</td>
                      </tr>
                    `;
  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <!-- Go to standings button -->
          <button onclick="navigateTo('nav-standings')" class="w-full mt-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-center text-[10px] font-extrabold text-slate-600 hover:text-slate-800 transition-all cursor-pointer">
            Tüm Puan Durumunu Göster
          </button>
        </div>

        <!-- Right Side Stack: Lider Takım & Gol Krallığı stacked vertically (lg:col-span-1) -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Lider Takım Özet Kartı -->
          <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="crown" class="w-4 h-4 text-amber-500"></i> Lider Takım
              </h3>
              <span class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-bold border border-amber-200/50 flex items-center gap-1">
                <i data-lucide="star" class="w-2.5 h-2.5 fill-amber-500 text-amber-500"></i> 1. Sıra
              </span>
            </div>
            <div class="flex items-center gap-4 mb-5">
              ${getTeamLogoHTML(leader, "w-14 h-14 text-lg")}
              <div>
                <h4 class="text-base font-extrabold text-slate-900 leading-tight">${leader.name}</h4>
                <p class="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">La Liga Lideri</p>
                <div class="flex items-center gap-1 mt-2">
                  ${renderFormBadges(leader.form)}
                </div>
              </div>
            </div>
            <!-- Tiny stats bar -->
            <div class="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
              <div>
                <h5 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Puan</h5>
                <p class="text-base font-black text-slate-900">${leader.points}</p>
              </div>
              <div>
                <h5 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Galibiyet</h5>
                <p class="text-base font-black text-slate-900">${leader.won}</p>
              </div>
              <div>
                <h5 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Averaj</h5>
                <p class="text-base font-black text-slate-900">+${leader.goalDiff}</p>
              </div>
            </div>
          </div>

          <!-- Gol Krallığı Tablosu (Top 5) -->
          <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <i data-lucide="goal" class="w-4 h-4 text-emerald-500"></i> Gol Krallığı
              </h3>
              <span class="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Top 5 Golcü</span>
            </div>
            <div class="space-y-4">
              ${STATE.scorers.slice(0, 5).map((player, idx) => {
    const team = STATE.teams.find(t => t.id === player.teamId);
    const maxGoals = STATE.scorers[0] ? STATE.scorers[0].goals : 1;
    const percent = Math.max(10, (player.goals / maxGoals) * 100);

    return `
                  <div class="text-xs font-semibold">
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-2">
                        <span class="text-slate-400 w-3 font-bold">${idx + 1}</span>
                        <span class="text-slate-800 font-bold">${player.name}</span>
                        <span class="text-[9px] bg-slate-100 text-slate-500 px-1 rounded font-bold">${team.shortName}</span>
                      </div>
                      <span class="text-emerald-600 font-black text-xs">${player.goals} Gol</span>
                    </div>
                    <!-- Progress bar -->
                    <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${percent}%"></div>
                    </div>
                  </div>
                `;
  }).join('')}
            </div>
            <!-- Go to standings button -->
            <button onclick="navigateTo('nav-standings')" class="w-full mt-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-center text-[10px] font-extrabold text-slate-600 hover:text-slate-800 transition-all cursor-pointer">
              Tüm Krallık Listesini Göster
            </button>
          </div>

        </div>

      </div>

    </div>
  `;

  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// ================= TEAM CRUD HELPERS =================

function getMoraleColor(morale) {
  if (morale >= 70) return 'bg-emerald-500';
  if (morale >= 45) return 'bg-amber-400';
  return 'bg-rose-500';
}

function getMoraleLabel(morale) {
  if (morale >= 70) return 'Yüksek';
  if (morale >= 45) return 'Orta';
  return 'Düşük';
}

function generateTeamId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6) + '_' + Date.now().toString(36).slice(-4);
}

function handleLogoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('logo-preview-img').src = e.target.result;
    document.getElementById('logo-preview-img').classList.remove('hidden');
    document.getElementById('logo-preview-placeholder').classList.add('hidden');
    document.getElementById('logo-preview-data').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleAddTeam() {
  const name = document.getElementById('crud-team-name').value.trim();
  const shortName = document.getElementById('crud-short-name').value.trim().toUpperCase().substring(0, 4);
  const year = parseInt(document.getElementById('crud-founding-year').value) || 2000;
  const color = document.getElementById('crud-color').value;
  const power = parseInt(document.getElementById('crud-power').value) || 75;
  const logoUrl = document.getElementById('logo-preview-data').value || '';

  if (!name || !shortName) {
    alert('Takım adı ve kısa ad zorunludur!');
    return;
  }

  if (STATE.editingTeamId) {
    // UPDATE existing team
    const team = STATE.teams.find(t => t.id === STATE.editingTeamId);
    if (team) {
      team.name = name;
      team.shortName = shortName;
      team.foundingYear = year;
      team.color = color;
      team.power = power;
      if (logoUrl) team.logoUrl = logoUrl;
    }
    STATE.editingTeamId = null;
  } else {
    // ADD new team
    const newId = generateTeamId(name);
    const logoColor = 'bg-slate-700 border-slate-500';
    STATE.teams.push({
      id: newId, name, shortName, power,
      foundingYear: year, color, morale: 50,
      logoColor, textLight: 'text-slate-100',
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
      form: [], manager: 'Bilinmiyor', stadium: '-', capacity: '-',
      logoUrl
    });
    // Add empty player roster
    PLAYER_NAMES[newId] = ['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3'];
  }

  // Regenerate fixtures whenever team list changes
  generateFixtures();
  sortStandings();
  updateNavbarIndicators();
  renderTeams();
}

function handleEditTeam(teamId) {
  SOUNDS.playClick();
  const team = STATE.teams.find(t => t.id === teamId);
  if (!team) return;

  STATE.editingTeamId = teamId;

  document.getElementById('crud-team-name').value = team.name;
  document.getElementById('crud-short-name').value = team.shortName;
  document.getElementById('crud-founding-year').value = team.foundingYear || '';
  document.getElementById('crud-color').value = team.color || '#10b981';
  document.getElementById('crud-power').value = team.power;
  document.getElementById('crud-power-display').textContent = team.power;
  document.getElementById('logo-preview-data').value = team.logoUrl || '';

  if (team.logoUrl) {
    document.getElementById('logo-preview-img').src = team.logoUrl;
    document.getElementById('logo-preview-img').classList.remove('hidden');
    document.getElementById('logo-preview-placeholder').classList.add('hidden');
  }

  document.getElementById('crud-form-title').textContent = 'Takımı Düzenle';
  document.getElementById('crud-submit-btn').textContent = 'Güncelle';
  document.getElementById('crud-cancel-btn').classList.remove('hidden');
  document.getElementById('crud-team-name').focus();
  document.getElementById('crud-form-section').scrollIntoView({ behavior: 'smooth' });
}

function handleDeleteTeam(teamId) {
  SOUNDS.playClick();
  const team = STATE.teams.find(t => t.id === teamId);
  if (!team) return;
  if (!confirm(`"${team.name}" takımını silmek istediğinizden emin misiniz?`)) return;

  STATE.teams = STATE.teams.filter(t => t.id !== teamId);
  STATE.scorers = STATE.scorers.filter(s => s.teamId !== teamId);
  delete PLAYER_NAMES[teamId];

  generateFixtures();
  sortStandings();
  updateNavbarIndicators();
  renderTeams();
}

function handleCrudCancel() {
  STATE.editingTeamId = null;
  document.getElementById('crud-form-title').textContent = 'Yeni Takım Ekle';
  document.getElementById('crud-submit-btn').textContent = 'Takımı Ekle';
  document.getElementById('crud-cancel-btn').classList.add('hidden');
  document.getElementById('crud-team-name').value = '';
  document.getElementById('crud-short-name').value = '';
  document.getElementById('crud-founding-year').value = '';
  document.getElementById('crud-color').value = '#10b981';
  document.getElementById('crud-power').value = 75;
  document.getElementById('crud-power-display').textContent = '75';
  document.getElementById('logo-preview-data').value = '';
  document.getElementById('logo-preview-img').classList.add('hidden');
  document.getElementById('logo-preview-placeholder').classList.remove('hidden');
}

// 2. TAKIMLAR SAYFASI RENDERER (Full CRUD)
function renderTeams() {
  const content = `
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Takım Yönetimi</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">${STATE.teams.length} takım · CRUD işlemleri · Fikstür otomatik güncellenir</p>
    </div>

    <!-- TWO-COLUMN LAYOUT: CRUD form (left) + teams list (right) -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">

      <!-- ===== ADD/EDIT FORM ===== -->
      <div id="crud-form-section" class="xl:col-span-1">
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sticky top-4">
          <h3 id="crud-form-title" class="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-500"></i> Yeni Takım Ekle
          </h3>
          
          <!-- Logo Upload -->
          <div class="mb-5">
            <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Takım Logosu</label>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden">
                <img id="logo-preview-img" src="" alt="Logo" class="w-full h-full object-contain hidden">
                <span id="logo-preview-placeholder" class="text-slate-300 text-2xl">🛡️</span>
              </div>
              <label class="flex-1 cursor-pointer">
                <span class="block text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Görsel Seç (PNG/JPG/SVG)</span>
                <span class="block text-[10px] text-slate-400 font-medium mt-0.5">Maks 2MB · Kare önerilir</span>
                <input type="file" accept="image/*" class="hidden" onchange="handleLogoUpload(this)">
              </label>
            </div>
            <input type="hidden" id="logo-preview-data" value="">
          </div>

          <div class="space-y-4">
            <!-- Team Name -->
            <div>
              <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">Takım Adı <span class="text-rose-500">*</span></label>
              <input type="text" id="crud-team-name" placeholder="Örn: Fenerbahçe SK"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-xs text-slate-800 px-3.5 py-3 rounded-xl outline-none transition-all font-semibold">
            </div>
            
            <!-- Short Name -->
            <div>
              <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">Kısa Ad <span class="text-rose-500">*</span></label>
              <input type="text" id="crud-short-name" placeholder="Örn: FB" maxlength="4"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-xs text-slate-800 px-3.5 py-3 rounded-xl outline-none transition-all font-semibold">
            </div>

            <!-- Founding Year -->
            <div>
              <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">Kuruluş Yılı</label>
              <input type="number" id="crud-founding-year" placeholder="Örn: 1907" min="1850" max="2024"
                class="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-xs text-slate-800 px-3.5 py-3 rounded-xl outline-none transition-all font-semibold">
            </div>

            <!-- Primary Color -->
            <div>
              <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">Ana Renk</label>
              <div class="flex items-center gap-3">
                <input type="color" id="crud-color" value="#10b981"
                  class="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer bg-slate-50 p-1">
                <span class="text-xs font-bold text-slate-600">Takımın birincil forma rengi</span>
              </div>
            </div>

            <!-- Power Slider -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Kadro Gücü</label>
                <span id="crud-power-display" class="text-xs font-black text-emerald-600">75</span>
              </div>
              <input type="range" id="crud-power" min="60" max="99" value="75"
                oninput="document.getElementById('crud-power-display').textContent = this.value"
                class="w-full accent-emerald-500 cursor-pointer">
              <div class="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                <span>Zayıf (60)</span><span>Güçlü (99)</span>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-6">
            <button onclick="handleAddTeam()" id="crud-submit-btn"
              class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Takımı Ekle
            </button>
            <button onclick="handleCrudCancel()" id="crud-cancel-btn"
              class="hidden px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer">
              İptal
            </button>
          </div>
        </div>
      </div>

      <!-- ===== TEAMS LIST ===== -->
      <div class="xl:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">${STATE.teams.length} Takım Kayıtlı</span>
          <span class="text-[10px] font-semibold text-slate-400">Listeye tıklayarak detay görüntüleyin</span>
        </div>
        
        ${STATE.teams.length === 0 ? `
          <div class="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
            <div class="text-4xl mb-4">⚽</div>
            <h3 class="text-sm font-bold text-slate-700 mb-1">Henüz takım eklenmemiş</h3>
            <p class="text-xs text-slate-400 font-medium">Soldaki formu kullanarak ilk takımı ekleyin.</p>
          </div>
        ` : `
          <div class="space-y-3">
            ${STATE.teams.map((team, idx) => {
    const rank = idx + 1;
    const moraleColor = getMoraleColor(team.morale);
    const moraleLabel = getMoraleLabel(team.morale);
    const logoSrc = team.logoUrl || (LOGO_URLS[team.id] || '');
    return `
                <div class="bg-white border border-slate-100 hover:border-emerald-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                  <!-- Rank -->
                  <span class="text-xs font-black text-slate-400 w-5 text-center shrink-0">${rank}</span>
                  
                  <!-- Logo -->
                  ${getTeamLogoHTML(team, 'w-11 h-11 text-sm')}
                  
                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-extrabold text-slate-900 truncate">${team.name}</h4>
                      <span class="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">${team.shortName}</span>
                    </div>
                    <div class="flex items-center gap-3 mt-1">
                      <span class="text-[10px] text-slate-400 font-semibold">Kuruluş: ${team.foundingYear || '—'}</span>
                      <span class="text-[10px] text-slate-400 font-semibold">Güç: <span class="text-slate-700 font-black">${team.power}</span></span>
                      <span class="flex items-center gap-1 text-[10px] font-semibold">
                        <span class="w-2 h-2 rounded-full ${moraleColor} inline-block"></span>
                        <span class="text-slate-500">Moral: ${moraleLabel} (${team.morale})</span>
                      </span>
                    </div>
                  </div>

                  <!-- Color Swatch -->
                  <div class="w-5 h-5 rounded-full border-2 border-white shadow shrink-0" style="background:${team.color || '#64748b'}"></div>

                  <!-- Stats -->
                  <div class="hidden sm:grid grid-cols-4 gap-3 text-center text-[10px] font-bold shrink-0">
                    <div><span class="text-slate-400 block">O</span><span class="text-slate-800">${team.played}</span></div>
                    <div><span class="text-slate-400 block">G</span><span class="text-emerald-600">${team.won}</span></div>
                    <div><span class="text-slate-400 block">M</span><span class="text-rose-500">${team.lost}</span></div>
                    <div><span class="text-slate-400 block">P</span><span class="text-slate-900 font-black">${team.points}</span></div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2 shrink-0">
                    <button onclick="handleEditTeam('${team.id}')" title="Düzenle"
                      class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer">
                      <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="handleDeleteTeam('${team.id}')" title="Sil"
                      class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `;
  }).join('')}
          </div>
        `}
      </div>
    </div>
  `;
  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// 3. FİKSTÜR SAYFASI RENDERER
function renderFixtures(selectedWeek = STATE.currentWeek) {
  let options = "";
  for (let w = 1; w <= STATE.maxWeeks; w++) {
    options += `<option value="${w}" ${w === Number(selectedWeek) ? 'selected' : ''}>${w}. Hafta Karşılaşmaları</option>`;
  }

  const weekMatches = STATE.fixtures[selectedWeek - 1] || [];

  const content = `
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Fikstür</h2>
        <p class="text-xs text-slate-500 font-medium mt-1">Sezonun tüm haftalık fikstürü ve simüle edilen skorlar</p>
      </div>
      
      <!-- Dropdown picker -->
      <div class="relative w-full sm:w-64">
        <select id="fixture-week-select" onchange="handleWeekSelect(this.value)" class="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm cursor-pointer appearance-none">
          ${options}
        </select>
        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
      </div>
    </div>

    <!-- FIXTURE BOXES GRID -->
    <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Karşılaşma Detayları</span>
        <span class="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">
          ${selectedWeek}. Hafta
        </span>
      </div>

      <div class="divide-y divide-slate-100">
        ${weekMatches.length === 0 ? `
          <div class="py-12 text-center text-slate-400 font-bold text-xs">
            Hafta verisi bulunamadı.
          </div>
        ` : weekMatches.map(m => {
    const home = STATE.teams.find(t => t.id === m.homeId);
    const away = STATE.teams.find(t => t.id === m.awayId);
    const isPlayed = m.played;

    return `
            <div class="py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <!-- Left: Date/Time Info -->
              <div class="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5 sm:w-2/12">
                <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase border border-slate-200/35">${m.date}</span>
                <span class="text-slate-400 text-[10px] font-semibold">${m.time}</span>
              </div>
              
              <!-- Center Matchup -->
              <div class="flex items-center justify-center gap-4 w-full sm:w-8/12">
                <!-- Home Team -->
                <div class="flex items-center gap-2.5 w-5/12 justify-end">
                  <span class="text-slate-800 text-right truncate text-xs font-bold">${home.name}</span>
                  ${getTeamLogoHTML(home, "w-8 h-8 text-xs")}
                </div>
                
                <!-- Score / VS Box -->
                ${isPlayed ? `
                  <div class="flex items-center justify-center gap-3 w-2/12 font-black text-slate-900 text-sm bg-slate-100/80 border border-slate-200/30 px-3 py-1.5 rounded-lg shrink-0">
                    <span>${m.homeScore}</span>
                    <span class="text-slate-400 font-normal">-</span>
                    <span>${m.awayScore}</span>
                  </div>
                ` : `
                  <div class="flex items-center justify-center w-2/12 font-bold text-[10px] text-slate-400 bg-slate-50 border border-slate-200/50 px-3 py-1.5 rounded-lg shrink-0 select-none uppercase tracking-widest">
                    VS
                  </div>
                `}
                
                <!-- Away Team -->
                <div class="flex items-center gap-2.5 w-5/12 justify-start">
                  ${getTeamLogoHTML(away, "w-8 h-8 text-xs")}
                  <span class="text-slate-800 text-left truncate text-xs font-bold">${away.name}</span>
                </div>
              </div>
              
              <!-- Right: Status Badge -->
              <div class="sm:w-2/12 flex justify-end shrink-0">
                ${isPlayed ? `
                  <span class="bg-slate-100 text-slate-400 px-2 py-1 rounded text-[9px] font-bold border border-slate-200/40 uppercase">BİTTİ</span>
                ` : `
                  <span class="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[9px] font-black border border-emerald-100 uppercase tracking-wide">Bekliyor</span>
                `}
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;
  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// 4. PUAN DURUMU SAYFASI RENDERER
function renderStandings() {
  const content = `
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Puan Durumu</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">LaLiga Lig Tablosu ve Gol Krallığı Liderleri</p>
    </div>

    <!-- MAIN TWO-COLUMN LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- LEFT COLUMN: Professional Lig Tablosu -->
      <div class="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Lig Sıralaması</span>
          <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200/60">
            # ${STATE.currentWeek - 1}. Hafta Sonrası
          </span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-bold text-slate-800">
            <thead>
              <tr class="text-slate-400 border-b border-slate-100 uppercase text-[9px] tracking-wider font-extrabold">
                <th class="pb-3 w-10 text-center">#</th>
                <th class="pb-3 pl-3">TAKIM</th>
                <th class="pb-3 text-center w-8" title="Oynanan">O</th>
                <th class="pb-3 text-center w-8" title="Galibiyet">G</th>
                <th class="pb-3 text-center w-8" title="Beraberlik">B</th>
                <th class="pb-3 text-center w-8" title="Mağlubiyet">M</th>
                <th class="pb-3 text-center w-8" title="Atılan Gol">A</th>
                <th class="pb-3 text-center w-8" title="Yenilen Gol">Y</th>
                <th class="pb-3 text-center w-8" title="Averaj">AV</th>
                <th class="pb-3 text-center w-10" title="Puan">P</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${STATE.teams.map((team, idx) => {
    let zoneClass = "";
    const numTeams = STATE.teams.length;
    if (idx < 4) zoneClass = "zone-cl";
    else if (idx < 6) zoneClass = "zone-el";
    else if (idx >= numTeams - 3) zoneClass = "zone-relegation";

    const rank = idx + 1;
    let bgRank = "text-slate-500";
    if (rank === 1) bgRank = "text-amber-500 text-sm";

    return `
                  <tr class="hover:bg-slate-50 cursor-pointer ${zoneClass} transition-colors" onclick="showTeamModal('${team.id}')">
                    <td class="py-3 text-center font-black ${bgRank} w-10 pl-2">
                      ${rank === 1 ? `<i data-lucide="star" class="w-3.5 h-3.5 fill-amber-500 text-amber-500 inline-block"></i>` : rank}
                    </td>
                    <td class="py-3 flex items-center gap-2.5 pl-3">
                      ${getTeamLogoHTML(team, "w-7 h-7 text-[10px]")}
                      <span class="text-slate-900 text-xs font-bold leading-none">${team.name}</span>
                    </td>
                    <td class="py-3 text-center text-slate-500 w-8 font-medium">${team.played}</td>
                    <td class="py-3 text-center text-emerald-700 w-8 font-medium">${team.won}</td>
                    <td class="py-3 text-center text-amber-600 w-8 font-medium">${team.drawn}</td>
                    <td class="py-3 text-center text-rose-500 w-8 font-medium">${team.lost}</td>
                    <td class="py-3 text-center text-slate-500 w-8 font-medium">${team.goalsFor}</td>
                    <td class="py-3 text-center text-slate-500 w-8 font-medium">${team.goalsAgainst}</td>
                    <td class="py-3 text-center text-slate-500 w-8 font-semibold">${team.goalDiff > 0 ? '+' : ''}${team.goalDiff}</td>
                    <td class="py-3 text-center text-emerald-600 font-extrabold text-sm w-10">${team.points}</td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Standing color legends at the bottom matching anasayfa.jpg precisely -->
        <div class="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-5 mt-6 text-[10px] font-extrabold text-slate-500">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Şampiyonlar Ligi</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Avrupa Ligi</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Küme Düşme</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Lider & Gol Krallığı -->
      <div class="space-y-8">
        <!-- Lider Takım Form -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i data-lucide="crown" class="w-4 h-4 text-amber-500"></i> Lider Takım Özet
            </h3>
            <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold border border-emerald-100">Aktif</span>
          </div>
          
          ${(() => {
      const leader = getLeaderTeam();
      return `
              <div class="flex items-center gap-4 mb-4">
                ${getTeamLogoHTML(leader, "w-14 h-14 text-base")}
                <div>
                  <h4 class="text-sm font-extrabold text-slate-900">${leader.name}</h4>
                  <p class="text-[10px] text-slate-400 font-semibold mt-0.5">La Liga Lideri</p>
                  <div class="flex gap-1 mt-2">
                    ${renderFormBadges(leader.form)}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                <div>
                  <h5 class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Puan</h5>
                  <p class="text-base font-black text-slate-900">${leader.points}</p>
                </div>
                <div>
                  <h5 class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Galibiyet</h5>
                  <p class="text-base font-black text-slate-900">${leader.won}</p>
                </div>
                <div>
                  <h5 class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Averaj</h5>
                  <p class="text-base font-black text-slate-900">+${leader.goalDiff}</p>
                </div>
              </div>
            `;
    })()}
        </div>

        <!-- Gol Krallığı Tablosu -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i data-lucide="goal" class="w-4 h-4 text-emerald-500"></i> Gol Krallığı
            </h3>
            <i data-lucide="award" class="w-4 h-4 text-slate-400"></i>
          </div>
          <div class="space-y-4">
            ${STATE.scorers.slice(0, 5).map((player, idx) => {
      const team = STATE.teams.find(t => t.id === player.teamId);
      // Max goals for progress bar logic
      const maxGoals = STATE.scorers[0].goals;
      const percent = Math.max(10, (player.goals / maxGoals) * 100);

      return `
                <div class="text-xs font-semibold">
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400 w-3 font-bold">${idx + 1}</span>
                      <span class="text-slate-800 font-bold">${player.name}</span>
                      <span class="text-[9px] bg-slate-100 text-slate-500 px-1 rounded font-bold">${team.shortName}</span>
                    </div>
                    <span class="text-emerald-600 font-black text-sm">${player.goals} gol</span>
                  </div>
                  <!-- Progress bar -->
                  <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${percent}%"></div>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// 5. SIMULATION PAGE RENDERER
function renderSimulation() {
  const isFinished = STATE.currentWeek > STATE.maxWeeks;
  const content = `
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Simülasyon Paneli</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">İleri düzey lig kontrol araçları ve istatistik logları</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Simulation Parameters -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <i data-lucide="sliders" class="w-4 h-4 text-emerald-500"></i> Simülasyon Kontrolleri
        </h3>
        
        <!-- Simulation Status Card -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Aktif Durum</span>
            <span class="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black uppercase">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Hazır
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span class="text-[9px] font-bold text-slate-400 block mb-0.5">Mevcut Hafta</span>
              <span class="text-base font-black text-slate-800">${isFinished ? 'Sezon Bitti' : STATE.currentWeek + '. Hafta'}</span>
            </div>
            <div>
              <span class="text-[9px] font-bold text-slate-400 block mb-0.5">Kalan Hafta</span>
              <span class="text-base font-black text-slate-800">${Math.max(0, STATE.maxWeeks - STATE.currentWeek + 1)} Hafta</span>
            </div>
          </div>
        </div>

        <!-- Buttons Panel -->
        <div class="space-y-3 pt-2">
          <button onclick="handleSimulateWeek()" ${isFinished ? 'disabled' : ''} class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-btn cursor-pointer transition-all">
            <i data-lucide="play" class="w-4 h-4"></i> Haftayı Simüle Et
          </button>
          
          <button onclick="handleSimulateSeason()" ${isFinished ? 'disabled' : ''} class="w-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <i data-lucide="fast-forward" class="w-4 h-4"></i> Tüm Sezonu Oynat
          </button>
          
          <button onclick="resetSimulation()" class="w-full bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Tüm Simülasyonu Sıfırla
          </button>
        </div>
      </div>

      <!-- Right: Live ticker match log -->
      <div class="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col h-[400px]">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <i data-lucide="terminal" class="w-4 h-4 text-slate-400"></i> Simülasyon Akış Logları
          </h3>
          <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Canlı Güncellemeler</span>
        </div>
        
        <!-- Log ticker area -->
        <div id="sim-ticker-logs" class="flex-1 overflow-y-auto space-y-2.5 font-mono text-[11px] text-slate-600 pr-2">
          ${STATE.history.length === 0 ? `
            <div class="h-full flex items-center justify-center text-slate-400 font-bold">
              Henüz simüle edilmiş hafta bulunmuyor. Kontrolleri kullanarak ligi oynatın.
            </div>
          ` : STATE.history.map(hist => {
    return `
              <div class="border-b border-slate-100 pb-3">
                <div class="text-[10px] font-bold text-emerald-600 mb-1">=== ${hist.week}. HAFTA SONUÇLARI ===</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  ${hist.matches.map(m => {
      const h = STATE.teams.find(t => t.id === m.homeId);
      const a = STATE.teams.find(t => t.id === m.awayId);
      return `
                      <div class="flex justify-between hover:bg-slate-50 px-1 rounded transition-colors">
                        <span class="truncate">${h.name} - ${a.name}</span>
                        <span class="font-bold text-slate-900 text-right shrink-0">${m.homeScore} - ${m.awayScore}</span>
                      </div>
                    `;
    }).join('')}
                </div>
              </div>
            `;
  }).reverse().join('')}
        </div>
      </div>
    </div>
  `;
  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// 6. AYARLAR SAYFASI RENDERER
function renderSettings() {
  const content = `
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Ayarlar</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">Simülasyon parametreleri ve ses tercihleri</p>
    </div>

    <div class="max-w-2xl bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
      <div>
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i data-lucide="volume-2" class="w-4 h-4 text-emerald-500"></i> Ses Tercihleri
        </h3>
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-150">
          <div>
            <h4 class="text-xs font-bold text-slate-800">Ses Efektleri</h4>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Maç düdükleri ve gol bildirimleri sentezleyici sesler</p>
          </div>
          <!-- Toggle checkbox slider -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="settings-sound-toggle" onchange="toggleSound(this.checked)" class="sr-only peer" ${STATE.soundEnabled ? 'checked' : ''}>
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-6">
        <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <i data-lucide="sliders-horizontal" class="w-4 h-4 text-emerald-500"></i> Simülasyon Motoru Parametreleri
        </h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-600">Ev Sahibi Güç Avantajı</span>
              <span class="text-slate-900 font-black">+3 Puan (Standart)</span>
            </div>
            <p class="text-[10px] text-slate-400 font-medium">Ev sahibi takımların maç simülasyonunda gücüne eklenen ekstra katsayı.</p>
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-600">Hata Oranı / Sürpriz Olasılığı</span>
              <span class="text-slate-900 font-black">%25 (Kararlı)</span>
            </div>
            <p class="text-[10px] text-slate-400 font-medium">Düşük güce sahip takımların sürpriz yapma şansını kontrol eden rastgelelik payı.</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-slate-100 pt-6 flex justify-end gap-3">
        <button onclick="SOUNDS.playGoal()" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer">
          Test Sesi Çal
        </button>
        <button onclick="navigateTo('nav-home')" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer">
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  `;
  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// 7. DESTEK SAYFASI RENDERER
function renderSupport() {
  const content = `
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Destek</h2>
      <p class="text-xs text-slate-500 font-medium mt-1">Sıkça sorulan sorular ve simülatör kullanım kılavuzu</p>
    </div>

    <div class="max-w-3xl space-y-6">
      <!-- QA Card 1 -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <h4 class="text-xs font-extrabold text-slate-900 mb-2">⚽ Simülasyon Motoru Nasıl Çalışıyor?</h4>
        <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
          Simülasyon motoru, her iki takımın orijinal LaLiga kadrolarının güç seviyelerini temel alır. Bu güce +3 puanlık ev sahibi avantajı eklenir. Goller, takımların ofansif ve defansif katsayıları eşleştirilerek olasılıksal Poisson modelleriyle oluşturulur. Bu sayede her maç farklı sonuçlanabilir ve sürpriz sonuçlar ortaya çıkabilir!
        </p>
      </div>

      <!-- QA Card 2 -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <h4 class="text-xs font-extrabold text-slate-900 mb-2">🏆 Puan Durumu Renk Çizgileri Ne Anlama Geliyor?</h4>
        <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
          Orijinal LaLiga lig tablosuna uygun olarak sol kenarda renkli bölge sınırları yer alır:
          <br><strong class="text-emerald-500">Yeşil Çizgi (1 - 4. sıralar):</strong> Şampiyonlar Ligi'ne katılım barajı.
          <br><strong class="text-blue-500">Mavi Çizgi (5 - 6. sıralar):</strong> Avrupa Ligi'ne katılım barajı.
          <br><strong class="text-red-500">Kırmızı Çizgi (18 - 20. sıralar):</strong> Küme Düşme hattı.
        </p>
      </div>

      <!-- QA Card 3 -->
      <div class="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <h4 class="text-xs font-extrabold text-slate-900 mb-2">🔊 Ses Efektleri Nasıl Kapatılır?</h4>
        <p class="text-[11px] text-slate-500 font-medium leading-relaxed">
          Sistemin ürettiği interaktif ses efektlerini tamamen susturmak için sol menüden <strong class="text-slate-700">Ayarlar</strong> paneline giderek Ses Efektleri anahtarını (Toggle) kapatabilirsiniz.
        </p>
      </div>
    </div>
  `;
  document.getElementById("content-area").innerHTML = content;
  lucide.createIcons();
}

// ================= MATCH CENTER TICKER TICK =================

function showLiveTickerOverlay(weekIndex, matchesToSimulate, callback) {
  SOUNDS.playWhistle();

  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 page-fade-in";

  overlay.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-100 max-w-2xl w-full p-8 shadow-2xl flex flex-col h-[520px] transform scale-100 transition-all">
      <div class="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">MAÇ MERKEZİ</span>
          <h3 class="text-lg font-black text-slate-900 leading-none">${weekIndex}. Hafta Karşılaşmaları Oynanıyor...</h3>
        </div>
        <div class="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-black border border-emerald-100">
          <span class="live-pulse"></span>
          CANLI SİMÜLASYON
        </div>
      </div>
      
      <!-- Match lists -->
      <div id="ticker-match-rows" class="flex-1 overflow-y-auto space-y-4 pr-1">
        <!-- Rendered dynamically during live ticks -->
      </div>
      
      <!-- Footer Status progress bar -->
      <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
        <div class="w-1/2">
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div id="ticker-progress-bar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
        <span id="ticker-status-text" class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Dakika 0'</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Create live match templates for all 9 matches of the week
  const tickerRows = document.getElementById("ticker-match-rows");
  const matchesData = matchesToSimulate.map(m => {
    const home = STATE.teams.find(t => t.id === m.homeId);
    const away = STATE.teams.find(t => t.id === m.awayId);
    return {
      home,
      away,
      homeScore: 0,
      awayScore: 0,
      finalHomeScore: m.homeScore,
      finalAwayScore: m.awayScore,
      events: []
    };
  });

  // Render match row skeletons
  tickerRows.innerHTML = matchesData.map((m, idx) => {
    return `
      <div id="live-row-${idx}" class="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-xl transition-all">
        <!-- Home team -->
        <div class="flex items-center gap-3 w-5/12 justify-end">
          <span class="text-slate-800 truncate text-xs font-bold leading-none">${m.home.name}</span>
          ${getTeamLogoHTML(m.home, "w-8 h-8 text-xs")}
        </div>
        <!-- Live Score -->
        <div class="flex items-center justify-center gap-3 w-2/12 bg-slate-50 border border-slate-200/50 py-1.5 px-3 rounded-lg">
          <span id="live-home-score-${idx}" class="text-sm font-black text-slate-800">0</span>
          <span class="text-slate-300 font-normal">-</span>
          <span id="live-away-score-${idx}" class="text-sm font-black text-slate-800">0</span>
        </div>
        <!-- Away team -->
        <div class="flex items-center gap-3 w-5/12 justify-start">
          ${getTeamLogoHTML(m.away, "w-8 h-8 text-xs")}
          <span class="text-slate-800 truncate text-xs font-bold leading-none">${m.away.name}</span>
        </div>
      </div>
    `;
  }).join('');

  // Tick-based match duration (0 to 90 minutes)
  let minute = 0;
  const totalDuration = 90;
  const tickRate = 40; // ms per minute, fast sim!

  const timer = setInterval(() => {
    minute += 3;

    // Update progress
    const progressPercent = (minute / totalDuration) * 100;
    document.getElementById("ticker-progress-bar").style.width = `${progressPercent}%`;
    document.getElementById("ticker-status-text").innerText = `Dakika ${minute}'`;

    // Random goal distribution along the game ticks
    matchesData.forEach((m, idx) => {
      // Home goal
      if (m.homeScore < m.finalHomeScore && Math.random() < 0.15) {
        m.homeScore += 1;
        document.getElementById(`live-home-score-${idx}`).innerText = m.homeScore;
        document.getElementById(`live-row-${idx}`).classList.add("bg-emerald-50");
        SOUNDS.playGoal();
        setTimeout(() => {
          document.getElementById(`live-row-${idx}`).classList.remove("bg-emerald-50");
        }, 300);
      }
      // Away goal
      if (m.awayScore < m.finalAwayScore && Math.random() < 0.15) {
        m.awayScore += 1;
        document.getElementById(`live-away-score-${idx}`).innerText = m.awayScore;
        document.getElementById(`live-row-${idx}`).classList.add("bg-emerald-50");
        SOUNDS.playGoal();
        setTimeout(() => {
          document.getElementById(`live-row-${idx}`).classList.remove("bg-emerald-50");
        }, 300);
      }
    });

    if (minute >= totalDuration) {
      clearInterval(timer);
      SOUNDS.playWhistle();

      // Finalize exact scores on screen
      matchesData.forEach((m, idx) => {
        document.getElementById(`live-home-score-${idx}`).innerText = m.finalHomeScore;
        document.getElementById(`live-away-score-${idx}`).innerText = m.finalAwayScore;
      });

      document.getElementById("ticker-status-text").innerHTML = `<span class="text-rose-600 font-black">MS BİTTİ</span>`;

      // Hold overlay for 1.5 seconds then close
      setTimeout(() => {
        overlay.classList.add("opacity-0");
        setTimeout(() => {
          overlay.remove();
          callback();
        }, 300);
      }, 1500);
    }
  }, tickRate);
}

// ================= INTERACTIVE INTERACTION HANDLERS =================

function handleSimulateWeek() {
  if (STATE.currentWeek > STATE.maxWeeks) {
    alert("Sezon tamamlandı! Fikstürü sıfırlayıp yeniden oynayabilirsiniz.");
    return;
  }

  STATE.isSimulating = true;

  // Pre-compute current week simulation results secretly
  const weekIdx = STATE.currentWeek;
  simulateWeek(weekIdx);

  // Pull simulated results for this week
  const simulatedMatches = STATE.fixtures[weekIdx - 1];

  // Launch the live action ticker
  showLiveTickerOverlay(weekIdx, simulatedMatches, () => {
    STATE.currentWeek += 1;
    STATE.isSimulating = false;

    // Update navbar indicators
    updateNavbarIndicators();

    // Re-render current page to show new standings and scores
    const activeNav = document.querySelector(".nav-active");
    if (activeNav) {
      const activeId = activeNav.id;
      navigateTo(activeId);
    }

    // Check if season just finished and celebrate
    if (STATE.currentWeek > STATE.maxWeeks) {
      triggerChampionshipCelebration();
    }
  });
}

function handleSimulateSeason() {
  if (STATE.currentWeek > STATE.maxWeeks) {
    alert("Sezon tamamlandı!");
    return;
  }

  SOUNDS.playWhistle();

  // Fast simulation of all remaining weeks
  const startWeek = STATE.currentWeek;
  const endWeek = STATE.maxWeeks;

  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 page-fade-in";
  overlay.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-8 shadow-2xl text-center space-y-5">
      <i data-lucide="zap" class="w-12 h-12 text-emerald-500 mx-auto animate-bounce"></i>
      <div>
        <h3 class="text-base font-extrabold text-slate-900">Sezon Hızlı Simüle Ediliyor...</h3>
        <p class="text-[10px] text-slate-400 font-semibold mt-1">Hafta ${startWeek} - Hafta ${endWeek} oynanıyor</p>
      </div>
      <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div id="season-progress" class="bg-emerald-500 h-full rounded-full transition-all duration-100" style="width: 0%"></div>
      </div>
      <span id="season-progress-text" class="text-[11px] font-black text-slate-500 uppercase tracking-widest block">HAFTA ${startWeek}</span>
    </div>
  `;
  document.body.appendChild(overlay);
  lucide.createIcons();

  let w = startWeek;
  const interval = setInterval(() => {
    simulateWeek(w);
    w += 1;

    const progress = ((w - startWeek) / (endWeek - startWeek + 1)) * 100;
    document.getElementById("season-progress").style.width = `${progress}%`;
    document.getElementById("season-progress-text").innerText = `HAFTA ${Math.min(endWeek, w)}`;

    if (w > endWeek) {
      clearInterval(interval);
      STATE.currentWeek = endWeek + 1;

      // Close overlay
      setTimeout(() => {
        overlay.remove();
        updateNavbarIndicators();

        // Re-render
        const activeNav = document.querySelector(".nav-active");
        if (activeNav) navigateTo(activeNav.id);

        // Championship fanfare
        triggerChampionshipCelebration();
      }, 500);
    }
  }, 120);
}

function triggerChampionshipCelebration() {
  SOUNDS.playTrophy();
  const leader = getLeaderTeam();
  const topScorer = STATE.scorers[0];
  const totalGoals = STATE.teams.reduce((a, t) => a + t.goalsFor, 0);
  const topScorerTeam = topScorer ? STATE.teams.find(t => t.id === topScorer.teamId) : null;

  const celebration = document.createElement("div");
  celebration.className = "fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 page-fade-in overflow-y-auto";
  celebration.innerHTML = `
    <div class="bg-white rounded-3xl border border-amber-100 max-w-lg w-full p-8 shadow-2xl text-center relative overflow-hidden champion-modal">
      <!-- Animated top gradient bar -->
      <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 animate-pulse"></div>
      <!-- Confetti dots decorative -->
      <div class="absolute top-4 left-6 w-2 h-2 rounded-full bg-yellow-400 opacity-60"></div>
      <div class="absolute top-8 left-16 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60"></div>
      <div class="absolute top-4 right-6 w-2 h-2 rounded-full bg-red-400 opacity-60"></div>
      <div class="absolute top-10 right-14 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60"></div>
      
      <!-- Trophy Icon -->
      <div class="w-24 h-24 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-200 shadow-lg shadow-amber-200/50">
        <i data-lucide="trophy" class="w-12 h-12 text-amber-500"></i>
      </div>
      
      <!-- Champion Team Info -->
      <div class="mb-6">
        <span class="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-2">🏆 ŞAMPİYON 🏆</span>
        <div class="flex items-center justify-center gap-3 mb-3">
          ${getTeamLogoHTML(leader, 'w-14 h-14 text-lg')}
          <h3 class="text-3xl font-black text-slate-900 leading-tight">${leader.name}</h3>
        </div>
        <p class="text-sm text-slate-500 font-semibold">
          <span class="text-emerald-600 font-black text-base">${leader.points}</span> Puan
          &nbsp;·&nbsp; 
          <span class="text-slate-700 font-bold">${leader.won}G ${leader.drawn}B ${leader.lost}M</span>
          &nbsp;·&nbsp;
          <span class="${leader.goalDiff > 0 ? 'text-emerald-600' : 'text-rose-500'} font-bold">${leader.goalDiff > 0 ? '+' : ''}${leader.goalDiff} Averaj</span>
        </p>
      </div>

      <!-- Season Summary Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Toplam Gol</span>
          <span class="text-xl font-black text-slate-900">${totalGoals}</span>
        </div>
        <div>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">En Golcü</span>
          <span class="text-xs font-black text-slate-900">${topScorer ? topScorer.name : '—'}</span>
          <span class="text-[9px] text-slate-400 block">${topScorer ? topScorer.goals + ' gol' : ''}</span>
        </div>
        <div>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sezon</span>
          <span class="text-xs font-black text-slate-900">${STATE.maxWeeks} Hafta</span>
          <span class="text-[9px] text-slate-400 block">${STATE.teams.length} takım</span>
        </div>
      </div>

      <!-- Tebrik Mesajı -->
      <div class="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 text-xs font-semibold text-amber-900 leading-relaxed">
        Tebrikler! ${STATE.maxWeeks} haftalık zorlu sezon tamamlandı. Şampiyonluk kupası <strong>${leader.name}</strong>'a ait!
      </div>
      
      <!-- CTA Buttons -->
      <div class="flex gap-3">
        <button onclick="startNewSeason()" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-btn cursor-pointer transition-all flex items-center justify-center gap-2">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Yeni Sezon Başlat
        </button>
        <button onclick="closeCelebration(this)" class="px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3.5 rounded-xl cursor-pointer transition-all">
          Kapat
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(celebration);
  lucide.createIcons();
}

function closeCelebration(btn) {
  SOUNDS.playClick();
  btn.closest(".fixed").remove();
}

function resetSimulation(shuffleFixtures = false) {
  SOUNDS.playWhistle(400, 0.25);
  if (!confirm("Tüm lig verilerini sıfırlamak ve 1. haftadan başlamak istediğinizden emin misiniz?")) return;

  // Reset season to Week 1 with all stats at zero (spec requirement)
  STATE.currentWeek = 1;
  STATE.history = [];
  STATE.editingTeamId = null;

  // Reset all team stats to zero, restore morale to starting values
  STATE.teams.forEach(t => {
    t.played = 0;
    t.won = 0;
    t.drawn = 0;
    t.lost = 0;
    t.goalsFor = 0;
    t.goalsAgainst = 0;
    t.goalDiff = 0;
    t.points = 0;
    t.form = [];
    t.morale = 50; // Reset morale to neutral
  });

  // Reset scorers to empty (fresh season)
  STATE.scorers = [];

  if (shuffleFixtures) {
    generateFixtures();
  } else {
    // Keep same fixtures but clear goals/played status
    STATE.fixtures.forEach(week => {
      week.forEach(match => {
        match.homeScore = null;
        match.awayScore = null;
        match.played = false;
      });
    });
  }

  sortStandings();
  updateNavbarIndicators();

  const activeNav = document.querySelector(".nav-active");
  if (activeNav) navigateTo(activeNav.id);
}

// New Season: resets stats, shuffles fixtures
function startNewSeason() {
  // Close any open celebration modal first
  document.querySelectorAll('.fixed.bg-slate-900\/80').forEach(el => el.remove());
  resetSimulation(true);
}

function toggleSound(checked) {
  STATE.soundEnabled = checked;
  SOUNDS.playClick();
}

// 7. TEAM DETAILS MODAL RENDERER
function showTeamModal(teamId) {
  SOUNDS.playClick();
  const team = STATE.teams.find(t => t.id === teamId);
  const rank = STATE.teams.findIndex(t => t.id === teamId) + 1;

  const modal = document.getElementById("team-modal");
  const content = document.getElementById("team-modal-content");

  content.innerHTML = `
    <!-- Top banner with team color badge -->
    <div class="h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-between px-6 relative border-b border-slate-150">
      <div class="flex items-center gap-3">
        ${getTeamLogoHTML(team, "w-12 h-12 text-sm border-2 border-white")}
        <div>
          <h3 class="text-base font-extrabold text-slate-900 leading-none">${team.name}</h3>
          <span class="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-1 inline-block">${team.manager}</span>
        </div>
      </div>
      <!-- Rank Badge -->
      <span class="bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-xs px-3 py-1.5 rounded-xl">
        Lig Sırası: #${rank}
      </span>
      <button onclick="closeTeamModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
    
    <!-- Body stats details -->
    <div class="p-6 space-y-5 text-xs font-semibold text-slate-600">
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 bg-slate-50 border border-slate-150 rounded-xl">
          <span class="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Stadyum</span>
          <span class="text-slate-800 font-bold truncate block">${team.stadium}</span>
        </div>
        <div class="p-3 bg-slate-50 border border-slate-150 rounded-xl">
          <span class="text-slate-400 text-[9px] uppercase tracking-wider block mb-0.5">Kapasite</span>
          <span class="text-slate-800 font-bold block">${team.capacity} Seyirci</span>
        </div>
      </div>

      <!-- Standing details -->
      <div class="border-t border-slate-100 pt-4">
        <h4 class="text-slate-800 font-bold mb-3 uppercase tracking-wider text-[10px]">Lig Değerleri</h4>
        <div class="grid grid-cols-4 gap-2 text-center text-[10px]">
          <div class="p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
            <span class="text-slate-400 block mb-0.5">Oynanan</span>
            <span class="text-slate-800 font-black text-xs">${team.played}</span>
          </div>
          <div class="p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
            <span class="text-slate-400 block mb-0.5">Galibiyet</span>
            <span class="text-slate-800 font-black text-xs">${team.won}</span>
          </div>
          <div class="p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
            <span class="text-slate-400 block mb-0.5">Averaj</span>
            <span class="text-slate-800 font-black text-xs">${team.goalDiff > 0 ? '+' : ''}${team.goalDiff}</span>
          </div>
          <div class="p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
            <span class="text-slate-400 block mb-0.5">Puan</span>
            <span class="text-emerald-600 font-black text-xs">${team.points}</span>
          </div>
        </div>
      </div>

      <!-- Form row -->
      <div class="border-t border-slate-100 pt-4 flex items-center justify-between">
        <span class="text-slate-800 font-bold uppercase tracking-wider text-[10px]">Son 5 Maç Formu</span>
        <div class="flex gap-1.5">
          ${renderFormBadges(team.form)}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modal.querySelector(".transform").classList.remove("scale-95");
  }, 10);

  lucide.createIcons();
}

function closeTeamModal() {
  SOUNDS.playClick();
  const modal = document.getElementById("team-modal");
  modal.classList.add("opacity-0");
  modal.querySelector(".transform").classList.add("scale-95");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

// Hook fixture picker handles
function handleWeekSelect(week) {
  SOUNDS.playClick();
  renderFixtures(week);
}

// Update navbar week and notifications
function updateNavbarIndicators() {
  const isFinished = STATE.currentWeek > STATE.maxWeeks;
  document.getElementById("navbar-week-badge").innerText = isFinished ? "# BİTTİ" : `# ${STATE.currentWeek}. Hafta`;
}

// ================= SPA NAVIGATION ENGINE =================

function navigateTo(navId, skipSound = false) {
  if (!skipSound) {
    SOUNDS.playClick();
  }

  localStorage.setItem('vanilla_active_nav', navId);

  // Remove nav-active from all items
  const menuItems = document.querySelectorAll("aside nav a");
  menuItems.forEach(el => el.classList.remove("nav-active"));

  // Add active to selected
  const activeEl = document.getElementById(navId);
  if (activeEl) {
    activeEl.classList.add("nav-active");
  }

  // Load target component with animation
  const contentArea = document.getElementById("content-area");
  contentArea.classList.remove("page-fade-in");
  void contentArea.offsetWidth; // Trigger reflow to restart animation
  contentArea.classList.add("page-fade-in");

  switch (navId) {
    case 'nav-home':
      renderHome();
      break;
    case 'nav-teams':
      renderTeams();
      break;
    case 'nav-fixtures':
      renderFixtures();
      break;
    case 'nav-standings':
      renderStandings();
      break;
    case 'nav-simulation':
      renderSimulation();
      break;
    case 'nav-settings':
      renderSettings();
      break;
    case 'nav-support':
      renderSupport();
      break;
    default:
      renderHome();
  }
}

// Hook search input events
document.getElementById("navbar-search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  STATE.searchQuery = query;

  // Find which nav is active and filter grid if matching
  const activeNav = document.querySelector(".nav-active");
  if (!activeNav) return;

  if (activeNav.id === 'nav-teams') {
    // Dynamically filter teams grid
    const cards = document.querySelectorAll("#content-area > div.grid > div");
    cards.forEach((card, idx) => {
      const team = STATE.teams[idx];
      const match = team.name.toLowerCase().includes(query) || team.manager.toLowerCase().includes(query);
      if (match) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }
});

// Click out of modal closes it
document.getElementById("team-modal").addEventListener("click", (e) => {
  if (e.target.id === "team-modal") {
    closeTeamModal();
  }
});

// // Setup click handles for the sidebar items
document.querySelectorAll("aside nav a").forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(el.id);
  });
});

// ================= AUTHENTICATION & LOGIN LOGIC =================

function checkAuth(isInitial = false) {
  const loggedIn = localStorage.getItem("ligasim_logged_in") === "true" ||
    sessionStorage.getItem("ligasim_logged_in") === "true";
  STATE.isLoggedIn = loggedIn;

  const appLayout = document.getElementById("app-layout");
  const loginPage = document.getElementById("login-page");

  if (loggedIn) {
    // Show application, hide login screen
    if (isInitial) {
      appLayout.classList.remove("logged-out");
      loginPage.classList.add("hidden");
      loginPage.classList.remove("flex");
      loginPage.style.opacity = "0";
    } else {
      // Play transition out animation
      loginPage.style.opacity = "0";
      loginPage.style.transform = "scale(0.95)";

      setTimeout(() => {
        loginPage.classList.add("hidden");
        loginPage.classList.remove("flex");
        appLayout.classList.remove("logged-out");
      }, 500);
    }
  } else {
    // Show login screen, blur application
    appLayout.classList.add("logged-out");
    loginPage.classList.remove("hidden");
    loginPage.classList.add("flex");

    setTimeout(() => {
      loginPage.style.opacity = "1";
      loginPage.style.transform = "scale(1)";
    }, 50);
  }
}

// Show/Hide password toggle logic
document.getElementById("toggle-password").addEventListener("click", () => {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.setAttribute("data-lucide", "eye-off");
  } else {
    passwordInput.type = "password";
    eyeIcon.setAttribute("data-lucide", "eye");
  }
  lucide.createIcons();
});

// Auth Signup vs Login State
let legacyIsSignUp = false;

function getLegacyAdmins() {
  let admins = localStorage.getItem("ligasim_admins");
  if (!admins) {
    // Seed default admin accounts
    admins = JSON.stringify([{ username: "admin", password: "admin123" }]);
    localStorage.setItem("ligasim_admins", admins);
  }
  return JSON.parse(admins);
}

function saveLegacyAdmin(username, password) {
  const admins = getLegacyAdmins();
  admins.push({ username, password });
  localStorage.setItem("ligasim_admins", JSON.stringify(admins));
}

// Handle Signup/Login mode toggle
const toggleSignUpBtn = document.getElementById("toggle-signup-mode-btn");
if (toggleSignUpBtn) {
  toggleSignUpBtn.addEventListener("click", () => {
    legacyIsSignUp = !legacyIsSignUp;
    SOUNDS.playClick();

    const subtitle = document.getElementById("login-subtitle");
    const submitBtnText = document.getElementById("submit-btn-text");
    const usernameInput = document.getElementById("username");
    const errorAlert = document.getElementById("login-error");

    errorAlert.classList.add("hidden");

    if (legacyIsSignUp) {
      subtitle.innerText = "Yeni Yönetici Kaydı";
      submitBtnText.innerText = "Kayıt Ol ve Giriş Yap";
      toggleSignUpBtn.innerText = "Zaten hesabınız var mı? Giriş yapın";
      usernameInput.placeholder = "Yeni kullanıcı adı girin";
    } else {
      subtitle.innerText = "LaLiga Yönetim Sistemi";
      submitBtnText.innerText = "Sisteme Giriş Yap";
      toggleSignUpBtn.innerText = "Yeni yönetici hesabı oluşturun";
      usernameInput.placeholder = "Kullanıcı adınızı girin";
    }
  });
}

// Login form submit handler
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorAlert = document.getElementById("login-error");
  const errorMsg = document.getElementById("login-error-msg");
  const submitBtn = document.getElementById("login-submit-btn");

  // Premium submit loading state
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
    <span>${legacyIsSignUp ? 'Kaydediliyor...' : 'Doğrulanıyor...'}</span>
  `;

  setTimeout(() => {
    const admins = getLegacyAdmins();

    if (legacyIsSignUp) {
      // Check if username taken
      const exists = admins.some(a => a.username.toLowerCase() === user.toLowerCase());
      if (exists) {
        SOUNDS.playClick();
        errorMsg.innerText = "Bu kullanıcı adı zaten alınmış!";
        errorAlert.classList.remove("hidden");
        errorAlert.classList.add("animate-shake");
        setTimeout(() => errorAlert.classList.remove("animate-shake"), 500);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        return;
      }

      // Save new admin and switch mode back to normal
      saveLegacyAdmin(user, pass);
      legacyIsSignUp = false;
      if (toggleSignUpBtn) {
        toggleSignUpBtn.innerText = "Yeni yönetici hesabı oluşturun";
      }
      document.getElementById("login-subtitle").innerText = "LaLiga Yönetim Sistemi";
      document.getElementById("submit-btn-text").innerText = "Sisteme Giriş Yap";
      document.getElementById("username").placeholder = "Kullanıcı adınızı girin";
    }

    // Attempt login verification
    const currentAdmins = getLegacyAdmins();
    const isValid = currentAdmins.some(a => a.username.toLowerCase() === user.toLowerCase() && a.password === pass);

    if (isValid) {
      errorAlert.classList.add("hidden");

      // Play celebratory chime sound
      SOUNDS.playTrophy();

      const rememberMe = document.getElementById("remember-me").checked;
      if (rememberMe) {
        localStorage.setItem("ligasim_logged_in", "true");
      } else {
        sessionStorage.setItem("ligasim_logged_in", "true");
      }

      submitBtn.innerHTML = `
        <i data-lucide="check" class="w-4 h-4"></i>
        <span>Giriş Başarılı!</span>
      `;
      lucide.createIcons();

      setTimeout(() => {
        checkAuth(false);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        lucide.createIcons();
      }, 800);

    } else {
      // Play click/error sound
      SOUNDS.playClick();

      errorMsg.innerText = "Hatalı kullanıcı adı veya şifre!";
      errorAlert.classList.remove("hidden");
      errorAlert.classList.add("animate-shake");

      setTimeout(() => {
        errorAlert.classList.remove("animate-shake");
      }, 500);

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      lucide.createIcons();
    }
  }, 1000);
});

// Logout handler
document.getElementById("logout-btn").addEventListener("click", () => {
  if (confirm("Oturumu kapatmak istediğinizden emin misiniz?")) {
    SOUNDS.playClick();
    localStorage.removeItem("ligasim_logged_in");
    sessionStorage.removeItem("ligasim_logged_in");

    const appLayout = document.getElementById("app-layout");
    const loginPage = document.getElementById("login-page");

    appLayout.classList.add("logged-out");
    loginPage.style.opacity = "0";
    loginPage.style.transform = "scale(1.05)";
    loginPage.classList.remove("hidden");
    loginPage.classList.add("flex");

    setTimeout(() => {
      loginPage.style.opacity = "1";
      loginPage.style.transform = "scale(1)";
    }, 50);
  }
});

// ================= BOOTSTRAP INITIALIZATION =================
window.addEventListener("DOMContentLoaded", () => {
  sortStandings();
  generateFixtures();
  updateNavbarIndicators();

  // Verify auth state immediately (initial load)
  checkAuth(true);

  // Render initial homepage or saved page
  const savedNav = localStorage.getItem('vanilla_active_nav') || 'nav-home';
  navigateTo(savedNav, true);

  // Set up Lucide icons
  lucide.createIcons();
});
