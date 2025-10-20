import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const planningApi = {
  async generateBlueprint(requirements: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/planning/blueprint`, {
        requirements
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to generate blueprint'
      };
    }
  }
};
