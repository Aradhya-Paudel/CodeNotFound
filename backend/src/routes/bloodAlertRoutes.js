const express = require('express');
const router = express.Router();
const {
  sendBloodAlertToNearest,
  getBloodAlerts,
  acceptBloodAlert,
  rejectBloodAlert
} = require('../controllers/bloodAlertController');

// POST /api/blood-alerts/send-alert - Send blood alert to nearest hospital
router.post('/send-alert', sendBloodAlertToNearest);

// GET /api/blood-alerts/:hospitalId - Get all blood alerts for a hospital
router.get('/:hospitalId', getBloodAlerts);

// PATCH /api/blood-alerts/:hospitalId/:alertId/accept - Accept blood alert
router.patch('/:hospitalId/:alertId/accept', acceptBloodAlert);

// PATCH /api/blood-alerts/:hospitalId/:alertId/reject - Reject blood alert
router.patch('/:hospitalId/:alertId/reject', rejectBloodAlert);

module.exports = router;
