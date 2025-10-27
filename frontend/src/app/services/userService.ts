import { z } from 'zod';
import { Alert } from 'react-native';
const BASE_URL = "10.136.117.21:3001"

const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

function popup(messages: string[]) {
  Alert.alert('Error', messages.join('\n'));
}

function extractMessages(errBody: any): string[] {
  // Zod-style server responses or arrays of issues
  if (Array.isArray(errBody?.errors)) {
    const first = errBody.errors[0];
    if (typeof first === 'string') return [first];
    if (typeof first?.message === 'string') return [first.message];
  }
  if (Array.isArray(errBody?.issues)) {
    return errBody.issues.map((i: any) => i.message);
  }
  if (typeof errBody?.message === 'string') {
    return [errBody.message];
  }
  return ['Network response was not ok'];
}

// Centralized server-response handler
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const body = await response.json();
      const msgs = extractMessages(body);
      popup(msgs);
      throw new Error(msgs.join('\n'));
    } catch {
      popup(['Network response was not ok']);
      throw new Error('Network response was not ok');
    }
  }
  return response.json();
}

export async function getUsers() {
    const response = await fetch(`http://${BASE_URL}/users/`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }   
    return response.json();
}

export async function getUserById(id: number) {
    const response = await fetch(`http://${BASE_URL}/users/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}   


export async function createUser(user: { name: string; email: string; password: string }) {
  const parsed = CreateUserSchema.safeParse(user);
  if (!parsed.success) {
    const msgs = parsed.error.issues.map(i => i.message);
    popup(msgs);
    throw new Error(msgs.join('\n')); // stop before fetch
  }

  const res = await fetch(`${BASE_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });

  return handleResponse<any>(res);
}

export async function updateUser(id: number, user: { name?: string; email?: string; password?: string; }) {
    const response = await fetch(`http://${BASE_URL}/users/${id}`, {
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
    const response = await fetch(`http://${BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export async function loginUser(credentials: { email: string; password: string; }) {
    const response = await fetch(`http://${BASE_URL}/users/login`, {
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


