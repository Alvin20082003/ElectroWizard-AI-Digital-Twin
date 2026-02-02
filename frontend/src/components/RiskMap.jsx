import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Box, Typography, Chip, Paper, Grid, CircularProgress, Card, CardContent } from '@mui/material';
import { api } from '../services/api';
import {
    Map as MapIcon,
    Warning as WarningIcon,
    Security as SafeIcon,
    PriorityHigh as HighRiskIcon,
    Bolt as BoltIcon,
    LocalHospital as HospitalIcon,
    Factory as FactoryIcon,
    School as SchoolIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

// Component to update map view
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const RiskMap = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [filterRisk, setFilterRisk] = useState('All');

    // Chennai center coordinates
    const chennaiCenter = [13.0827, 80.2707];

    useEffect(() => {
        loadZones();
        loadStats();
    }, []);

    const loadZones = async () => {
        try {
            setLoading(true);
            const response = await api.getAllZones(5000);
            setZones(response.data.zones);
        } catch (error) {
            console.error('Error loading zones:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.getStatistics();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const getRiskColor = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'critical': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#fbbf24';
            case 'low': return '#10b981';
            default: return '#9ca3af';
        }
    };

    const getRiskSize = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'critical': return 15; // Much bigger (Big Visual)
            case 'high': return 12;
            case 'medium': return 9;
            default: return 6;
        }
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexShrink: 0 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e0e7ff', borderRadius: 2, color: '#6C5DD3' }}>
                    <MapIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        Risk Map Visualization
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Geospatial analysis of grid resilience and failure probability
                    </Typography>
                </Box>
            </Box>

            {/* Statistics Cards */}
            {stats && (
                <Grid container spacing={2} sx={{ mb: 3, flexShrink: 0 }}>
                    <Grid item xs={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #fee2e2', borderRadius: 3 }}>
                            <CardContent sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', right: -10, top: -10, p: 4, bgcolor: '#fee2e2', borderRadius: '50%', opacity: 0.5 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <WarningIcon fontSize="small" color="error" />
                                    <Typography variant="overline" fontWeight={700} color="text.secondary">Critical Zones</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#ef4444' }}>{stats.critical_zones}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #fef3c7', borderRadius: 3 }}>
                            <CardContent sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', right: -10, top: -10, p: 4, bgcolor: '#fef3c7', borderRadius: '50%', opacity: 0.5 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <HighRiskIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                                    <Typography variant="overline" fontWeight={700} color="text.secondary">High Risk</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#f59e0b' }}>{stats.high_risk_zones}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #fef9c3', borderRadius: 3 }}>
                            <CardContent sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', right: -10, top: -10, p: 4, bgcolor: '#fef9c3', borderRadius: '50%', opacity: 0.5 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <BoltIcon fontSize="small" sx={{ color: '#eab308' }} />
                                    <Typography variant="overline" fontWeight={700} color="text.secondary">Medium Risk</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#eab308' }}>{stats.risk_distribution.Medium || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #dcfce7', borderRadius: 3 }}>
                            <CardContent sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', right: -10, top: -10, p: 4, bgcolor: '#dcfce7', borderRadius: '50%', opacity: 0.5 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <SafeIcon fontSize="small" sx={{ color: '#10b981' }} />
                                    <Typography variant="overline" fontWeight={700} color="text.secondary">Low Risk</Typography>
                                </Box>
                                <Typography variant="h3" fontWeight={800} sx={{ color: '#10b981' }}>{stats.risk_distribution.Low || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Map Controls & Filter */}
            <Paper elevation={0} sx={{ mb: 2, p: 1, px: 2, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6b7280' }}>FILTER MAP:</Typography>
                {['All', 'Critical', 'High', 'Medium', 'Low'].map((risk) => (
                    <Chip
                        key={risk}
                        label={risk === 'All' ? 'Show All' : `${risk} Risk`}
                        onClick={() => setFilterRisk(risk)}
                        sx={{
                            fontWeight: 700,
                            bgcolor: filterRisk === risk ? (risk === 'All' ? '#6C5DD3' : getRiskColor(risk)) : 'transparent',
                            color: filterRisk === risk ? 'white' : '#6b7280',
                            border: filterRisk === risk ? 'none' : '1px solid #e5e7eb',
                            '&:hover': { bgcolor: filterRisk === risk ? (risk === 'All' ? '#5a4ad1' : getRiskColor(risk)) : '#f3f4f6' }
                        }}
                    />
                ))}
            </Paper>

            {/* Map Container - Increased Height for "Big Visual" */}
            <Paper elevation={0} sx={{ height: '75vh', minHeight: '600px', border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <MapContainer
                        center={chennaiCenter}
                        zoom={11}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <ChangeView center={chennaiCenter} zoom={11} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {zones
                            .filter(zone => filterRisk === 'All' || zone.risk_level.toLowerCase() === filterRisk.toLowerCase())
                            .map((zone, index) => (
                                <CircleMarker
                                    key={index}
                                    center={[zone.latitude, zone.longitude]}
                                    radius={getRiskSize(zone.risk_level)}
                                    fillColor={getRiskColor(zone.risk_level)}
                                    color="#fff"
                                    weight={1}
                                    opacity={1}
                                    fillOpacity={0.8}
                                    eventHandlers={{
                                        click: () => setSelectedZone(zone),
                                    }}
                                >
                                    <Popup>
                                        <div style={{ minWidth: '220px', fontFamily: 'Inter, sans-serif' }}>
                                            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1f2937', mb: 0.5 }}>
                                                {zone.zone_id}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                                {zone.district} District
                                            </Typography>

                                            <Box sx={{ mt: 1, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={zone.risk_level}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: getRiskColor(zone.risk_level),
                                                        color: 'white',
                                                        fontWeight: 700,
                                                        height: 20,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    Score: {zone.impact_score.toFixed(1)}
                                                </Typography>
                                            </Box>

                                            <Grid container spacing={1} sx={{ mt: 1 }}>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <HospitalIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                                                        <Typography variant="caption" fontWeight={600} color="text.primary">{zone.hospital_count}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <FactoryIcon sx={{ fontSize: 14, color: '#64748b' }} />
                                                        <Typography variant="caption" fontWeight={600} color="text.primary">{zone.industry_count}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PeopleIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                                                        <Typography variant="caption" fontWeight={600} color="text.primary">{zone.population_density}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <BoltIcon sx={{ fontSize: 14, color: '#eab308' }} />
                                                        <Typography variant="caption" fontWeight={600} color="text.primary">{zone.load_demand_kw?.toFixed(0)}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                    </MapContainer>
                )}
            </Paper>
        </Box >
    );
};

export default RiskMap;
