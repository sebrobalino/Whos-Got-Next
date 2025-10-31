const BASE_URL = "10.136.239.234:3001"

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

export async function leaveCourt(id: number) {
    const response = await fetch(`http://${BASE_URL}/groups/${id}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
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
        throw new Error('Network response was not ok');
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


