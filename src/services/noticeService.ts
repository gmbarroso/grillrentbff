import axios from 'axios';
import { API_URL } from '../config';
import { UnauthorizedException, BadRequestException, NotFoundException } from '../exceptions';

class NoticeService {
  private apiUrl = API_URL;

  async createNotice(data: { title: string; subtitle: string; content: string }, token: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/notices`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException(error.response.data.message);
        }
        if (error.response?.status === 400) {
          throw new BadRequestException(error.response.data.message);
        }
      }
      throw error;
    }
  }

  async getNotices(token: string, page: number = 1, limit: number = 10) {
    try {
      const response = await axios.get(`${this.apiUrl}/notices`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException(error.response.data.message);
        }
      }
      throw error;
    }
  }

  async updateNotice(id: string, data: { title: string; subtitle: string; content: string }, token: string) {
    try {
      const response = await axios.put(`${this.apiUrl}/notices/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException(error.response.data.message);
        }
        if (error.response?.status === 400) {
          throw new BadRequestException(error.response.data.message);
        }
        if (error.response?.status === 404) {
          throw new NotFoundException(error.response.data.message);
        }
      }
      throw error;
    }
  }

  async deleteNotice(id: string, token: string) {
    try {
      const response = await axios.delete(`${this.apiUrl}/notices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException(error.response.data.message);
        }
        if (error.response?.status === 404) {
          throw new NotFoundException(error.response.data.message);
        }
      }
      throw error;
    }
  }
}

export default new NoticeService();
