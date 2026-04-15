import { Router, Request, Response } from 'express';
import { lockPropuesta, unlockPropuesta } from '../domain/proposals/proposals.service';

const router = Router();

// POST /propuestas/bloquear
router.post('/bloquear', async (req: Request, res: Response) => {
  try {
    const { id_propuesta, id_usuario } = req.body;
    const { data, error } = await lockPropuesta({ id_propuesta, id_usuario });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(409).json({ error: err.message });
  }
});

// POST /propuestas/liberar
router.post('/liberar', async (req: Request, res: Response) => {
  try {
    const { id_propuesta, id_usuario } = req.body;
    const { data, error } = await unlockPropuesta(id_propuesta, id_usuario);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;