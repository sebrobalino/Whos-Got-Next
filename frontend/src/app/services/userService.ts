
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
