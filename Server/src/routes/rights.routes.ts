import { Router } from 'express';
import { analyzeTenantRightsWithAI } from '../controllers/rights.controller.js';

const router: Router = Router();

router.post('/analyze-ai', analyzeTenantRightsWithAI);


export default router;
