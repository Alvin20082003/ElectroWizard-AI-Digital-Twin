import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, LinearProgress, TextField, Divider, Button, Tooltip } from '@mui/material';
import { Bolt, WindPower, SolarPower, BatteryChargingFull, Refresh } from '@mui/icons-material';

const BESSDashboard = () => {
    // 1. Energy Generation State
    const [solarPower, setSolarPower] = useState(5000000);
    const [windPower, setWindPower] = useState(1200000);
    const [bessPower, setBessPower] = useState(0);

    // 2. Zone Configuration State
    const [zones, setZones] = useState([
        { name: 'Zone 1', id: 'zone1', usage: 600000, threshold: 500000 },
        { name: 'Zone 2', id: 'zone2', usage: 450000, threshold: 400000 },
        { name: 'Zone 3', id: 'zone3', usage: 380000, threshold: 350000 },
        { name: 'Zone 4', id: 'zone4', usage: 320000, threshold: 300000 }
    ]);

    const MAX_SOLAR = 10000000;
    const MAX_WIND = 2000000;
    const MAX_BESS = MAX_SOLAR + MAX_WIND;

    // Simulation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSolarPower(prev => Math.min(MAX_SOLAR, Math.max(2000000, prev + (Math.random() - 0.5) * 500000)));
            setWindPower(prev => Math.min(MAX_WIND, Math.max(500000, prev + (Math.random() - 0.5) * 200000)));

            // Randomly fluctuate usage logic
            setZones(prevZones => prevZones.map(z => ({
                ...z,
                usage: Math.max(0, z.usage + (Math.random() - 0.5) * 50000)
            })));

        }, 4000); // Update every 4s

        return () => clearInterval(interval);
    }, []);

    // Update BESS Total whenever sources change
    useEffect(() => {
        setBessPower(solarPower + windPower);
    }, [solarPower, windPower]);

    // Format number helper
    const fmt = (n) => Math.floor(n).toLocaleString();

    // Power Distribution Logic
    const calculateDistribution = () => {
        let remainingBess = bessPower;

        return zones.map(zone => {
            const usage = zone.usage;
            const threshold = zone.threshold;

            let regular = 0;
            let bessUsed = 0;
            let deficit = 0;

            if (usage <= threshold) {
                regular = usage;
            } else {
                regular = threshold;
                const excess = usage - threshold;
                if (remainingBess >= excess) {
                    bessUsed = excess;
                    remainingBess -= excess;
                } else {
                    bessUsed = remainingBess;
                    remainingBess = 0;
                    deficit = excess - bessUsed;
                }
            }

            return { ...zone, regular, bessUsed, deficit };
        });
    };

    const distributedZones = calculateDistribution();

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#ffffff', fontFamily: 'system-ui' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3748', letterSpacing: '-0.5px' }}>
                        BESS Distribution Dashboard
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#718096' }}>
                        Battery Energy Storage System Control Center
                    </Typography>
                </Box>
                <Button startIcon={<Refresh />} variant="outlined" onClick={() => { }}>
                    Live Data
                </Button>
            </Box>

            {/* Section 1: Energy Generation Cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {/* Solar Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFE0B2 100%)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h2" sx={{ mr: 2 }}>☀️</Typography>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#FF9500', fontWeight: 800 }}>Solar Power</Typography>
                                <Typography variant="caption" sx={{ color: '#718096' }}>Photovoltaic Grid</Typography>
                            </Box>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D3748', mb: 1 }}>{fmt(solarPower)} <span style={{ fontSize: '1rem' }}>kW</span></Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(solarPower / MAX_SOLAR) * 100}
                            sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.5)', '& .MuiLinearProgress-bar': { bgcolor: '#FF9500' } }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', fontWeight: 600 }}>
                            {((solarPower / MAX_SOLAR) * 100).toFixed(1)}% Capacity
                        </Typography>
                    </Paper>
                </Grid>

                {/* Wind Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h2" sx={{ mr: 2 }}>💨</Typography>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#0095FF', fontWeight: 800 }}>Wind Power</Typography>
                                <Typography variant="caption" sx={{ color: '#718096' }}>Turbine Array</Typography>
                            </Box>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D3748', mb: 1 }}>{fmt(windPower)} <span style={{ fontSize: '1rem' }}>kW</span></Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(windPower / MAX_WIND) * 100}
                            sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.5)', '& .MuiLinearProgress-bar': { bgcolor: '#0095FF' } }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', fontWeight: 600 }}>
                            {((windPower / MAX_WIND) * 100).toFixed(1)}% Capacity
                        </Typography>
                    </Paper>
                </Grid>

                {/* BESS Total Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{
                        p: 3,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h2" sx={{ mr: 2 }}>🔋</Typography>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#00C853', fontWeight: 800 }}>BESS Total</Typography>
                                <Typography variant="caption" sx={{ color: '#718096' }}>Available Storage</Typography>
                            </Box>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D3748', mb: 1 }}>{fmt(bessPower)} <span style={{ fontSize: '1rem' }}>kW</span></Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(bessPower / MAX_BESS) * 100}
                            sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.5)', '& .MuiLinearProgress-bar': { bgcolor: '#00C853' } }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', fontWeight: 600 }}>
                            {((bessPower / MAX_BESS) * 100).toFixed(1)}% Combined
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 6 }} />

            {/* Section 2: Zone Power Distribution */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#2D3748' }}>
                Zone Power Distribution Control
            </Typography>

            {/* Threshold Controls */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {zones.map((zone, index) => (
                    <Grid item xs={12} sm={6} md={3} key={zone.id}>
                        <TextField
                            label={`${zone.name} Threshold (kW)`}
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={zone.threshold}
                            onChange={(e) => {
                                const newZones = [...zones];
                                newZones[index].threshold = Number(e.target.value);
                                setZones(newZones);
                            }}
                            sx={{ bgcolor: 'white' }}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Zone Visualization Bars */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {distributedZones.map((zone) => {
                    const totalBarMax = Math.max(zone.usage, zone.threshold * 1.5); // Dynamic scale
                    const regularWidth = (zone.regular / totalBarMax) * 100;
                    const bessWidth = (zone.bessUsed / totalBarMax) * 100;

                    let statusColor = '#0095FF'; // Blue (Regular)
                    if (zone.deficit > 0) statusColor = '#FF4444'; // Red (Deficit)
                    else if (zone.bessUsed > 0) statusColor = '#00C853'; // Green (BESS)

                    return (
                        <Paper key={zone.id} elevation={1} sx={{ p: 2, bgcolor: '#F7FAFC', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3748' }}>{zone.name}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: '#718096' }}>Usage: <b>{fmt(zone.usage)}</b> kW</Typography>
                                    {zone.deficit > 0 && (
                                        <Typography variant="body2" sx={{ color: '#FF4444', fontWeight: 700 }}>Deficit: {fmt(zone.deficit)} kW</Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* The Bar */}
                            <Box sx={{ height: 24, bgcolor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', display: 'flex', position: 'relative' }}>
                                {/* Regular Supply */}
                                <Tooltip title={`Regular Supply: ${fmt(zone.regular)} kW`}>
                                    <Box sx={{
                                        width: `${regularWidth}%`,
                                        background: 'linear-gradient(90deg, #667EEA 0%, #764BA2 100%)',
                                        transition: 'width 0.5s ease-out'
                                    }} />
                                </Tooltip>

                                {/* BESS Supply */}
                                <Tooltip title={`BESS Supply: ${fmt(zone.bessUsed)} kW`}>
                                    <Box sx={{
                                        width: `${bessWidth}%`,
                                        background: 'linear-gradient(90deg, #11998E 0%, #38EF7D 100%)',
                                        transition: 'width 0.5s ease-out'
                                    }} />
                                </Tooltip>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">0 kW</Typography>
                                <Typography variant="caption" color="text.secondary">Threshold: {fmt(zone.threshold)} kW</Typography>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>

            {/* Legend */}
            <Box sx={{ mt: 4, display: 'flex', gap: 4, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, background: 'linear-gradient(90deg, #667EEA 0%, #764BA2 100%)', borderRadius: 1 }} />
                    <Typography variant="body2">Regular Supply</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, background: 'linear-gradient(90deg, #11998E 0%, #38EF7D 100%)', borderRadius: 1 }} />
                    <Typography variant="body2">BESS Supply (Battery)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: '#FF4444', borderRadius: 1 }} />
                    <Typography variant="body2">Power Deficit</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default BESSDashboard;
