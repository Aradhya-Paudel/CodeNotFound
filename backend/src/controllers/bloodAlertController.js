const fs = require('fs');
const path = require('path');
const { findNearestHospitalToHospital } = require('../utils/hospitalMatcher');

const HOSPITALS_FILE = path.join(__dirname, '../../data/hospitals.json');

const readHospitals = () => {
  try {
    const data = fs.readFileSync(HOSPITALS_FILE, 'utf8');
    return JSON.parse(data).hospitals;
  } catch (error) {
    console.error('Error reading hospitals file:', error);
    return [];
  }
};

const writeHospitals = (hospitals) => {
  try {
    const data = { hospitals };
    fs.writeFileSync(HOSPITALS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing hospitals file:', error);
    return false;
  }
};

/**
 * Send blood alert to nearest hospital
 * POST /api/blood-alerts/send-alert
 */
const sendBloodAlertToNearest = async (req, res) => {
  try {
    const { bestHospitalId, bloodType, unitsNeeded, urgency, casualtyInfo } = req.body;
    console.log('\n🔄 Processing blood alert request...');
    
    const hospitals = readHospitals();
    const bestHospital = hospitals.find(h => h.id === parseInt(bestHospitalId));
    
    if (!bestHospital) {
      return res.status(404).json({ 
        success: false,
        error: 'Best hospital not found' 
      });
    }
    
    const nearestHospitalData = findNearestHospitalToHospital(hospitals, bestHospital);
    
    if (!nearestHospitalData) {
      return res.status(404).json({ 
        success: false,
        error: 'No nearby hospitals found' 
      });
    }
    
    const bloodAlert = {
      id: `BA-${Date.now()}`,
      requestingHospitalId: bestHospital.id,
      requestingHospitalName: bestHospital.name,
      requestingHospitalPhone: bestHospital.phone,
      requestingHospitalAddress: bestHospital.address,
      bloodType: bloodType,
      unitsRequested: parseFloat(unitsNeeded),
      urgency: urgency || 'urgent',
      status: 'pending',
      distance: nearestHospitalData.distanceFromBest,
      casualtyDetails: casualtyInfo || null,
      createdAt: new Date().toISOString(),
      respondedAt: null,
      responseReason: null
    };
    
    const nearestHospitalIndex = hospitals.findIndex(h => h.id === nearestHospitalData.id);
    if (!hospitals[nearestHospitalIndex].bloodAlerts) {
      hospitals[nearestHospitalIndex].bloodAlerts = [];
    }
    hospitals[nearestHospitalIndex].bloodAlerts.push(bloodAlert);
    
    writeHospitals(hospitals);
    
    console.log('✅ Blood alert sent successfully');
    console.log('\n============================================================');
    console.log('✨ BLOOD ALERT SENT SUCCESSFULLY ✨');
    console.log('============================================================\n');
    
    res.json({
      success: true,
      message: 'Blood alert sent successfully',
      alert: bloodAlert,
      nearestHospital: {
        id: nearestHospitalData.id,
        name: nearestHospitalData.name,
        distance: nearestHospitalData.distanceFromBest
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send blood alert' 
    });
  }
};

/**
 * Get all blood alerts for a hospital
 * GET /api/blood-alerts/:hospitalId
 */
const getBloodAlerts = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospitals = readHospitals();
    const hospital = hospitals.find(h => h.id === parseInt(hospitalId));
    
    if (!hospital) {
      return res.status(404).json({ 
        success: false,
        error: 'Hospital not found' 
      });
    }
    
    const bloodAlerts = hospital.bloodAlerts || [];
    
    res.json({
      success: true,
      bloodAlerts: bloodAlerts,
      pending: bloodAlerts.filter(a => a.status === 'pending').length
    });
  } catch (error) {
    console.error('Error fetching blood alerts:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch blood alerts' 
    });
  }
};

/**
 * Accept a blood alert
 * PATCH /api/blood-alerts/:hospitalId/:alertId/accept
 */
const acceptBloodAlert = async (req, res) => {
  try {
    const { hospitalId, alertId } = req.params;
    const hospitals = readHospitals();
    const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(hospitalId));
    
    if (hospitalIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Hospital not found' 
      });
    }
    
    const hospital = hospitals[hospitalIndex];
    const alertIndex = hospital.bloodAlerts.findIndex(a => a.id === alertId);
    
    if (alertIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Blood alert not found' 
      });
    }
    
    const alert = hospital.bloodAlerts[alertIndex];
    alert.status = 'accepted';
    alert.respondedAt = new Date().toISOString();
    
    // Reduce blood inventory
    const bloodTypeIndex = hospital.bloodInventory.bloodTypes.findIndex(
      bt => bt.type === alert.bloodType
    );
    if (bloodTypeIndex !== -1) {
      const bloodEntry = hospital.bloodInventory.bloodTypes[bloodTypeIndex];
      const currentUnits = bloodEntry.liters || bloodEntry.units || 0;
      const newUnits = Math.max(0, currentUnits - alert.unitsRequested);
      
      if (bloodEntry.liters !== undefined) {
        bloodEntry.liters = newUnits;
      } else {
        bloodEntry.units = newUnits;
      }
      hospital.bloodInventory.total = Math.max(0, hospital.bloodInventory.total - alert.unitsRequested);
    }
    
    hospitals[hospitalIndex] = hospital;
    writeHospitals(hospitals);
    
    console.log(`✅ Blood alert ${alertId} accepted by hospital ${hospitalId}`);
    
    res.json({
      success: true,
      message: 'Blood alert accepted',
      alert: alert
    });
  } catch (error) {
    console.error('Error accepting blood alert:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to accept blood alert' 
    });
  }
};

/**
 * Reject a blood alert
 * PATCH /api/blood-alerts/:hospitalId/:alertId/reject
 */
const rejectBloodAlert = async (req, res) => {
  try {
    const { hospitalId, alertId } = req.params;
    const { reason } = req.body;
    const hospitals = readHospitals();
    const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(hospitalId));
    
    if (hospitalIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Hospital not found' 
      });
    }
    
    const hospital = hospitals[hospitalIndex];
    const alertIndex = hospital.bloodAlerts.findIndex(a => a.id === alertId);
    
    if (alertIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Blood alert not found' 
      });
    }
    
    const alert = hospital.bloodAlerts[alertIndex];
    alert.status = 'rejected';
    alert.respondedAt = new Date().toISOString();
    alert.responseReason = reason || 'No reason provided';
    
    hospitals[hospitalIndex] = hospital;
    writeHospitals(hospitals);
    
    console.log(`❌ Blood alert ${alertId} rejected by hospital ${hospitalId}`);
    
    res.json({
      success: true,
      message: 'Blood alert rejected',
      alert: alert
    });
  } catch (error) {
    console.error('Error rejecting blood alert:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to reject blood alert' 
    });
  }
};

module.exports = {
  sendBloodAlertToNearest,
  getBloodAlerts,
  acceptBloodAlert,
  rejectBloodAlert
};
