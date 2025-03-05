import { Request, Response } from 'express';
import resourceService from '../services/resourceService';

class ResourceController {
  async getResource(req: Request, res: Response): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      const resources = await resourceService.getAllResources(token);
      res.status(200).send(resources);
    } catch (err) {
      res.status(500).send({ message: (err as Error).message });
    }
  }
}

export default new ResourceController();
