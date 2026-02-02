import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent,
    Alert, Chip, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, LinearProgress, Button, CircularProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../services/api';
import {
    Dashboard as DashboardIcon,
    Warning as WarningIcon,
    NotificationsActive as AlertIcon,
    CheckCircle as CheckIcon,
    LocalHospital as HospitalIcon,
    Factory as FactoryIcon,
    School as SchoolIcon,
    TrendingUp as TrendingIcon,
    History as HistoryIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';

const ResponseManagement = () => {
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [recentOutages, setRecentOutages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const statsResponse = await api.getStatistics();
            setStats(statsResponse.data);

            const criticalZones = await api.getAllZones(50, 'Critical');
            const highZones = await api.getAllZones(50, 'High');

            const newAlerts = [
                ...criticalZones.data.zones.slice(0, 5).map(zone => ({
                    severity: 'error',
                    message: `CRITICAL: ${zone.zone_id} in ${zone.district} - ${zone.hospital_count} hospitals affected`,
                    timestamp: new Date().toLocaleTimeString(),
                    zone: zone
                })),
                ...highZones.data.zones.slice(0, 5).map(zone => ({
                    severity: 'warning',
                    message: `HIGH RISK: ${zone.zone_id} in ${zone.district} - ${zone.industry_count} industries affected`,
                    timestamp: new Date().toLocaleTimeString(),
                    zone: zone
                }))
            ];

            setAlerts(newAlerts);

            const allZones = await api.getAllZones(20);
            setRecentOutages(allZones.data.zones);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const districtData = stats ? Object.entries(stats.districts).map(([district, data]) => ({
        district: district.substring(0, 10),
        impact: data.avg_impact.toFixed(1),
        zones: data.total_zones
    })) : [];

    const riskData = stats ? [
        { name: 'Critical', value: stats.critical_zones, color: '#FF4444' },
        { name: 'High', value: stats.high_risk_zones, color: '#FF6B00' },
        { name: 'Medium', value: stats.risk_distribution.Medium || 0, color: '#FFD700' },
        { name: 'Low', value: stats.risk_distribution.Low || 0, color: '#00C851' }
    ] : [];

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
                <Box sx={{ p: 1.5, bgcolor: '#e0e7ff', borderRadius: 2, color: '#6C5DD3' }}>
                    <DashboardIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        Response Management Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Central command for emergency response dispatch and monitoring
                    </Typography>
                </Box>
            </Box>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #6C5DD3 0%, #a29bfe 100%)', color: '#fff', borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold">{stats.total_zones.toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Zones Monitored</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', color: '#fff', borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold">{stats.critical_zones}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Critical Alerts Active</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #60a5fa 100%)', color: '#fff', borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold">{stats.total_hospitals}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Hospitals Monitored</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', color: '#fff', borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold">{stats.total_industries}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Industries Monitored</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Real-time Alerts */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <AlertIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="h6" fontWeight={700} color="#374151">
                        Real-Time Alerts
                    </Typography>
                </Box>
                {alerts.slice(0, 5).map((alert, index) => (
                    <Alert
                        key={index}
                        severity={alert.severity}
                        sx={{ mb: 1.5, borderRadius: 2 }}
                        action={
                            <Chip label={alert.timestamp} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 600 }} />
                        }
                    >
                        <strong>{alert.message}</strong>
                    </Alert>
                ))}
            </Paper>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                        <Typography variant="subtitle1" fontWeight={700} color="#374151" gutterBottom>
                            District-wise Impact Analysis
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={districtData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="district" stroke="#9ca3af" tick={{ fontSize: 10 }} height={60} />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ borderRadius: 8 }} />
                                <Bar dataKey="impact" fill="#6C5DD3" radius={[4, 4, 0, 0]} name="Avg Impact Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                        <Typography variant="subtitle1" fontWeight={700} color="#374151" gutterBottom>
                            Risk Level Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={riskData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ borderRadius: 8 }} />
                                <Bar dataKey="value" fill="#8884d8" name="Zone Count" radius={[4, 4, 0, 0]}>
                                    {riskData.map((entry, index) => (
                                        <cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Outages Table */}
            <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <HistoryIcon sx={{ color: '#3B82F6' }} />
                    <Typography variant="h6" fontWeight={700} color="#374151">
                        Recent Outage Events
                    </Typography>
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f9fafb' }}>
                                <TableCell><strong>Zone ID</strong></TableCell>
                                <TableCell><strong>District</strong></TableCell>
                                <TableCell><strong>Risk Level</strong></TableCell>
                                <TableCell><strong>Duration</strong></TableCell>
                                <TableCell><strong>Population</strong></TableCell>
                                <TableCell><strong>Critical Facilities</strong></TableCell>
                                <TableCell><strong>Impact</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentOutages.map((zone, index) => (
                                <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>{zone.zone_id}</TableCell>
                                    <TableCell>{zone.district}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={zone.risk_level}
                                            size="small"
                                            sx={{
                                                bgcolor: zone.risk_level === 'Critical' ? '#fee2e2' :
                                                    zone.risk_level === 'High' ? '#fef3c7' :
                                                        zone.risk_level === 'Medium' ? '#fef9c3' : '#dcfce7',
                                                color: zone.risk_level === 'Critical' ? '#991b1b' :
                                                    zone.risk_level === 'High' ? '#92400e' :
                                                        zone.risk_level === 'Medium' ? '#854d0e' : '#166534',
                                                fontWeight: 'bold',
                                                height: 24
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{zone.outage_duration_hours}h</TableCell>
                                    <TableCell>{zone.population_density.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <HospitalIcon sx={{ fontSize: 14, color: '#ef4444' }} /> {zone.hospital_count}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <FactoryIcon sx={{ fontSize: 14, color: '#6b7280' }} /> {zone.industry_count}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            sx={{ color: zone.impact_score > 70 ? '#ef4444' : zone.impact_score > 50 ? '#f59e0b' : '#3B82F6' }}
                                        >
                                            {zone.impact_score.toFixed(1)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Action Items */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                        <Typography variant="h6" fontWeight={700} color="#374151" gutterBottom>
                            Recommended Actions
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                <strong>Immediate:</strong> Deploy crews to {stats.critical_zones} critical zones
                            </Alert>
                            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                <strong>High Priority:</strong> Coordinate with {stats.high_risk_zones} high-risk areas
                            </Alert>
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                                <strong>Monitor:</strong> Track restoration progress in real-time
                            </Alert>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <PhoneIcon color="primary" />
                            <Typography variant="h6" fontWeight={700} color="#374151">
                                Communication Log
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            {[
                                { time: 'Now', msg: 'Alert sent to all affected zones', type: 'success' },
                                { time: '5m ago', msg: 'Emergency crews dispatched', type: 'info' },
                                { time: '15m ago', msg: 'Hospital backup power verified', type: 'success' },
                                { time: '30m ago', msg: 'Industrial shutdown initiated', type: 'warning' }
                            ].map((log, index) => (
                                <Box key={index} sx={{ p: 1.5, mb: 1, bgcolor: '#f9fafb', borderRadius: 2, borderLeft: '4px solid #6C5DD3' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" fontWeight={600} color="#1f2937">{log.msg}</Typography>
                                        <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResponseManagement;
