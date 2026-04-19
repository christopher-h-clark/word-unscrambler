import { Router } from 'express';
import wordsRouter from './words';

const router = Router();

router.use(wordsRouter);

export default router;
