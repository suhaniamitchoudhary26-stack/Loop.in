import apiClient from '../../services/apiClient';

export const fetchPosts = async () => {
    try {
        // Base URL already includes /api/v1
        const response = await apiClient.get('/posts');
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};
