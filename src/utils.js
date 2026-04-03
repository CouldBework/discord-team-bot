function parseMembers(input) {
  return Array.from(
    new Set(
      input
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function splitTeams(members, teamCount) {
  const shuffled = shuffle(members);
  const teams = Array.from({ length: teamCount }, () => []);

  shuffled.forEach((member, index) => {
    teams[index % teamCount].push(member);
  });

  return teams;
}

function teamLabel(index) {
  const code = 65 + index;
  if (code <= 90) {
    return `팀 ${String.fromCharCode(code)}`;
  }
  return `팀 ${index + 1}`;
}

function renderTeams(teams) {
  const icons = ['🔴', '🔵', '🟢', '🟣', '🟠', '🟡', '⚪', '⚫', '🟤', '🔷'];

  return teams
    .map((team, index) => {
      const icon = icons[index] || '•';
      const label = teamLabel(index);
      const members = team.length ? team.join(', ') : '(비어 있음)';
      return `${icon} ${label} — ${members}`;
    })
    .join('\n');
}

function getExpiryMs(minutes) {
  const parsed = Number(minutes);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1000 * 60 * 60 * 12;
  }
  return parsed * 60 * 1000;
}

module.exports = {
  parseMembers,
  splitTeams,
  renderTeams,
  getExpiryMs
};
