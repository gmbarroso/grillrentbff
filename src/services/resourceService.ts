import axios from 'axios';
import { API_URL } from '../config';
import { UnauthorizedException, BadRequestException } from '../exceptions';

class ResourceService {
  private apiUrl = API_URL;

  async getAllResources(token: string) {
    try {
      console.log('Sending request to API with token:', token);
      const response = await axios.get(`${this.apiUrl}/resources`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          throw new UnauthorizedException(error.response.data.message);
        }
        if (error.response && error.response.status === 400) {
          throw new BadRequestException(error.response.data.message);
        }
      }
      throw error;
    }
  }
}

export default new ResourceService();
