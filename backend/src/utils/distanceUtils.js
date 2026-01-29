/**
 * दुई स्थानको दूरी Haversine formula प्रयोग गरेर निकाल्ने function
 * Calculates distance between two coordinates using Haversine formula
 * @param {number} lat1 - पहिलो बिन्दुको अक्षांश (Latitude of point 1)
 * @param {number} lon1 - पहिलो बिन्दुको देशान्तर (Longitude of point 1)
 * @param {number} lat2 - दोस्रो बिन्दुको अक्षांश (Latitude of point 2)
 * @param {number} lon2 - दोस्रो बिन्दुको देशान्तर (Longitude of point 2)
 * @returns {number} दूरी किलोमिटरमा (Distance in kilometers)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // पृथ्वीको radius किलोमिटरमा (Earth's radius in kilometers)

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // २० मिटर (०.०२ किमी) घटाएर अझै accurate बनाउने (Decrease by 20 meters for accuracy)
  const distance = R * c;
  return Math.max(0, distance - 0.02); // नकारात्मक नहोस् भनेर (Ensure non-negative)
};

/**
 * डिग्रीलाई रेडियनमा बदल्ने function
 * Converts degrees to radians
 * @param {number} degrees - डिग्रीमा कोण (Angle in degrees)
 * @returns {number} रेडियनमा कोण (Angle in radians)
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * दिइएको स्थानमा सबैभन्दा नजिकको ambulance फेला पार्ने function
 * Finds nearest ambulance to a location
 * @param {number} latitude - लक्षित अक्षांश (Target latitude)
 * @param {number} longitude - लक्षित देशान्तर (Target longitude)
 * @param {Array} ambulances - ambulance हरूको array (Array of ambulances)
 * @returns {Object|null} नजिकको ambulance (Nearest ambulance with distance)
 */
const findNearestAmbulance = (latitude, longitude, ambulances) => {
  if (!ambulances || ambulances.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const ambulance of ambulances) {
    if (ambulance.status !== "available") continue;

    let distance = calculateDistance(
      latitude,
      longitude,
      ambulance.latitude,
      ambulance.longitude,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        ...ambulance,
        distance: Math.round(distance * 100) / 100, // दशमलव २ स्थानसम्म गोल गर्ने (Round to 2 decimal places)
      };
    }
  }

  return nearest;
};

/**
 * दूरीको आधारमा ambulance कति समयमा पुग्छ (ETA) निकाल्ने function (४० किमी/घण्टा औसत speed मानिन्छ)
 * Calculates ETA based on distance (assuming average speed of 40 km/h for ambulance)
 * @param {number} distanceKm - दूरी किलोमिटरमा (Distance in kilometers)
 * @returns {number} मिनेटमा ETA (ETA in minutes)
 */
const calculateETA = (distanceKm) => {
  const averageSpeedKmPerHour = 40; // शहरमा ambulance को औसत speed (Average ambulance speed in city)
  const timeInHours = distanceKm / averageSpeedKmPerHour;
  const timeInMinutes = Math.ceil(timeInHours * 60);
  return timeInMinutes;
};

module.exports = {
  calculateDistance,
  toRadians,
  findNearestAmbulance,
  calculateETA,
};
