const API_BASE = 'https://football-simulator-api-72l4.onrender.com/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errMessage = `API error: ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.message) errMessage = data.message;
    } catch (e) {
      // ignore
    }
    throw new Error(errMessage);
  }

  if (response.status === 204) return null;
  return await response.json();
}

export const api = {
  // Teams API
  getTeams: () => request('/teams'),
  getTeamById: (id) => request(`/teams/${id}`),
  createTeam: (team) => request('/teams', { method: 'POST', body: JSON.stringify(team) }),
  updateTeam: (id, team) => request(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(team) }),
  deleteTeam: (id) => request(`/teams/${id}`, { method: 'DELETE' }),

  // Fixtures API
  getFixtures: () => request('/fixtures'),
  getMatchesByWeek: (week) => request(`/fixtures/week/${week}`),
  getCurrentWeek: () => request('/fixtures/current-week'),
  getMaxWeek: () => request('/fixtures/max-week'),
  generateFixtures: () => request('/fixtures/generate', { method: 'POST' }),
  resetSeason: () => request('/fixtures/reset', { method: 'POST' }),

  // Simulation API
  simulateWeek: (week) => request(`/simulation/week/${week}`, { method: 'POST' }),
  simulateRemaining: () => request('/simulation/remaining', { method: 'POST' }),

  // Standings API
  getStandings: () => request('/standings'),
  getScorers: () => request('/standings/scorers'),

  // Auth API
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  register: (username, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
};
