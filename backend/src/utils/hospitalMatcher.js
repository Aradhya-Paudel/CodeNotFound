const { calculateDistance } = require("./distanceUtils");

/**
 * अस्पताल मिलाउने तौलहरू (weights)
 * Blood: 40%, Specialist: 30%, Distance: 20%, Beds: 10%
 * Hospital matching weights (Blood: 40%, Specialist: 30%, Distance: 20%, Beds: 10%)
 */
const WEIGHTS = {
  blood: 0.4,
  specialist: 0.3,
  distance: 0.2,
  beds: 0.1,
};

/**
 * चोटको प्रकार अनुसार चाहिने विशेषज्ञको mapping
 * Maps injury types to required specialists
 */
const INJURY_SPECIALIST_MAP = {
  "head injury": "Neurologist",
  "head trauma": "Neurologist",
  "brain injury": "Neurologist",
  cardiac: "Cardiologist",
  "heart attack": "Cardiologist",
  "chest pain": "Cardiologist",
  fracture: "Orthopedic Surgeon",
  "bone injury": "Orthopedic Surgeon",
  "broken bone": "Orthopedic Surgeon",
  "spinal injury": "Orthopedic Surgeon",
  burn: "General Surgeon",
  burns: "General Surgeon",
  trauma: "General Surgeon",
  accident: "Emergency Medicine Specialist",
  emergency: "Emergency Medicine Specialist",
  respiratory: "Pulmonologist",
  breathing: "Pulmonologist",
  pediatric: "Pediatrician",
  child: "Pediatrician",
  pregnancy: "Gynecologist",
  maternity: "Gynecologist",
  "eye injury": "Ophthalmologist",
  stomach: "Gastroenterologist",
  abdominal: "Gastroenterologist",
  kidney: "Nephrologist",
  skin: "Dermatologist",
  mental: "Psychiatrist",
  ear: "ENT Specialist",
  throat: "ENT Specialist",
  nose: "ENT Specialist",
};

/**
 * चोटको प्रकार अनुसार कुन विशेषज्ञ चाहिन्छ भनेर फेला पार्ने function
 * Gets required specialist based on injury type
 * @param {string} injuryType - चोटको प्रकार (Type of injury)
 * @returns {string} चाहिएको विशेषज्ञ (Required specialist)
 */
const getRequiredSpecialist = (injuryType) => {
  if (!injuryType) return "Emergency Medicine Specialist";

  const lowerInjury = injuryType.toLowerCase();

  for (const [key, specialist] of Object.entries(INJURY_SPECIALIST_MAP)) {
    if (lowerInjury.includes(key)) {
      return specialist;
    }
  }

  return "Emergency Medicine Specialist";
};

/**
 * अस्पतालमा कति blood उपलब्ध छ भनेर ०-१०० को score निकाल्ने function
 * Calculates blood score (0-100) for hospital
 * @param {Object} hospital - अस्पतालको object (Hospital object)
 * @param {string} bloodType - चाहिएको blood प्रकार (Required blood type)
 * @param {number} unitsNeeded - चाहिएको units (Units of blood needed)
 * @returns {number} Blood को score
 */
const calculateBloodScore = (hospital, bloodType, unitsNeeded = 0) => {
  if (!bloodType || unitsNeeded === 0) return 100; // रगत नचाहिएको भए पुरा अंक (Full score if no blood needed)

  const bloodInventory = hospital.bloodInventory?.bloodTypes || [];
  const bloodData = bloodInventory.find((b) => b.type === bloodType);

  if (!bloodData) return 0;

  const availableUnits = bloodData.units || 0;

  if (availableUnits >= unitsNeeded) return 100;
  if (availableUnits === 0) return 0;

  return Math.round((availableUnits / unitsNeeded) * 100);
};

/**
 * अस्पतालमा चाहिएको विशेषज्ञ कति छन् भनेर ०-१०० को score निकाल्ने function
 * Calculates specialist score (0-100)
 * @param {Object} hospital - अस्पतालको object (Hospital object)
 * @param {string} injuryType - चोटको प्रकार (Type of injury)
 * @returns {number} Specialist को score
 */
const calculateSpecialistScore = (hospital, injuryType) => {
  const requiredSpecialist = getRequiredSpecialist(injuryType);
  const staffCount = hospital.staffCount || {};

  const specialistCount = staffCount[requiredSpecialist] || 0;

  if (specialistCount >= 3) return 100;
  if (specialistCount === 2) return 80;
  if (specialistCount === 1) return 50;
  return 0;
};

/**
 * अस्पताल कति टाढा छ भनेर ०-१०० को score निकाल्ने function
 * Calculates distance score (0-100), nearer hospital gets higher score
 * @param {number} distance - दूरी (Distance in km)
 * @returns {number} Distance को score
 */
const calculateDistanceScore = (distance) => {
  // अधिकतम दूरी ५० किमी मात्र गनिन्छ (Max distance considered is 50km)
  const maxDistance = 50;

  if (distance <= 1) return 100;
  if (distance >= maxDistance) return 0;

  return Math.round(100 - (distance / maxDistance) * 100);
};

/**
 * अस्पतालमा कति बेड खाली छ भनेर ०-१०० को score निकाल्ने function
 * Calculates beds score (0-100)
 * @param {Object} hospital - अस्पतालको object (Hospital object)
 * @returns {number} Beds को score
 */
const calculateBedsScore = (hospital) => {
  const beds = hospital.bedsAvailable || 0;

  if (beds >= 20) return 100;
  if (beds >= 10) return 70;
  if (beds >= 5) return 40;
  if (beds >= 1) return 20;
  return 0;
};

/**
 * दिइएको अस्पतालबाट सबैभन्दा नजिकको अर्को अस्पताल फेला पार्ने function
 * Finds the nearest hospital to a given hospital (excluding itself)
 * @param {Array} hospitals - अस्पतालहरूको array (Array of hospital objects)
 * @param {Object} referenceHospital - reference अस्पताल (The hospital to find the nearest to)
 * @returns {Object|null} नजिकको अस्पताल (The nearest hospital object or null)
 */
const findNearestHospitalToHospital = (hospitals, referenceHospital) => {
  if (!referenceHospital || !hospitals || hospitals.length === 0) return null;

  let minDist = Infinity;
  let nearest = null;

  hospitals.forEach((hospital) => {
    if (hospital.id !== referenceHospital.id) {
      const dist = calculateDistance(
        referenceHospital.latitude,
        referenceHospital.longitude,
        hospital.latitude,
        hospital.longitude,
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = hospital;
      }
    }
  });

  // राम्रो देखिने गरी console मा जानकारी देखाउने (Enhanced console logging with formatted output)
  if (nearest) {
    const distanceKm = Math.round(minDist * 100) / 100;
    console.log("\n" + "=".repeat(70));
    console.log("🏥 NEAREST HOSPITAL TO BEST HOSPITAL FOUND");
    console.log("=".repeat(70));
    console.log("📍 Best/Destination Hospital:");
    console.log(`   ID: ${referenceHospital.id}`);
    console.log(`   Name: ${referenceHospital.name}`);
    console.log(`   Location: ${referenceHospital.address}`);
    console.log("");
    console.log("🩸 Nearest Hospital (Blood Donor Candidate):");
    console.log(`   ID: ${nearest.id}`);
    console.log(`   Name: ${nearest.name}`);
    console.log(`   Address: ${nearest.address}`);
    console.log(`   Phone: ${nearest.phone}`);
    console.log(`   📏 Distance: ${distanceKm} km`);
    console.log("=".repeat(70) + "\n");

    // नजिकको अस्पतालको object फर्काउने जसमा दूरी पनि हुन्छ (Return hospital object with distanceFromBest property)
    return {
      ...nearest,
      distanceFromBest: distanceKm,
    };
  }

  return null;
};

/**
 * casualty को लागि सबैभन्दा राम्रो अस्पताल छान्ने function
 * Finds best matching hospital for a casualty
 * @param {Array} hospitals - अस्पतालहरूको array (Array of hospitals)
 * @param {Object} casualtyInfo - casualty को जानकारी (Casualty information)
 * @param {number} accidentLat - दुर्घटनाको latitude (Accident latitude)
 * @param {number} accidentLon - दुर्घटनाको longitude (Accident longitude)
 * @returns {Object} सबैभन्दा राम्रो अस्पताल (Best matching hospital with scores)
 */
const findBestHospital = (
  hospitals,
  casualtyInfo,
  accidentLat,
  accidentLon,
) => {
  const { injuryType, bloodType, bloodUnitsNeeded } = casualtyInfo;

  const scoredHospitals = hospitals
    .filter((h) => h.isAvailable !== false && h.bedsAvailable > 0)
    .map((hospital) => {
      const distance = calculateDistance(
        accidentLat,
        accidentLon,
        hospital.latitude,
        hospital.longitude,
      );

      const bloodScore = calculateBloodScore(
        hospital,
        bloodType,
        bloodUnitsNeeded,
      );
      const specialistScore = calculateSpecialistScore(hospital, injuryType);
      const distanceScore = calculateDistanceScore(distance);
      const bedsScore = calculateBedsScore(hospital);

      const totalScore =
        bloodScore * WEIGHTS.blood +
        specialistScore * WEIGHTS.specialist +
        distanceScore * WEIGHTS.distance +
        bedsScore * WEIGHTS.beds;

      return {
        hospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          bedsAvailable: hospital.bedsAvailable,
        },
        scores: {
          blood: bloodScore,
          specialist: specialistScore,
          distance: distanceScore,
          beds: bedsScore,
          total: Math.round(totalScore * 100) / 100,
        },
        distance: Math.round(distance * 100) / 100,
        requiredSpecialist: getRequiredSpecialist(injuryType),
      };
    });

  // Sort by total score (descending)
  scoredHospitals.sort((a, b) => b.scores.total - a.scores.total);

  if (scoredHospitals.length > 0) {
    const best = scoredHospitals[0];
    // सबैभन्दा राम्रो अस्पताल नजिकको अर्को अस्पताल फेला पार्ने (Find nearest hospital to the best hospital)
    const nearestToBest = findNearestHospitalToHospital(
      hospitals,
      best.hospital,
    );

    // सबैभन्दा राम्रो अस्पताल र नजिकको अस्पतालको जानकारी फर्काउने (Return best hospital with nearest hospital info attached)
    return {
      ...best,
      nearestHospitalForBlood: nearestToBest,
    };
  }
  return null;
};

/**
 * casualty को लागि सबै अस्पताललाई score अनुसार क्रमबद्ध गर्ने function
 * Gets all hospitals ranked for a casualty
 * @param {Array} hospitals - अस्पतालहरूको array (Array of hospitals)
 * @param {Object} casualtyInfo - casualty को जानकारी (Casualty information)
 * @param {number} accidentLat - दुर्घटनाको latitude (Accident latitude)
 * @param {number} accidentLon - दुर्घटनाको longitude (Accident longitude)
 * @returns {Array} score अनुसार क्रमबद्ध अस्पतालहरू (Ranked hospitals with scores)
 */
const rankHospitals = (hospitals, casualtyInfo, accidentLat, accidentLon) => {
  const { injuryType, bloodType, bloodUnitsNeeded } = casualtyInfo;

  const scoredHospitals = hospitals
    .filter((h) => h.isAvailable !== false)
    .map((hospital) => {
      const distance = calculateDistance(
        accidentLat,
        accidentLon,
        hospital.latitude,
        hospital.longitude,
      );

      const bloodScore = calculateBloodScore(
        hospital,
        bloodType,
        bloodUnitsNeeded,
      );
      const specialistScore = calculateSpecialistScore(hospital, injuryType);
      const distanceScore = calculateDistanceScore(distance);
      const bedsScore = calculateBedsScore(hospital);

      const totalScore =
        bloodScore * WEIGHTS.blood +
        specialistScore * WEIGHTS.specialist +
        distanceScore * WEIGHTS.distance +
        bedsScore * WEIGHTS.beds;

      return {
        hospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          bedsAvailable: hospital.bedsAvailable,
        },
        scores: {
          blood: bloodScore,
          specialist: specialistScore,
          distance: distanceScore,
          beds: bedsScore,
          total: Math.round(totalScore * 100) / 100,
        },
        distance: Math.round(distance * 100) / 100,
        requiredSpecialist: getRequiredSpecialist(injuryType),
      };
    });

  // कुल अंक (total score) अनुसार घट्दो क्रममा क्रमबद्ध गर्ने (Sort by total score descending)
  scoredHospitals.sort((a, b) => b.scores.total - a.scores.total);
  return scoredHospitals;
};

module.exports = {
  WEIGHTS,
  INJURY_SPECIALIST_MAP,
  getRequiredSpecialist,
  calculateBloodScore,
  calculateSpecialistScore,
  calculateDistanceScore,
  calculateBedsScore,
  findBestHospital,
  rankHospitals,
  findNearestHospitalToHospital,
};
