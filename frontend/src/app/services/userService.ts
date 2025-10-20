
export async function getUsers() {
    const response = await fetch('http://10.136.245.108:3001/users/');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }   
    return response.json();
}

export async function getUserById(id: number) {
    const response = await fetch(`http://10.136.245.108:3001/users/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}   


export async function createUser(user: { name: string; email: string; password: string; }) {
    const response = await fetch('http://10.136.245.108:3001/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function updateUser(id: number, user: { name?: string; email?: string; password?: string; }) {
    const response = await fetch(`http://10.136.245.108:3001/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function deleteUser(id: number) {
    const response = await fetch(`http://10.136.245.108:3001/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function loginUser(credentials: { email: string; password: string; }) {
    const response = await fetch('http://10.136.245.108:3001/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}


