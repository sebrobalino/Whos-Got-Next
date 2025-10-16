
export async function getUsers() {
    const response = await fetch('http://localhost:3001/users/');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }   
    return response.json();
}

