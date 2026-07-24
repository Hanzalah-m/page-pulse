import axios from 'axios';

const apiUrl = 'https://page-pulse-98rl.onrender.com';

export const auditWebsite = async (url) => {
  try {
    const response = await axios.post(`${apiUrl}/api/audit`, { url });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Unable to audit the website.';
    const customError = new Error(message);
    customError.code = error.response?.data?.error || 'INTERNAL_ERROR';
    throw customError;
  }
};
