import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { api } from '../services/api';
import {
    Map as MapIcon,
    Equalizer as ChartIcon,
    PieChart as PieIcon,
    Bolt as BoltIcon
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

const LiveGridMonitor = () => {
    const [gridStats, setGridStats] = useState(null);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, zonesRes] = await Promise.all([
                api.getGridStats(),
                api.getAllZones(500)
            ]);
            setGridStats(statsRes.data);
            setZones(zonesRes.data.zones);
            setLoading(false);
        } catch (error) {
            console.error('Error loading grid data:', error);
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

    const pieData = gridStats ? [
        { name: 'High Risk', value: gridStats.high_risk, color: '#ef4444' },
        { name: 'Medium Risk', value: gridStats.medium_risk, color: '#fbbf24' },
        { name: 'Low Risk', value: gridStats.safe, color: '#10b981' }
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
                    <BoltIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>
                        Live Grid Monitor
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Real-time power grid status and risk map
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Map Section */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 0, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4, height: 600, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapIcon sx={{ color: '#6C5DD3' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>
                                Geographic Distribution
                            </Typography>
                        </Box>
                        <Box sx={{ height: 530, width: '100%' }}>
                            <MapContainer
                                center={[13.0827, 80.2707]}
                                zoom={11}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                {zones.slice(0, 150).map((zone, idx) => (
                                    <CircleMarker
                                        key={idx}
                                        center={[zone.latitude, zone.longitude]}
                                        radius={6}
                                        fillColor={getRiskColor(zone.risk_level)}
                                        color="#fff"
                                        weight={2}
                                        fillOpacity={0.9}
                                    >
                                        <Popup>
                                            <div style={{ fontFamily: 'Inter, sans-serif' }}>
                                                <strong style={{ color: '#1f2937', fontSize: '1.1em' }}>{zone.zone_id}</strong><br />
                                                <span style={{ color: '#6b7280' }}>District:</span> {zone.district}<br />
                                                <div style={{ marginTop: '5px' }}>
                                                    <span style={{
                                                        backgroundColor: getRiskColor(zone.risk_level),
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8em',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {zone.risk_level}
                                                    </span>
                                                </div>
                                                <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#4b5563' }}>
                                                    Impact Score: <strong>{zone.impact_score?.toFixed(1)}</strong>
                                                </div>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Stats Section */}
                <Grid item xs={12} md={5}>
                    <Grid container spacing={3}>
                        {/* Real-time Grid Status */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <ChartIcon sx={{ color: '#3B82F6' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>
                                        Grid Status Overview
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Card elevation={0} sx={{ bgcolor: '#fee2e2', border: '1px solid #ef4444', height: '100%' }}>
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="overline" sx={{ color: '#991b1b', fontWeight: 700 }}>High Risk</Typography>
                                                <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 800 }}>
                                                    {gridStats?.high_risk || 0}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card elevation={0} sx={{ bgcolor: '#fef3c7', border: '1px solid #f59e0b', height: '100%' }}>
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="overline" sx={{ color: '#92400e', fontWeight: 700 }}>Medium</Typography>
                                                <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 800 }}>
                                                    {gridStats?.medium_risk || 0}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card elevation={0} sx={{ bgcolor: '#d1fae5', border: '1px solid #10b981', height: '100%' }}>
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="overline" sx={{ color: '#065f46', fontWeight: 700 }}>Safe</Typography>
                                                <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 800 }}>
                                                    {gridStats?.safe || 0}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card elevation={0} sx={{ bgcolor: '#e0e7ff', border: '1px solid #6366f1', height: '100%' }}>
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="overline" sx={{ color: '#3730a3', fontWeight: 700 }}>Total Zones</Typography>
                                                <Typography variant="h3" sx={{ color: '#6366f1', fontWeight: 800 }}>
                                                    {gridStats?.total_zones || 0}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Risk Distribution */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', border: '1px solid #e5e7eb', borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PieIcon sx={{ color: '#FF9F43' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151' }}>
                                        Risk Level Distribution
                                    </Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#374151' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LiveGridMonitor;
