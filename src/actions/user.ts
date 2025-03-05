// utils/api.ts
export type User = {
  id: string;
  clerkID: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type UserInput = Omit<User, 'id'>;

const BASE_URL = '/api/users';

// Helper function to get common headers
const getHeaders = async () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Get all users
export async function getUsers() {
  try {
    const headers = await getHeaders();
    const response = await fetch(BASE_URL, { headers });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return { data, error: null };
  } catch  {
    return { data: null, error: 'Failed to fetch users' };
  }
}

// Get user by clerkID
export async function getUserByClerkId(clerkId: string) {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/${clerkId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user');
    const data = await response.json();
    return { data, error: null };
  } catch  {
    return { data: null, error: 'Failed to fetch user' };
  }
}

// Create user
export async function createUser(userData: UserInput) {
  try {
    const headers = await getHeaders();
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
      credentials: 'include', // Important for sending cookies
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create user');

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}

// Update user
export async function updateUser(
  clerkId: string,
  userData: Omit<UserInput, 'clerkID'>,
) {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/${clerkId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData),
      credentials: 'include', // Important for sending cookies
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update user');

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update user',
    };
  }
}

// Delete user
export async function deleteUser(clerkId: string) {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${BASE_URL}/${clerkId}`, {
      method: 'DELETE',
      headers,
      credentials: 'include', // Important for sending cookies
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete user');
    }

    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    };
  }
}
