import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Alert, Chip, Card, CardContent, LinearProgress, CircularProgress } from '@mui/material';
import { api } from '../services/api';
import {
    SmartToy as BotIcon,
    Engineering as WorkerIcon,
    Bolt as BoltIcon,
    Build as ToolIcon,
    Timeline as TimelineIcon,
    CheckCircle as CheckIcon,
    AccessTime as TimeIcon,
    Assignment as PlanIcon,
    AutoGraph as OptimizationIcon,
    Psychology as PsychologyIcon
} from '@mui/icons-material';

const AIRestorationPlanner = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        loadZones();
    }, []);

    // Real-time countdown effect
    useEffect(() => {
        if (!plan) return;

        const timer = setInterval(() => {
            setPlan(prevPlan => {
                if (!prevPlan) return null;
                return {
                    ...prevPlan,
                    plan: prevPlan.plan.map(step => ({
                        ...step,
                        seconds_remaining: Math.max(0, step.seconds_remaining - 1)
                    }))
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [plan]);

    const loadZones = async () => {
        try {
            const response = await api.getAllZones(1000, 'Critical');
            setZones(response.data.zones);
        } catch (error) {
            console.error('Error loading zones:', error);
        }
    };

    const generatePlan = async () => {
        setLoading(true);
        try {
            // Get top 5 critical zones
            const criticalZoneIds = zones.slice(0, 5).map(z => z.zone_id);
            const response = await api.getAIRestorationPlan(criticalZoneIds, 5);

            // Add seconds property for real-time countdown
            const planWithSeconds = {
                ...response.data,
                plan: response.data.plan.map(step => ({
                    ...step,
                    seconds_remaining: step.eta_minutes * 60
                }))
            };
            setPlan(planWithSeconds);
        } catch (error) {
            console.error('Error generating plan:', error);
            alert('Failed to generate plan. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e0e7ff', borderRadius: 2, color: '#6C5DD3' }}>
                    <BotIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        AI Restoration Planner
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Autonomous decision support for grid recovery operations
                    </Typography>
                </Box>
            </Box>

            <Alert
                severity="info"
                icon={<BotIcon />}
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
                    AI DECIPHERING OPTIMAL PATH
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    This module uses constraint programming to sequence restoration steps. It balances crew fatigue, travel time, and critical load priority to generate an optimal schedule in seconds.
                </Typography>
            </Alert>

            {!plan && (
                <Paper elevation={0} sx={{ p: 8, textAlign: 'center', bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 4, position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, bgcolor: '#e0e7ff', borderRadius: '50%', opacity: 0.5, zIndex: 0 }} />
                        <BotIcon sx={{ fontSize: 60, color: '#6C5DD3', position: 'relative', zIndex: 1 }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#1f2937', fontWeight: 800, mb: 2 }}>
                        Ready to Optimize
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', mb: 4, maxWidth: 500 }}>
                        The AI needs to analyze current grid state, active faults, and available resources to generate a restoration strategy.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={generatePlan}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <OptimizationIcon />}
                        sx={{
                            px: 5,
                            py: 1.5,
                            background: 'linear-gradient(135deg, #6C5DD3 0%, #3B82F6 100%)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: 3,
                            textTransform: 'none',
                            boxShadow: '0 8px 20px rgba(108, 93, 211, 0.3)'
                        }}
                    >
                        {loading ? 'Generating Strategy...' : 'Generate Restoration Plan'}
                    </Button>
                </Paper>
            )}

            {plan && (
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3, textAlign: 'center', height: '100%' }}>
                            <CardContent>
                                <Typography variant="overline" color="text.secondary" fontWeight={700}>Total Steps</Typography>
                                <Typography variant="h3" sx={{ color: '#1f2937', fontWeight: 800, my: 1 }}>{plan.total_steps}</Typography>
                                <Chip label="Sequenced" size="small" sx={{ bgcolor: '#e5e7eb', fontWeight: 600 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3, textAlign: 'center', height: '100%' }}>
                            <CardContent>
                                <Typography variant="overline" color="text.secondary" fontWeight={700}>Est. Duration</Typography>
                                <Typography variant="h3" sx={{ color: '#3B82F6', fontWeight: 800, my: 1 }}>
                                    {Math.floor(plan.estimated_total_time / 60)}h {plan.estimated_total_time % 60}m
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <TimeIcon fontSize="small" color="primary" /> <Typography variant="caption" color="primary">Optimized Time</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 3, textAlign: 'center', height: '100%' }}>
                            <CardContent>
                                <Typography variant="overline" color="text.secondary" fontWeight={700}>Strategy Type</Typography>
                                <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 800, my: 1 }}>AI-Driven</Typography>
                                <Chip label="High Efficiency" size="small" sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Timeline Plan */}
                    <Grid item xs={12}>
                        <Box sx={{ position: 'relative', ml: 2, borderLeft: '2px solid #e5e7eb', pl: 4, py: 2 }}>
                            {plan.plan.map((step, idx) => (
                                <Box key={idx} sx={{ mb: 4, position: 'relative' }}>
                                    {/* Timeline Dot */}
                                    <Box sx={{
                                        position: 'absolute',
                                        left: -41,
                                        top: 0,
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        bgcolor: step.priority === 'Critical' ? '#ef4444' : '#3B82F6',
                                        border: '4px solid white',
                                        boxShadow: '0 0 0 2px #e5e7eb'
                                    }} />

                                    <Card elevation={0} sx={{
                                        bgcolor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        borderLeft: `4px solid ${step.priority === 'Critical' ? '#ef4444' : '#3B82F6'}`
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                        <Chip
                                                            label={`Step ${step.step}`}
                                                            size="small"
                                                            sx={{ bgcolor: '#f3f4f6', fontWeight: 700, color: '#4b5563' }}
                                                        />
                                                        <Chip
                                                            label={step.priority === 'Critical' ? 'Critical Path' : 'Standard Ops'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: step.priority === 'Critical' ? '#fee2e2' : '#e0f2fe',
                                                                color: step.priority === 'Critical' ? '#991b1b' : '#0369a1',
                                                                fontWeight: 700
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 800 }}>
                                                        {step.action} - {step.zone_id}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>ETA</Typography>
                                                    <Typography variant="h6" sx={{ color: '#3B82F6', fontWeight: 800, fontFamily: 'monospace' }}>
                                                        {Math.floor(step.seconds_remaining / 60)}:{(step.seconds_remaining % 60).toString().padStart(2, '0')} min
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, mb: 3 }}>
                                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                    <PsychologyIcon fontSize="small" sx={{ color: '#6C5DD3' }} />
                                                    <Typography variant="subtitle2" sx={{ color: '#6C5DD3', fontWeight: 700 }}>AI Reasoning</Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                                                    {step.reasoning}
                                                </Typography>
                                            </Paper>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Chip icon={<WorkerIcon />} label="Crew A" size="small" variant="outlined" />
                                                    <Chip icon={<BoltIcon />} label="Power Check" size="small" variant="outlined" />
                                                    <Chip icon={<ToolIcon />} label="Repair" size="small" variant="outlined" />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setPlan(null)}
                            sx={{ py: 1.5, borderColor: '#e5e7eb', color: '#6b7280', '&:hover': { borderColor: '#d1d5db', bgcolor: '#f9fafb' } }}
                        >
                            Reset & Generate New Plan
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default AIRestorationPlanner;
