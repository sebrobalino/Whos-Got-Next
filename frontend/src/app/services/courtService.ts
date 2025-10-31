const BASE_URL = "10.136.123.188:3001";

export async function getCourts() {
  const response = await fetch(`http://${BASE_URL}/courts/`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getCourtsById(id: number) {
  const response = await fetch(`http://${BASE_URL}/courts/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getGroupsByCourtId(id: number) {
  const response = await fetch(`http://${BASE_URL}/courts/${id}/groups`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getQueuedCourtsByID(id: number) {
  const response = await fetch(`http://${BASE_URL}/courts/${id}/queued-groups`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getActiveCourtsByID(id: number) {
  const response = await fetch(`http://${BASE_URL}/courts/${id}/active-groups`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getPlayersWaitingCourtsByID(id: number) {
  const response = await fetch(
    `http://${BASE_URL}/courts/${id}/players-waiting`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// services/courtService.ts
export async function endGameOnCourt(courtId: number, winnerGroupId: number) {
  const url = `http://${BASE_URL}/courts/${courtId}/end-game-with-winner/${winnerGroupId}`;
  console.log('[EndGame fetch] URL:', url);

  const res = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' } });

  const raw = await res.text().catch(() => '');
  if (!res.ok) {
    console.error('[EndGame fetch] FAILED', { status: res.status, url, raw });
    throw new Error(raw || `HTTP ${res.status}`);
  }
  return raw ? JSON.parse(raw) : { message: 'OK' };
}
