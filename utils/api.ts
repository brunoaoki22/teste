const API_BASE_URL = 'http://localhost:3001/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
        // No content to parse, but the request was successful
        return null as T;
    }
    const data = await response.json();
    if (!response.ok) {
        const errorMessage = data.message || `An error occurred: ${response.statusText}`;
        throw new Error(errorMessage);
    }
    return data as T;
}

export const api = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        return handleResponse<T>(response);
    },

    async post<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },

    async put<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },

    async delete(endpoint: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
        });
        await handleResponse<void>(response);
    },
};