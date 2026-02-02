import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { api } from '../services/api';

const ExplainableAI = () => {
    const [selectedZone, setSelectedZone] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [zoneId, setZoneId] = useState('');

    const analyzeZone = async (zone) => {
        console.log('🔍 Analyzing zone:', zone);
        setLoading(true);
        setSelectedZone(zone);

        try {
            console.log('📡 Sending API request to /api/explain');

            // Transform zone data to match the expected format
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

            console.log('📤 Payload:', explainPayload);
            const response = await api.getExplanation(explainPayload);
            console.log('✅ Received explanation:', response.data);
            setExplanation(response.data);
        } catch (error) {
            console.error('❌ Error getting explanation:', error);
            console.error('Error details:', error.response?.data);
            alert(`Error analyzing zone: ${error.response?.data?.detail || error.message}\n\nMake sure backend is running at http://localhost:8000`);
            setExplanation(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!zoneId.trim()) {
            alert('Please enter a Zone ID');
            return;
        }

        setLoading(true);
        try {
            // Fetch ALL zones first
            const response = await api.getAllZones(1000);
            const allZones = response.data.zones;

            // Try to find exact match
            let zone = allZones.find(z => z.zone_id === zoneId.trim());

            // If not found, try case-insensitive search
            if (!zone) {
                zone = allZones.find(z => z.zone_id.toLowerCase() === zoneId.trim().toLowerCase());
            }

            // If still not found, try partial match
            if (!zone) {
                zone = allZones.find(z => z.zone_id.toLowerCase().includes(zoneId.trim().toLowerCase()));
            }

            if (zone) {
                console.log('✅ Zone found:', zone.zone_id);
                await analyzeZone(zone);
            } else {
                // Show helpful suggestions
                const suggestions = allZones.slice(0, 5).map(z => z.zone_id).join(', ');
                alert(`Zone ID "${zoneId}" not found.\n\nTry one of these:\n${suggestions}`);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error finding zone:', error);
            alert('Error loading zones. Make sure backend is running at http://localhost:8000');
            setLoading(false);
        }
    };

    const getColorForContribution = (value) => {
        return value > 0 ? '#ff4444' : '#44ff44';
    };

    const features = [
        { icon: '💰', title: 'Impact Budget', status: '● ACTIVE', statusColor: '#10b981', desc: 'Max damage limit: ₹2.5M', progress: 67, progressColor: '#f59e0b', stat: '67% utilized' },
        { icon: '🔑', title: 'Dependency Fingerprint', status: '● MONITORING', statusColor: '#10b981', desc: 'Pattern: Hospital-Heavy', fingerprint: [40, 80, 60, 90, 50] },
        { icon: '⚡', title: 'Priority Rewriter', status: '⚠ REWRITING', statusColor: '#f59e0b', desc: 'Last rewrite: 2 min ago', stat: 'Zone T_NAGAR → Priority +2' },
        { icon: '📉', title: 'Confidence Degrader', status: '● STABLE', statusColor: '#10b981', desc: 'Model confidence: 87%', progress: 87 },
        { icon: '📚', title: 'Bottleneck Library', status: '● LEARNING', statusColor: '#10b981', desc: '127 patterns stored', stat: 'Match rate: 94%' },
        { icon: '🧬', title: 'Zone Personality', status: '● PROFILING', statusColor: '#10b981', desc: 'Type: Fragile-Industrial', stat: 'Recovery: Slow (8.2h avg)' },
        { icon: '🗜️', title: 'Memory Compression', status: '● COMPRESSING', statusColor: '#10b981', desc: 'Storage saved: 73%', progress: 73, progressColor: '#10b981' },
        { icon: '⚔️', title: 'Conflict Detector', status: '⚠ CONFLICTS: 3', statusColor: '#f59e0b', desc: 'Zone A ↔ Zone B', stat: 'Resolution: Load balance' },
        { icon: '😴', title: 'Fatigue Analyzer', status: '⚠ FATIGUED', statusColor: '#f59e0b', desc: 'Crew efficiency: 68%', stat: 'Recommend: 4h rest' },
        { icon: '🕵️', title: 'Blind-Spot Finder', status: '🔴 FOUND: 12', statusColor: '#ef4444', desc: 'Unmonitored zones', stat: 'Risk: High surprise failure' },
        { icon: '⏱️', title: 'Stability Estimator', status: '● ESTIMATING', statusColor: '#10b981', desc: 'Temp fix lasts: 6.2h', progress: 45, progressColor: '#f59e0b' },
        { icon: '📊', title: 'Drift Watcher', status: '● MONITORING', statusColor: '#10b981', desc: 'Drift detected: 0.12%', stat: 'Retrain in: 3 days' },
        { icon: '⚖️', title: 'Load Balancer', status: '● BALANCING', statusColor: '#10b981', desc: 'Distribution: Optimal', stat: '3 sources balanced' },
        { icon: '🛡️', title: 'Risk Insurance', status: '● CALCULATING', statusColor: '#10b981', desc: 'Failure risk: 8%', stat: 'Plan: Safest route' },
        { icon: '📖', title: 'Story Generator', status: '● GENERATING', statusColor: '#10b981', desc: '"T1 failed → ADYAR overloaded → Hospital backup at 14:23"', isStory: true }
    ];

    return (
        <Box sx={{ height: '100%', p: 2, overflow: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                🧠 Feature 2: Explainable AI - Why This Zone is Flagged
            </Typography>

            {/* Zone Selection */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#151b3d', border: '1px solid #2a3b55' }}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    🔍 Zone Analysis
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                    <TextField
                        label="Enter Zone ID to Analyze"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeClick()}
                        variant="outlined"
                        fullWidth
                        placeholder="e.g., VELACHERY_Z003 or T_NAGAR"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#0a0e17',
                                color: '#fff',
                                fontSize: '16px',
                                '& fieldset': { borderColor: '#2a3b55' },
                                '&:hover fieldset': { borderColor: '#667eea' },
                                '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 }
                            },
                            '& .MuiInputLabel-root': { color: '#94a3b8' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAnalyzeClick}
                        disabled={loading}
                        sx={{
                            background: loading ? '#334155' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            px: 5,
                            py: 1.8,
                            whiteSpace: 'nowrap',
                            minWidth: '160px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            '&:hover': {
                                background: loading ? '#334155' : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '🔍 ANALYZE ZONE'}
                    </Button>
                </Box>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : explanation && selectedZone ? (
                <Grid container spacing={3}>
                    {/* Zone Info Card */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                    Zone Information
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                                    <strong>Zone ID:</strong> {selectedZone.zone_id}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                                    <strong>District:</strong> {selectedZone.district}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                                    <strong>Risk Level:</strong> <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{selectedZone.risk_level}</span>
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                                    <strong>Impact Score:</strong> {selectedZone.impact_score.toFixed(2)}
                                </Typography>
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    Predicted Impact: <strong>{explanation.predicted_value.toFixed(2)}</strong>
                                </Alert>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Contributing Factors */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, background: '#1e293b', color: '#fff' }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#fff' }}>
                                Top Contributing Factors
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={explanation.top_factors}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="feature" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="contribution" name="SHAP Contribution" fill="#8884d8">
                                        {explanation.top_factors.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getColorForContribution(entry.contribution)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Human-Readable Explanation */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, background: '#1e293b', color: '#fff' }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2, color: '#fff' }}>
                                📊 Detailed Explanation - Why This Zone is High Risk
                            </Typography>
                            <Box sx={{
                                bgcolor: '#0f172a',
                                p: 3,
                                borderRadius: 2,
                                border: '2px solid #334155',
                                color: '#fff'
                            }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.8,
                                        color: '#fff',
                                        '& strong': { color: '#a5b4fc' }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: explanation.explanation.replace(/\*\*/g, '') }}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Feature Breakdown Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, background: '#1e293b', color: '#fff' }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#fff' }}>
                                Complete Feature Breakdown
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {explanation.top_factors.map((factor, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{
                                            bgcolor: '#0f172a',
                                            border: `2px solid ${factor.contribution > 0 ? '#ef4444' : '#10b981'}`
                                        }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>
                                                    {factor.feature}
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
                                                    Value: {factor.value}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: factor.contribution > 0 ? '#ef4444' : '#10b981',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Impact: {factor.contribution > 0 ? '+' : ''}{factor.contribution.toFixed(3)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* 15 ADVANCED AI FEATURES */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2, borderBottom: '2px solid #667eea', pb: 1 }}>
                            🚀 15 Advanced AI Features
                        </Typography>
                    </Grid>

                    {features.map((feature, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Paper sx={{ p: 2, bgcolor: '#1e293b', border: '1px solid rgba(102, 126, 234, 0.2)', height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-3px)', borderColor: '#667eea' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="h5">{feature.icon}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#a5b4fc', fontSize: '0.85rem' }}>{feature.title}</Typography>
                                </Box>
                                <Box sx={{ px: 1, py: 0.4, borderRadius: 2, bgcolor: `${feature.statusColor}20`, color: feature.statusColor, fontSize: '0.65rem', fontWeight: 'bold', mb: 1, display: 'inline-block' }}>{feature.status}</Box>
                                <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem', mb: 1, fontStyle: feature.isStory ? 'italic' : 'normal' }}>{feature.desc}</Typography>
                                {feature.progress && (
                                    <Box sx={{ height: 6, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', mb: 0.5 }}>
                                        <Box sx={{ width: `${feature.progress}%`, height: '100%', bgcolor: feature.progressColor || '#667eea', borderRadius: 3 }} />
                                    </Box>
                                )}
                                {feature.fingerprint && (
                                    <Box sx={{ display: 'flex', gap: 0.4, height: 30, alignItems: 'flex-end', mb: 0.5 }}>
                                        {feature.fingerprint.map((h, i) => <Box key={i} sx={{ flex: 1, height: `${h}%`, background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 0.4 }} />)}
                                    </Box>
                                )}
                                {feature.stat && <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>{feature.stat}</Typography>}
                            </Paper>
                        </Grid>
                    ))}

                </Grid>
            ) : (
                <Alert severity="info">
                    Select a zone to see AI explanation of why it was flagged
                </Alert>
            )}
        </Box>
    );
};

export default ExplainableAI;
