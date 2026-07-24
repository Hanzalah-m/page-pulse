import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const auditWebsite = async (url) => {
  try {
    const response = await axios.post(`${apiUrl}/audit`, { url });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Unable to audit the website.';
    const customError = new Error(message);
    customError.code = error.response?.data?.error || 'INTERNAL_ERROR';
    throw customError;
  }
};
