const BASE_URL = "10.136.123.188:3001"

export async function getGroups() {
    const response = await fetch(`http://${BASE_URL}/groups/`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }   
    return response.json();
}

export async function getGroupById(id: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${id}`);    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
} 


export async function createGroup(group: { group_name: string }) {
    const response = await fetch(`http://${BASE_URL}/groups/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function leaveCourt(groupId: number) {

  const res = await fetch(`http://${BASE_URL}/groups/${groupId}/leave-court`, {
    method: "POST",                             
    headers: { "Content-Type": "application/json" },
  });

  const text = await res.text().catch(() => "");
  console.log("[SERVICE][leaveCourt] status:", res.status, "body:", text);

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = text ? JSON.parse(text) : null;
      if (j?.message) msg = j.message;
      else if (j?.error) msg = j.error;
    } catch {} // keep msg
    throw new Error(msg);
  }

  // handle 204 No Content
  if (!text) return { message: "OK" };

  try { return JSON.parse(text); } catch { return { message: text }; }
}

export async function deleteGroup(id: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function addUserToGroup(groupId: number, userId: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${groupId}/users/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function joinCourt(groupId: number, courtId: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${groupId}/courts/${courtId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errText = await response.text();
        console.error('joinCourt failed:', response.status, errText);
        throw new Error(`HTTP ${response.status}: ${errText}`);
    }
    return response.json();
}

export async function getGroupCount(id: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${id}/count`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function getGroupMembers(id: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${id}/members`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function leaveGroup(id: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${id}/leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}


