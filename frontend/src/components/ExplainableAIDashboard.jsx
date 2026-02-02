import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, TextField, Button, CircularProgress, LinearProgress, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import {
    Search as SearchIcon,
    Psychology as PsychologyIcon,
    LocationOn as LocationIcon,
    Warning as WarningIcon,
    FlashOn as ImpactIcon,
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    Factory as FactoryIcon,
    School as SchoolIcon,
    LocalAtm as AtmIcon,
    ElectricBolt as LoadIcon,
    Timer as TimeIcon,
    BarChart as BarChartIcon,
    SmartToy as BotIcon,
    GpsFixed as TargetIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const ExplainableAIDashboard = () => {
    const [selectedZone, setSelectedZone] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [zoneId, setZoneId] = useState('');

    const COLORS = ['#6C5DD3', '#3B82F6', '#FF9F43', '#FF6B6B', '#2ecc71', '#00b894'];

    const analyzeZone = async (zone) => {
        setLoading(true);
        setSelectedZone(zone);

        try {
            const explainPayload = {
                population_density: zone.population_density || 5000,
                hospital_count: zone.hospital_count || 0,
                industry_count: zone.industry_count || 0,
                school_count: zone.school_count || 0,
                atm_count: zone.atm_count || 0,
                outage_duration_hours: zone.outage_duration_hours || 4.0,
                outage_hour: zone.outage_hour || 14,
                is_peak_hour: zone.is_peak_hour || 1,
                load_demand_kw: zone.load_demand_kw || 5000.0,
                historical_outages: zone.historical_outages || 5,
                equipment_age_years: zone.equipment_age_years || 10,
                transformer_capacity_kva: zone.transformer_capacity_kva || 1000.0,
                weather_encoded: zone.weather_encoded || 0
            };

            const response = await api.getExplanation(explainPayload);
            setExplanation(response.data);
        } catch (error) {
            alert(`Error: ${error.response?.data?.detail || error.message}`);
            setExplanation(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!zoneId.trim()) return;

        setLoading(true);
        try {
            const response = await api.getAllZones(1000);
            const allZones = response.data.zones;

            let zone = allZones.find(z => z.zone_id === zoneId.trim()) ||
                allZones.find(z => z.zone_id.toLowerCase() === zoneId.trim().toLowerCase()) ||
                allZones.find(z => z.zone_id.toLowerCase().includes(zoneId.trim().toLowerCase()));

            if (zone) {
                await analyzeZone(zone);
            } else {
                const suggestions = allZones.slice(0, 5).map(z => z.zone_id).join(', ');
                alert(`Zone not found.\n\nTry: ${suggestions}`);
                setLoading(false);
            }
        } catch (error) {
            alert('Backend error. Check http://localhost:8000');
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'critical': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#fbbf24';
            case 'low': return '#10b981';
            default: return '#94a3b8';
        }
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e0e7ff', borderRadius: 2, color: '#6C5DD3' }}>
                    <PsychologyIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        AI-Powered Zone Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Explainable prediction model for power outage impact
                    </Typography>
                </Box>
            </Box>

            {/* Search Card */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            value={zoneId}
                            onChange={(e) => setZoneId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeClick()}
                            variant="outlined"
                            fullWidth
                            placeholder="e.g., VELACHERY_Z003 or just type 'anna_nagar'"
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#9ca3af', mr: 1 }} />
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 3
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleAnalyzeClick}
                            disabled={loading}
                            startIcon={!loading && <SearchIcon />}
                            sx={{
                                height: 56,
                                background: 'linear-gradient(135deg, #6C5DD3 0%, #3B82F6 100%)',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                boxShadow: '0 4px 10px rgba(108, 93, 211, 0.3)'
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Analyze Zone'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {loading && !explanation ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress size={60} sx={{ color: '#6C5DD3' }} />
                </Box>
            ) : explanation && selectedZone ? (
                <>
                    {/* Top Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #6C5DD3, #5a4ad1)', color: '#fff', borderRadius: 4, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8, mb: 2 }}>
                                        <LocationIcon fontSize="small" />
                                        <Typography variant="overline" fontWeight="700">ZONE ID</Typography>
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: '800' }}>{selectedZone.zone_id}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>{selectedZone.district}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: 'white', border: `2px solid ${getRiskColor(selectedZone.risk_level)}`, borderRadius: 4, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280', mb: 1 }}>
                                        <WarningIcon fontSize="small" sx={{ color: getRiskColor(selectedZone.risk_level) }} />
                                        <Typography variant="overline" fontWeight="700">RISK LEVEL</Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: '800', color: getRiskColor(selectedZone.risk_level) }}>{selectedZone.risk_level}</Typography>
                                    <LinearProgress variant="determinate" value={selectedZone.impact_score} sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: getRiskColor(selectedZone.risk_level) } }} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280', mb: 1 }}>
                                        <ImpactIcon fontSize="small" sx={{ color: '#FF9F43' }} />
                                        <Typography variant="overline" fontWeight="700">IMPACT SCORE</Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: '800', color: '#1f2937' }}>{selectedZone.impact_score?.toFixed(1)}</Typography>
                                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>out of 100</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280', mb: 1 }}>
                                        <PeopleIcon fontSize="small" sx={{ color: '#2ecc71' }} />
                                        <Typography variant="overline" fontWeight="700">POPULATION</Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: '800', color: '#1f2937' }}>{selectedZone.population_density?.toLocaleString()}</Typography>
                                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>people/km²</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Zone Details */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <InfoIcon sx={{ color: '#6C5DD3' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>Zone Details</Typography>
                                </Box>
                                {[
                                    { label: 'Hospitals', value: selectedZone.hospital_count, icon: <HospitalIcon fontSize="small" sx={{ color: '#FF6B6B' }} /> },
                                    { label: 'Industries', value: selectedZone.industry_count, icon: <FactoryIcon fontSize="small" sx={{ color: '#34495e' }} /> },
                                    { label: 'Schools', value: selectedZone.school_count, icon: <SchoolIcon fontSize="small" sx={{ color: '#3B82F6' }} /> },
                                    { label: 'ATMs', value: selectedZone.atm_count, icon: <AtmIcon fontSize="small" sx={{ color: '#10b981' }} /> },
                                    { label: 'Load Demand', value: `${selectedZone.load_demand_kw?.toFixed(0)} kW`, icon: <LoadIcon fontSize="small" sx={{ color: '#FF9F43' }} /> },
                                    { label: 'Outage Duration', value: `${selectedZone.outage_duration_hours}h`, icon: <TimeIcon fontSize="small" sx={{ color: '#6c5ce7' }} /> },
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {item.icon}
                                            <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600 }}>{item.label}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#1f2937', fontWeight: 700 }}>{item.value}</Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>

                        {/* Contributing Factors Chart */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <BarChartIcon sx={{ color: '#3B82F6' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>Top Contributing Factors</Typography>
                                </Box>
                                {explanation.top_factors && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={explanation.top_factors}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="feature" stroke="#9ca3af" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
                                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                            <Bar dataKey="contribution" radius={[6, 6, 0, 0]}>
                                                {explanation.top_factors.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Paper>
                        </Grid>

                        {/* AI Explanation */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 4, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <BotIcon sx={{ color: '#16a34a' }} />
                                        <Typography variant="h6" sx={{ color: '#16a34a', fontWeight: 800 }}>AI Explanation</Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
                                        {explanation.explanation}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Feature Breakdown */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <TargetIcon sx={{ color: '#FF6B6B' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>Feature Impact Breakdown</Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    {explanation.top_factors?.map((factor, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card elevation={0} sx={{ bgcolor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 3, transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                                                            {factor.feature.replace(/_/g, ' ')}
                                                        </Typography>
                                                        <Chip
                                                            label={`+${factor.contribution.toFixed(1)}`}
                                                            size="small"
                                                            sx={{ bgcolor: `${COLORS[i % COLORS.length]}15`, color: COLORS[i % COLORS.length], fontWeight: 'bold' }}
                                                        />
                                                    </Box>
                                                    <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 800 }}>
                                                        {factor.value}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min((Math.abs(factor.contribution) / 30) * 100, 100)}
                                                        sx={{
                                                            mt: 2,
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: '#e5e7eb',
                                                            '& .MuiLinearProgress-bar': { bgcolor: COLORS[i % COLORS.length] }
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Paper elevation={0} sx={{ p: 8, textAlign: 'center', bgcolor: 'white', border: '2px dashed #e5e7eb', borderRadius: 4 }}>
                    <SearchIcon sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#4b5563', mb: 1, fontWeight: 700 }}>Calculate Impact Prediction</Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Enter a Zone ID (e.g., <Box component="span" sx={{ color: '#6C5DD3', fontWeight: 600 }}>VELACHERY_Z003</Box>) to generate AI insights
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default ExplainableAIDashboard;
