import apiClient from '../../services/apiClient';

export const loginUser = async (email, password) => {
    const formData = new URLSearchParams();
    // Assuming backend expects JSON body based on UserLogin schema, 
    // BUT OAuth2PasswordRequestForm usually expects form data.
    // My backend uses UserLogin Pydantic model which expects JSON body.
    // So JSON is correct.
    const response = await apiClient.post('/api/v1/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (email, password, fullName) => {
    const response = await apiClient.post('/api/v1/auth/register', {
        email,
        password,
        full_name: fullName
    });
    return response.data;
};
