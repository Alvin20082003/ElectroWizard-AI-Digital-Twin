import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    // Get all zones
    getAllZones: (limit = 1000, riskLevel = null) => {
        const params = { limit };
        if (riskLevel) params.risk_level = riskLevel;
        return axios.get(`${API_BASE_URL}/zones`, { params });
    },

    // Get zones by district
    getZonesByDistrict: (district) => {
        return axios.get(`${API_BASE_URL}/zones/district/${district}`);
    },

    // Predict impact
    predictImpact: (features) => {
        return axios.post(`${API_BASE_URL}/predict`, features);
    },

    // Get explanation - send zone data as-is
    getExplanation: (zone) => {
        // The zone object from /api/zones already has all required fields
        return axios.post(`${API_BASE_URL}/explain`, zone);
    },

    // Get restoration plan
    getRestorationPlan: (zoneIds = null, crews = 5) => {
        return axios.post(`${API_BASE_URL}/restoration/prioritize`, zoneIds, {
            params: { available_crews: crews }
        });
    },

    // Get ETA for zone
    getRestorationETA: (zoneId, crews = 5) => {
        return axios.get(`${API_BASE_URL}/restoration/eta/${zoneId}`, {
            params: { available_crews: crews }
        });
    },

    // Get statistics
    getStatistics: () => {
        return axios.get(`${API_BASE_URL}/stats`);
    },

    // Get feature importance
    getFeatureImportance: () => {
        return axios.get(`${API_BASE_URL}/model/feature-importance`);
    },

    // New MongoDB-powered endpoints

    // Get grid statistics
    getGridStats: () => {
        return axios.get(`${API_BASE_URL}/grid/stats`);
    },

    // Get hospitals
    getHospitals: () => {
        return axios.get(`${API_BASE_URL}/hospitals`);
    },

    // Digital twin simulation
    runSimulation: (outageCause, originZone, durationHours) => {
        return axios.post(`${API_BASE_URL}/digital-twin/simulate`, null, {
            params: {
                outage_cause: outageCause,
                origin_zone: originZone,
                duration_hours: durationHours
            }
        });
    },

    // AI restoration plan
    getAIRestorationPlan: (affectedZones, crews = 5) => {
        return axios.post(`${API_BASE_URL}/restoration/ai-plan`, affectedZones, {
            params: { available_crews: crews }
        });
    },

    // New Energy Threshold endpoints
    getEnergyHistory: (days = 30) => {
        return axios.get(`${API_BASE_URL}/energy/history`, { params: { days } });
    },


    calculateEmergencySplit: (zoneA, zoneB, total) => {
        return axios.post(`${API_BASE_URL}/energy/emergency-split`, null, {
            params: {
                zone_a_demand: zoneA,
                zone_b_demand: zoneB,
                total_available: total
            }
        });
    },

    sendEmail: (priority, subject, content, recipients) => {
        return axios.post(`${API_BASE_URL}/send-email`, {
            priority, subject, content, recipients
        });
    }
};


