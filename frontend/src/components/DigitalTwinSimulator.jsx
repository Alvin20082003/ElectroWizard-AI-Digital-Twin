import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel, Button, Slider, Alert, Chip, CircularProgress } from '@mui/material';
import {
    Science as ScienceIcon,
    Settings as SettingsIcon,
    PlayArrow as PlayIcon,
    Timeline as TimelineIcon,
    AttachMoney as MoneyIcon,
    Cloud as CloudIcon,
    Bolt as BoltIcon,
    Warning as WarningIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { api } from '../services/api';

const DigitalTwinSimulator = () => {
    const [outageCause, setOutageCause] = useState('Equipment Failure');
    const [originZone, setOriginZone] = useState('');
    const [duration, setDuration] = useState(10);
    const [simulationResult, setSimulationResult] = useState(null);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadZones();
    }, []);

    const loadZones = async () => {
        try {
            const response = await api.getAllZones(100);
            setZones(response.data.zones);
            if (response.data.zones.length > 0) {
                setOriginZone(response.data.zones[0].zone_id);
            }
        } catch (error) {
            console.error('Error loading zones:', error);
        }
    };

    const runSimulation = async () => {
        setLoading(true);
        try {
            const response = await api.runSimulation(outageCause, originZone, duration);
            setSimulationResult(response.data);
        } catch (error) {
            console.error('Simulation error:', error);
            alert('Simulation failed. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // Dummy data generation for charts based on result
    const generateImpactData = () => {
        if (!simulationResult) return [];
        return [
            { time: '0h', impact: 0 },
            { time: '1h', impact: simulationResult.impact.affected_zones * 0.2 },
            { time: '2h', impact: simulationResult.impact.affected_zones * 0.5 },
            { time: '3h', impact: simulationResult.impact.affected_zones * 0.8 },
            { time: '4h', impact: simulationResult.impact.affected_zones },
        ];
    };

    const generateCostData = () => {
        if (!simulationResult) return [];
        return [
            { category: 'Direct', amount: simulationResult.impact.economic_loss * 0.4 },
            { category: 'Indirect', amount: simulationResult.impact.economic_loss * 0.3 },
            { category: 'Recovery', amount: simulationResult.impact.economic_loss * 0.3 },
        ];
    };

    const COLORS = ['#6C5DD3', '#3B82F6', '#FF9F43'];

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e0e7ff', borderRadius: 2, color: '#6C5DD3' }}>
                    <ScienceIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        Digital Twin Simulator
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Predict cascading failures and simulate "what-if" scenarios
                    </Typography>
                </Box>
            </Box>

            {/* Alert */}
            <Alert
                severity="info"
                icon={<ScienceIcon />}
                sx={{
                    mb: 4,
                    bgcolor: 'white',
                    border: '1px solid #e0e7ff',
                    color: '#4338ca',
                    borderRadius: 3,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    '& .MuiAlert-icon': { color: '#6C5DD3' }
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    CASCADING FAILURE SIMULATION ACTIVE
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    This model uses topological grid data to predict how failure propagates from <strong>{originZone || 'Source'}</strong>.
                </Typography>
            </Alert>

            <Grid container spacing={3}>
                {/* Control Panel */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <SettingsIcon sx={{ color: '#6b7280' }} />
                            <Typography variant="h6" sx={{ color: '#374151', fontWeight: 700 }}>Parameters</Typography>
                        </Box>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Outage Cause</InputLabel>
                            <Select
                                value={outageCause}
                                label="Outage Cause"
                                onChange={(e) => setOutageCause(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="Equipment Failure">Equipment Failure</MenuItem>
                                <MenuItem value="Weather Event">Weather Event</MenuItem>
                                <MenuItem value="Overload">Overload</MenuItem>
                                <MenuItem value="Maintenance Error">Maintenance Error</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Origin Zone</InputLabel>
                            <Select
                                value={originZone}
                                label="Origin Zone"
                                onChange={(e) => setOriginZone(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                {zones.slice(0, 50).map((zone) => (
                                    <MenuItem key={zone.zone_id} value={zone.zone_id}>
                                        {zone.zone_id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontWeight: 500 }}>
                                Simulation Duration: <Box component="span" sx={{ color: '#6C5DD3', fontWeight: 700 }}>{duration} Hours</Box>
                            </Typography>
                            <Slider
                                value={duration}
                                onChange={(e, val) => setDuration(val)}
                                min={1}
                                max={24}
                                marks
                                sx={{
                                    color: '#6C5DD3',
                                    '& .MuiSlider-thumb': { boxShadow: '0 0 0 5px rgba(108, 93, 211, 0.1)' }
                                }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={runSimulation}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
                            sx={{
                                height: 56,
                                background: 'linear-gradient(135deg, #6C5DD3 0%, #3B82F6 100%)',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                textTransform: 'none',
                                boxShadow: '0 8px 20px rgba(108, 93, 211, 0.3)'
                            }}
                        >
                            {loading ? 'Simulating...' : 'Run Simulation'}
                        </Button>
                    </Paper>
                </Grid>

                {/* Results */}
                <Grid item xs={12} md={8}>
                    {simulationResult ? (
                        <Grid container spacing={3}>
                            {/* Impact Stats */}
                            <Grid item xs={12} md={4}>
                                <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3, textAlign: 'center' }}>
                                    <CardContent>
                                        <Typography variant="overline" color="text.secondary" fontWeight={700}>Economic Loss</Typography>
                                        <Typography variant="h4" sx={{ color: '#FF9F43', fontWeight: 800, my: 1 }}>
                                            ₹{(simulationResult.impact.economic_loss / 100000).toFixed(1)}L
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#f59e0b' }}>
                                            <MoneyIcon fontSize="small" /> <Typography variant="caption">Predicted</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3, textAlign: 'center' }}>
                                    <CardContent>
                                        <Typography variant="overline" color="text.secondary" fontWeight={700}>Emissions</Typography>
                                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 800, my: 1 }}>
                                            {simulationResult.impact.carbon_tons.toFixed(1)}t
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#10b981' }}>
                                            <CloudIcon fontSize="small" /> <Typography variant="caption">CO2 Estimate</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3, textAlign: 'center' }}>
                                    <CardContent>
                                        <Typography variant="overline" color="text.secondary" fontWeight={700}>Impact Area</Typography>
                                        <Typography variant="h4" sx={{ color: '#EF4444', fontWeight: 800, my: 1 }}>
                                            {simulationResult.impact.affected_zones}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: '#EF4444' }}>
                                            <BoltIcon fontSize="small" /> <Typography variant="caption">Zones Down</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Charts Section */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Impact Propagation</Typography>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={generateImpactData()}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ border: 'none', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" dataKey="impact" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Cost Breakdown</Typography>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={generateCostData()}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="category" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ border: 'none', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                                {generateCostData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* Timeline */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <TimelineIcon sx={{ color: '#3B82F6' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151' }}>Cascade Event Timeline</Typography>
                                    </Box>

                                    {simulationResult.timeline.map((event, idx) => (
                                        <Box key={idx} sx={{ display: 'flex', mb: 2, position: 'relative', '&:last-child': { mb: 0 } }}>
                                            {/* Vertical Line */}
                                            {idx !== simulationResult.timeline.length - 1 && (
                                                <Box sx={{ position: 'absolute', left: 14, top: 32, bottom: -16, width: 2, bgcolor: '#e5e7eb' }} />
                                            )}

                                            <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: event.status === 'critical' ? '#fee2e2' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0, zIndex: 1 }}>
                                                {event.status === 'critical' ? <WarningIcon sx={{ fontSize: 16, color: '#ef4444' }} /> : <HistoryIcon sx={{ fontSize: 16, color: '#f59e0b' }} />}
                                            </Box>

                                            <Box sx={{ flex: 1, p: 2, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #f3f4f6' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937' }}>{event.event}</Typography>
                                                    <Chip label={event.time} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#e0e7ff', color: '#4338ca' }} />
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#6b7280' }}>{event.detail}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: 'white', border: '2px dashed #e5e7eb', borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ p: 3, bgcolor: '#f0f9ff', borderRadius: '50%', mb: 2 }}>
                                <ScienceIcon sx={{ fontSize: 40, color: '#3B82F6' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: '#374151', mb: 1, fontWeight: 700 }}>
                                Ready to Simulate
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: 400 }}>
                                Configure the parameters on the left and start the digital twin simulation to see predictive analytics.
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DigitalTwinSimulator;
