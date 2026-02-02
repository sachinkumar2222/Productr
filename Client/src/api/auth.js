import apiClient from './apiClient';

export const sendOtp = async (contact) => {
    const isEmail = contact.includes('@');
    const payload = isEmail ? { email: contact } : { phoneNumber: contact };

    try {
        const response = await apiClient.post('/auth/login', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const verifyOtp = async (contact, otp) => {
    const isEmail = contact.includes('@');
    const payload = isEmail ? { email: contact, otp } : { phoneNumber: contact, otp };

    try {
        const response = await apiClient.post('/auth/verify-otp', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
