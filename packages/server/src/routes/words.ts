import type { Request, Response } from 'express';
import { Router } from 'express';
import { DictionaryService } from '../services/dictionary';
import { validateLetters } from '../validators/letters';

const router = Router();

router.get('/unscrambler/v1/words', (req: Request, res: Response): void => {
  try {
    const { letters } = req.query;
    // validateLetters() guarantees normalizedLetters is set when valid=true
    const validation = validateLetters(letters);
    if (!validation.valid) {
      // Defensive check: validation.error should always be defined when valid=false
      res.status(400).json({ error: validation.error || 'Invalid input.' });
      return;
    }
    // Type narrowing: validation.valid=true guarantees normalizedLetters is set
    const normalizedLetters = validation.normalizedLetters || '';
    const words = DictionaryService.findWords(normalizedLetters);
    res.status(200).json({ words });
  } catch (error) {
    // Log error details server-side for debugging; return sanitized message to client
    console.error(
      `[ERROR] /unscrambler/v1/words lookup failed: ${error instanceof Error ? error.message : String(error)}`
    );
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

export default router;
