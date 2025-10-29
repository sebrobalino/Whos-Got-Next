const BASE_URL = "10.136.232.41:3001"

export async function getCourts() {
    const response = await fetch(`http://${BASE_URL}/courts/`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }   
    return response.json();
}

export async function getCourtsById(id: number) {
    const response = await fetch(`http://${BASE_URL}/courts/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function getGroupsByCourtId(id: number) {
    const response = await fetch(`http://${BASE_URL}/courts/${id}/groups`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
} 

export async function getQueuedCourtsByID(id: number) {
    const response = await fetch(`http://${BASE_URL}/courts/${id}/queued-groups`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
} 

export async function getPlayersWaitingCourtsByID(id: number) {
    const response = await fetch(`http://${BASE_URL}/courts/${id}/players-waiting`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
} 

