import express from 'express';
import { PlanningService } from '../services/planning.service.js';

const router = express.Router();

/**
 * POST /api/planning/blueprint
 * Generate complete project blueprint with workflow
 */
router.post('/blueprint', async (req, res) => {
  try {
    const { requirements } = req.body;

    if (!requirements) {
      return res.status(400).json({ 
        success: false, 
        error: 'Requirements are required' 
      });
    }

    const result = await PlanningService.generateBlueprint(requirements);
    return res.json(result);

  } catch (error: any) {
    console.error('Route error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
