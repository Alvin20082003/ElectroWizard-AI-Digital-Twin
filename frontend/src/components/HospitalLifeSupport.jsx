import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent, Chip, Alert, Grid, LinearProgress, CircularProgress } from '@mui/material';
import { api } from '../services/api';
import {
    LocalHospital as HospitalIcon,
    BatteryAlert as BatteryIcon,
    Phone as PhoneIcon,
    People as PeopleIcon,
    Timer as TimerIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    LocalPharmacy as IcuIcon
} from '@mui/icons-material';

const HospitalLifeSupport = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHospitals();

        // Real-time seconds countdown (1s = 1s)
        const timer = setInterval(() => {
            setHospitals(currentHospitals =>
                currentHospitals.map(h => {
                    // Check if it's already in MM:SS format
                    let minutes = 0;
                    let seconds = 0;

                    if (h.backup_status.includes(':')) {
                        const parts = h.backup_status.split(':');
                        minutes = parseInt(parts[0]);
                        seconds = parseInt(parts[1]);
                    } else {
                        // Initial format (e.g. "45")
                        minutes = parseInt(h.backup_status);
                        seconds = 0;
                    }

                    if (!isNaN(minutes)) {
                        let totalSeconds = (minutes * 60) + seconds;

                        if (totalSeconds > 0) {
                            totalSeconds -= 1;

                            const newMins = Math.floor(totalSeconds / 60);
                            const newSecs = totalSeconds % 60;
                            // Format as MM:SS (e.g. 09:59)
                            const formatted = `${newMins.toString().padStart(2, '0')}:${newSecs.toString().padStart(2, '0')}`;

                            return { ...h, backup_status: formatted };
                        }
                    }
                    return h;
                })
            );
        }, 1000); // Exact 1 second interval

        return () => clearInterval(timer);
    }, []);

    const loadHospitals = async () => {
        try {
            const response = await api.getHospitals();
            setHospitals(response.data.hospitals);
            setLoading(false);
        } catch (error) {
            console.error('Error loading hospitals:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress size={60} sx={{ color: '#6C5DD3' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: '#fee2e2', borderRadius: 2, color: '#ef4444' }}>
                    <HospitalIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        Hospital Life-Support
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Critical facility power monitoring and emergency escalation
                    </Typography>
                </Box>
            </Box>

            <Alert
                severity="error"
                icon={<BatteryIcon />}
                sx={{
                    mb: 4,
                    bgcolor: 'white',
                    border: '1px solid #fee2e2',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    color: '#b91c1c',
                    borderRadius: 3,
                    '& .MuiAlert-icon': { color: '#ef4444' }
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    ACTIVE EMERGENCY MONITORING
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {hospitals.length > 0 ? (
                        <>Tracking <strong>{hospitals.length} hospitals</strong> running on backup power. Auto-alert protocols initiated.</>
                    ) : (
                        <>All hospitals operating on main grid power. Monitoring active.</>
                    )}
                </Typography>
            </Alert>

            <Grid container spacing={3}>
                {hospitals.map((hospital, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Card elevation={0} sx={{ bgcolor: 'white', border: '1px solid #fee2e2', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)' }}>
                            <Box sx={{ bgcolor: '#fef2f2', p: 2, borderBottom: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <HospitalIcon sx={{ color: '#ef4444' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#991b1b' }}>
                                        {hospital.name || 'Critical Care Center'}
                                    </Typography>
                                </Box>
                                <Chip
                                    label="RUNNING ON BACKUP"
                                    icon={<WarningIcon style={{ color: 'white' }} />}
                                    sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 800 }}
                                />
                            </Box>

                            <CardContent sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Backup Status</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={(parseInt(hospital.backup_status) / 120) * 100}
                                                    sx={{
                                                        color: parseInt(hospital.backup_status) < 10 ? '#b91c1c' : '#ef4444',
                                                        transition: 'all 0.5s ease'
                                                    }}
                                                    size={50}
                                                />
                                                <Box>
                                                    <Typography variant="h5" sx={{
                                                        fontWeight: 800,
                                                        color: '#1f2937',
                                                        animation: parseInt(hospital.backup_status) < 5 ? 'pulse 1s infinite' : 'none',
                                                        '@keyframes pulse': {
                                                            '0%': { color: '#1f2937' },
                                                            '50%': { color: '#ef4444' },
                                                            '100%': { color: '#1f2937' }
                                                        }
                                                    }}>
                                                        {hospital.backup_status}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>Time Remaining</Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                                            <PhoneIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                            <Typography variant="caption" sx={{ color: '#4b5563' }}>EB Head alerted via Auto-Call</Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Patient Impact</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                <Box sx={{ p: 1.5, bgcolor: '#e0f2fe', borderRadius: 2 }}>
                                                    <IcuIcon sx={{ color: '#0284c7' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>{hospital.icu_patients}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>ICU Patients at Risk</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 2, height: '100%' }}>
                                            <Typography variant="subtitle2" sx={{ color: '#991b1b', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WarningIcon fontSize="small" /> Critical Alert
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                                                {hospital.why_matters || "Power failure threatens O2 supply systems. Immediate restoration required to prevent casualties."}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {hospitals.length === 0 && (
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', bgcolor: 'white', border: '2px dashed #e5e7eb', borderRadius: 4 }}>
                            <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: '50%', display: 'inline-flex', mb: 2 }}>
                                <CheckIcon sx={{ fontSize: 40, color: '#10b981' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: '#374151', mb: 1, fontWeight: 700 }}>
                                System Normal
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                All critical healthcare facilities are operating on main power grid.
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default HospitalLifeSupport;
