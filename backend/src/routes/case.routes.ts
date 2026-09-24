import { Router } from 'express';
import { caseController } from '../controllers/CaseController';

const router = Router();

router.post('/', caseController.createCase);
router.get('/:id', caseController.getCase);
router.get('/', caseController.listCases);
router.patch('/:id/status', caseController.updateStatus);

export default router;
