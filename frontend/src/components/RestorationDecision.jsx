import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent,
    Stepper, Step, StepLabel, Button, Chip, Alert, CircularProgress
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { api } from '../services/api';
import {
    Bolt as BoltIcon,
    Groups as CrewIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    TrendingUp as TrendingIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';

const RestorationDecision = () => {
    const [restorationPlan, setRestorationPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [crewCount, setCrewCount] = useState(5);
    const [approving, setApproving] = useState(false);
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        loadRestorationPlan();
    }, [crewCount]);

    const loadRestorationPlan = async () => {
        setLoading(true);
        try {
            const response = await api.getRestorationPlan(null, crewCount);
            setRestorationPlan(response.data);
        } catch (error) {
            console.error('Error loading restoration plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const PHASE_COLORS = ['#EF4444', '#F59E0B', '#FBBF24', '#10B981'];

    const phaseDistribution = restorationPlan?.phases.map((phase, index) => ({
        name: phase.phase.replace('Phase ' + (index + 1) + ' - ', ''),
        value: phase.zone_count,
        color: PHASE_COLORS[index]
    })) || [];

    const handleApprove = () => {
        setApproving(true);
        // Simulate API call
        setTimeout(() => {
            setApproving(false);
            setApproved(true);
            // Auto hide notification after 5s? No, keep it for demo impactful.
        }, 1500);
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: '#e0e7ff', borderRadius: 2, color: '#6C5DD3' }}>
                    <BoltIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        Restoration Decision Support
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Phased restoration strategy based on critical infrastructure priority
                    </Typography>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <CircularProgress size={40} sx={{ color: '#6C5DD3' }} />
                </Box>
            ) : restorationPlan ? (
                <Grid container spacing={3}>
                    {/* Strategy Overview */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={700} color="#374151">Restoration Phases</Typography>
                                <Chip
                                    icon={<CrewIcon style={{ color: '#6C5DD3' }} />}
                                    label={`${crewCount} Crews Active`}
                                    sx={{ bgcolor: '#ede9fe', color: '#6C5DD3', fontWeight: 700 }}
                                />
                            </Box>

                            <Stepper orientation="vertical" nonLinear>
                                {restorationPlan.phases.map((phase, index) => (
                                    <Step key={index} active={true} completed={index === 0}>
                                        <StepLabel
                                            StepIconProps={{
                                                style: { color: PHASE_COLORS[index], fontSize: 24 }
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight={700} color="#1f2937">
                                                {phase.phase}
                                            </Typography>
                                        </StepLabel>
                                        <Box sx={{ pl: 4, py: 1, borderLeft: `2px solid #e5e7eb`, ml: 1.5 }}>
                                            <Alert
                                                severity="info"
                                                icon={false}
                                                sx={{
                                                    mb: 2,
                                                    bgcolor: '#f9fafb',
                                                    border: '1px solid #e5e7eb',
                                                    color: '#4b5563'
                                                }}
                                            >
                                                <strong>Focus:</strong> {phase.description}
                                            </Alert>

                                            <Grid container spacing={2}>
                                                {phase.zones.slice(0, 4).map((zone, zIdx) => (
                                                    <Grid item xs={12} sm={6} key={zIdx}>
                                                        <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="subtitle2" fontWeight={700}>{zone.zone_id}</Typography>
                                                                <Chip label={zone.risk_level} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: `${PHASE_COLORS[index]}20`, color: PHASE_COLORS[index], fontWeight: 700 }} />
                                                            </Box>
                                                            <Typography variant="caption" color="text.secondary">Impact: {zone.impact_score.toFixed(1)}</Typography>
                                                        </Paper>
                                                    </Grid>
                                                ))}
                                                {phase.zones.length > 4 && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="caption" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                                                            + {phase.zones.length - 4} more zones in this phase
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Box>
                                    </Step>
                                ))}
                            </Stepper>
                        </Paper>
                    </Grid>

                    {/* Stats & Controls */}
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                                    <Typography variant="h6" fontWeight={700} color="#374151" gutterBottom>Phase Distribution</Typography>
                                    <Box sx={{ height: 250, width: '100%' }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={phaseDistribution}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {phaseDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <TrendingIcon color="success" />
                                        <Typography variant="h6" fontWeight={700} color="#166534">Estimated Impact</Typography>
                                    </Box>
                                    <Typography variant="body2" color="#15803d" mb={2}>
                                        Executing this plan reduces grid instability by <strong>45% within 2 hours</strong>.
                                    </Typography>
                                    {approved ? (
                                        <Button
                                            variant="contained"
                                            disabled
                                            fullWidth
                                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, bgcolor: '#dcfce7 !important', color: '#166534 !important' }}
                                            startIcon={<AssignmentIcon />}
                                        >
                                            Plan Active (Teams Dispatched)
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            fullWidth
                                            onClick={handleApprove}
                                            disabled={approving}
                                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                                            startIcon={approving ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                                        >
                                            {approving ? 'Dispatching...' : 'Approve Plan'}
                                        </Button>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ) : null}

            <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
                {approved && (
                    <Alert severity="success" variant="filled" sx={{ fontWeight: 700, borderRadius: 2, boxShadow: 4 }}>
                        Restoration Plan Approved! 5 Crews Dispatched.
                    </Alert>
                )}
            </Box>
        </Box>
    );
};

export default RestorationDecision;
