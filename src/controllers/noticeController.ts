import { Request, Response } from 'express';
import noticeService from '../services/noticeService';

class NoticeController {
  async createNotice(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const result = await noticeService.createNotice(req.body, token);
      res.status(201).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }

  async getNotices(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const { page = 1, limit = 10 } = req.query;
      const result = await noticeService.getNotices(token, Number(page), Number(limit));
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }

  async updateNotice(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const { id } = req.params;
      const result = await noticeService.updateNotice(id, req.body, token);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }

  async deleteNotice(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const { id } = req.params;
      const result = await noticeService.deleteNotice(id, token);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ message: (err as Error).message });
    }
  }
}

export default new NoticeController();
