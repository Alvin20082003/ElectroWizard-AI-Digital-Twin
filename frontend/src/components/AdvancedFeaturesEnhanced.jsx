import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Dialog, DialogTitle, DialogContent, Button, Chip, Stack } from '@mui/material';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    AttachMoney as MoneyIcon,
    VpnKey as KeyIcon,
    Bolt as BoltIcon,
    TrendingDown as TrendingDownIcon,
    LibraryBooks as LibraryIcon,
    Psychology as PsychologyIcon,
    Compress as CompressIcon,
    CompareArrows as CompareIcon,
    Hotel as SleepIcon,
    VisibilityOff as BlindSpotIcon,
    Timer as TimerIcon,
    TrendingUp as TrendingUpIcon,
    Balance as BalanceIcon,
    Shield as ShieldIcon,
    MenuBook as StoryIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Science as ScienceIcon,
    LocalHospital as HospitalIcon,
    SmartToy as BotIcon
} from '@mui/icons-material';

const AdvancedFeaturesEnhanced = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    // Light Theme Colors
    const COLORS = ['#6C5DD3', '#3B82F6', '#FF9F43', '#FF6B6B', '#2ecc71', '#00b894', '#0984e3'];

    // Reusable Chart Component - Trend
    const TrendChart = ({ title, data, color, area = false }) => (
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#374151' }}>{title}</Typography>
            <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} hide />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${title})`} />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );

    // Reusable Chart Component - Distribution
    const DistributionChart = ({ title, data }) => (
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#374151' }}>{title}</Typography>
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={data} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                </PieChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {data.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                        <Typography variant="caption" color="text.secondary">{entry.name}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );

    // Reusable Chart Component - Bar Comparison
    const BarComparisonChart = ({ title, data, color }) => (
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#374151' }}>{title}</Typography>
            <ResponsiveContainer width="100%" height={150}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 8 }} cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );

    // Feature Data Definition
    const features = [
        {
            id: 1,
            icon: <MoneyIcon fontSize="large" sx={{ color: '#FF9F43' }} />,
            title: 'Impact Budget System',
            status: 'active',
            color: '#FF9F43',
            stats: ['₹2.5M Limit', '67% Used', '₹800k Safe'],
            charts: [
                { type: 'trend', title: 'Monthly Expenditure', data: [{ name: 'J', value: 10 }, { name: 'F', value: 15 }, { name: 'M', value: 12 }, { name: 'A', value: 20 }, { name: 'M', value: 18 }], color: '#FF9F43' },
                { type: 'dist', title: 'Cost Allocation', data: [{ name: 'Repair', value: 40 }, { name: 'Comp.', value: 30 }, { name: 'Ops', value: 30 }] },
                { type: 'bar', title: 'Budget vs Actual', data: [{ name: 'Q1', value: 80 }, { name: 'Q2', value: 95 }, { name: 'Q3', value: 60 }], color: '#FF9F43' }
            ]
        },
        {
            id: 2,
            icon: <KeyIcon fontSize="large" sx={{ color: '#6C5DD3' }} />,
            title: 'Power Dependency Fingerprint',
            status: 'active',
            color: '#6C5DD3',
            stats: ['Unique ID: #A12', '5 Sources', 'Stable Pattern'],
            charts: [
                { type: 'dist', title: 'Source Mix', data: [{ name: 'Grid', value: 60 }, { name: 'Solar', value: 20 }, { name: 'Diesel', value: 20 }] },
                { type: 'trend', title: 'Stability Score', data: [{ name: '1', value: 90 }, { name: '2', value: 88 }, { name: '3', value: 92 }, { name: '4', value: 95 }], color: '#6C5DD3' },
                { type: 'bar', title: 'Dependency Load', data: [{ name: 'Main', value: 400 }, { name: 'Aux', value: 150 }, { name: 'Emg', value: 50 }], color: '#6C5DD3' }
            ]
        },
        {
            id: 3,
            icon: <BoltIcon fontSize="large" sx={{ color: '#FF6B6B' }} />,
            title: 'Emergency Priority Rewriter',
            status: 'warning',
            color: '#FF6B6B',
            stats: ['Active Rewrite', 'Zone T_Nagar', 'Priority +2'],
            charts: [
                { type: 'trend', title: 'Priority Level', data: [{ name: '12:00', value: 1 }, { name: '12:15', value: 1 }, { name: '12:30', value: 3 }, { name: '12:45', value: 3 }], color: '#FF6B6B' },
                { type: 'bar', title: 'Zones Rewritten', data: [{ name: 'North', value: 2 }, { name: 'South', value: 5 }, { name: 'East', value: 1 }], color: '#FF6B6B' },
                { type: 'dist', title: 'Trigger Causes', data: [{ name: 'Storm', value: 70 }, { name: 'Load', value: 30 }] }
            ]
        },
        {
            id: 4,
            icon: <TrendingDownIcon fontSize="large" sx={{ color: '#2ecc71' }} />,
            title: 'Outage Confidence Degrader',
            status: 'active',
            color: '#2ecc71',
            stats: ['Confidence: 87%', 'Decay: 0.5%/hr', 'Stable'],
            charts: [
                { type: 'trend', title: 'Confidence Curve', data: [{ name: 'T0', value: 98 }, { name: 'T1', value: 95 }, { name: 'T2', value: 87 }, { name: 'T3', value: 70 }], color: '#2ecc71' },
                { type: 'bar', title: 'Model Accuracy', data: [{ name: 'M1', value: 92 }, { name: 'M2', value: 88 }, { name: 'M3', value: 85 }], color: '#2ecc71' },
                { type: 'dist', title: 'Data Freshness', data: [{ name: 'Fresh', value: 80 }, { name: 'Stale', value: 20 }] }
            ]
        },
        {
            id: 5,
            icon: <LibraryIcon fontSize="large" sx={{ color: '#3B82F6' }} />,
            title: 'Restoration Bottleneck Library',
            status: 'active',
            color: '#3B82F6',
            stats: ['127 Patterns', '94% Match', 'Auto-Learning'],
            charts: [
                { type: 'bar', title: 'Common Bottlenecks', data: [{ name: 'Cable', value: 45 }, { name: 'Crew', value: 30 }, { name: 'Access', value: 25 }], color: '#3B82F6' },
                { type: 'trend', title: 'Resolution Time', data: [{ name: 'W1', value: 120 }, { name: 'W2', value: 90 }, { name: 'W3', value: 45 }], color: '#3B82F6' },
                { type: 'dist', title: 'Category Split', data: [{ name: 'Hardware', value: 50 }, { name: 'Logistics', value: 30 }, { name: 'Env', value: 20 }] }
            ]
        },
        {
            id: 6,
            icon: <PsychologyIcon fontSize="large" sx={{ color: '#9b59b6' }} />,
            title: 'Zone Personality Profiler',
            status: 'active',
            color: '#9b59b6',
            stats: ['Profiled: 15 Zones', 'Type: Industrial', 'Fragile'],
            charts: [
                { type: 'bar', title: 'Resilience Score', data: [{ name: 'Z1', value: 40 }, { name: 'Z2', value: 80 }, { name: 'Z3', value: 60 }], color: '#9b59b6' },
                { type: 'dist', title: 'Zone Types', data: [{ name: 'Resi', value: 40 }, { name: 'Comm', value: 30 }, { name: 'Ind', value: 30 }] },
                { type: 'trend', title: 'Recovery Speed', data: [{ name: 'Jan', value: 5 }, { name: 'Feb', value: 6 }, { name: 'Mar', value: 8 }], color: '#9b59b6' }
            ]
        },
        {
            id: 7,
            icon: <CompressIcon fontSize="large" sx={{ color: '#00b894' }} />,
            title: 'Impact Memory Compression',
            status: 'active',
            color: '#00b894',
            stats: ['73% Saved', 'Lossless', 'Ultra-Fast'],
            charts: [
                { type: 'trend', title: 'Storage Usage', data: [{ name: 'D1', value: 100 }, { name: 'D2', value: 80 }, { name: 'D3', value: 27 }], color: '#00b894' },
                { type: 'bar', title: 'Compression Ratio', data: [{ name: 'Log', value: 4 }, { name: 'Sat', value: 2 }, { name: 'Txt', value: 10 }], color: '#00b894' },
                { type: 'dist', title: 'Data Types', data: [{ name: 'Raw', value: 20 }, { name: 'Proc.', value: 80 }] }
            ]
        },
        {
            id: 8,
            icon: <CompareIcon fontSize="large" sx={{ color: '#e17055' }} />,
            title: 'Dependency Conflict Detector',
            status: 'warning',
            color: '#e17055',
            stats: ['3 Conflicts', 'Circular', 'Resolved'],
            charts: [
                { type: 'bar', title: 'Conflict Count', data: [{ name: 'Grid', value: 5 }, { name: 'Backup', value: 2 }, { name: 'Crew', value: 8 }], color: '#e17055' },
                { type: 'trend', title: 'Resolution Rate', data: [{ name: 'H1', value: 2 }, { name: 'H2', value: 5 }, { name: 'H3', value: 8 }], color: '#e17055' },
                { type: 'dist', title: 'Conflict Types', data: [{ name: 'Hard', value: 20 }, { name: 'Soft', value: 80 }] }
            ]
        },
        {
            id: 9,
            icon: <SleepIcon fontSize="large" sx={{ color: '#fdcb6e' }} />,
            title: 'Recovery Fatigue Analyzer',
            status: 'warning',
            color: '#fdcb6e',
            stats: ['Fatigue: 68%', 'Rest Needed', 'Team A'],
            charts: [
                { type: 'trend', title: 'Team Alertness', data: [{ name: '0h', value: 100 }, { name: '4h', value: 80 }, { name: '8h', value: 60 }, { name: '12h', value: 40 }], color: '#fdcb6e' },
                { type: 'bar', title: 'Shift Hours', data: [{ name: 'T1', value: 12 }, { name: 'T2', value: 8 }, { name: 'T3', value: 14 }], color: '#fdcb6e' },
                { type: 'dist', title: 'Break Compliance', data: [{ name: 'Yes', value: 60 }, { name: 'No', value: 40 }] }
            ]
        },
        {
            id: 10,
            icon: <BlindSpotIcon fontSize="large" sx={{ color: '#d63031' }} />,
            title: 'Outage Blind-Spot Finder',
            status: 'critical',
            color: '#d63031',
            stats: ['12 Spots', 'High Risk', 'Monitoring'],
            charts: [
                { type: 'bar', title: 'Unmonitored Areas', data: [{ name: 'Rural', value: 8 }, { name: 'Urban', value: 4 }], color: '#d63031' },
                { type: 'trend', title: 'Detection Rate', data: [{ name: 'D1', value: 2 }, { name: 'D2', value: 5 }, { name: 'D3', value: 12 }], color: '#d63031' },
                { type: 'dist', title: 'Risk Level', data: [{ name: 'High', value: 70 }, { name: 'Med', value: 30 }] }
            ]
        },
        {
            id: 11,
            icon: <TimerIcon fontSize="large" sx={{ color: '#0984e3' }} />,
            title: 'Temporary Stability Estimator',
            status: 'active',
            color: '#0984e3',
            stats: ['6.2h Est', 'Declining', 'Patch Valid'],
            charts: [
                { type: 'trend', title: 'Stability Decay', data: [{ name: '0h', value: 100 }, { name: '2h', value: 90 }, { name: '4h', value: 70 }, { name: '6h', value: 40 }], color: '#0984e3' },
                { type: 'bar', title: 'Patch Durability', data: [{ name: 'P1', value: 12 }, { name: 'P2', value: 6 }, { name: 'P3', value: 24 }], color: '#0984e3' },
                { type: 'dist', title: 'Patch Types', data: [{ name: 'Mech', value: 50 }, { name: 'Elec', value: 50 }] }
            ]
        },
        {
            id: 12,
            icon: <TrendingUpIcon fontSize="large" sx={{ color: '#6c5ce7' }} />,
            title: 'Impact Prediction Drift Watcher',
            status: 'active',
            color: '#6c5ce7',
            stats: ['Drift: 0.12%', 'Retrain: 3d', 'Monitoring'],
            charts: [
                { type: 'trend', title: 'Model Drift', data: [{ name: 'W1', value: 0 }, { name: 'W2', value: 0.05 }, { name: 'W3', value: 0.12 }], color: '#6c5ce7' },
                { type: 'bar', title: 'Error Rate', data: [{ name: 'M1', value: 2 }, { name: 'M2', value: 3 }, { name: 'M3', value: 4 }], color: '#6c5ce7' },
                { type: 'dist', title: 'Feature Drift', data: [{ name: 'Weath', value: 60 }, { name: 'Load', value: 40 }] }
            ]
        },
        {
            id: 13,
            icon: <BalanceIcon fontSize="large" sx={{ color: '#00cec9' }} />,
            title: 'Dependency Load Balancer',
            status: 'active',
            color: '#00cec9',
            stats: ['Balanced', 'Optimal', 'Auto-Scale'],
            charts: [
                { type: 'dist', title: 'Load Share', data: [{ name: 'A', value: 33 }, { name: 'B', value: 33 }, { name: 'C', value: 34 }] },
                { type: 'trend', title: 'Grid Stress', data: [{ name: 'T1', value: 80 }, { name: 'T2', value: 60 }, { name: 'T3', value: 40 }], color: '#00cec9' },
                { type: 'bar', title: 'Capacity Headroom', data: [{ name: 'Z1', value: 20 }, { name: 'Z2', value: 40 }, { name: 'Z3', value: 15 }], color: '#00cec9' }
            ]
        },
        {
            id: 14,
            icon: <ShieldIcon fontSize="large" sx={{ color: '#fab1a0' }} />,
            title: 'Restoration Risk Insurance',
            status: 'active',
            color: '#fab1a0',
            stats: ['Risk: 8%', 'Safe Route', 'Insured'],
            charts: [
                { type: 'bar', title: 'Risk Score', data: [{ name: 'Plan A', value: 60 }, { name: 'Plan B', value: 20 }, { name: 'Plan C', value: 90 }], color: '#fab1a0' },
                { type: 'dist', title: 'Failure Modes', data: [{ name: 'Tech', value: 20 }, { name: 'Ext', value: 80 }] },
                { type: 'trend', title: 'Safety Margin', data: [{ name: 'S1', value: 10 }, { name: 'S2', value: 20 }, { name: 'S3', value: 30 }], color: '#fab1a0' }
            ]
        },
        {
            id: 15,
            icon: <StoryIcon fontSize="large" sx={{ color: '#a29bfe' }} />,
            title: 'Outage Scenario Story Generator',
            status: 'active',
            color: '#a29bfe',
            stats: ['Generated', 'Narrative', 'Detailed'],
            charts: [
                { type: 'trend', title: 'Event Sequence', data: [{ name: 'Start', value: 0 }, { name: 'Casc', value: 50 }, { name: 'Peak', value: 100 }, { name: 'End', value: 0 }], color: '#a29bfe' },
                { type: 'dist', title: 'Entities Involved', data: [{ name: 'Zone', value: 50 }, { name: 'Hosp', value: 30 }, { name: 'Ind', value: 20 }] },
                { type: 'bar', title: 'Scenario Severity', data: [{ name: 'S1', value: 8 }, { name: 'S2', value: 4 }, { name: 'S3', value: 9 }], color: '#a29bfe' }
            ]
        },
        {
            id: 16,
            icon: <ScienceIcon fontSize="large" sx={{ color: '#6C5DD3' }} />,
            title: 'Digital Twin Simulator',
            status: 'critical',
            color: '#6C5DD3',
            stats: ['98% Accuracy', 'Live Twin', 'Predictive'],
            charts: [
                { type: 'trend', title: 'Simulation Accuracy', data: [{ name: 'V1', value: 85 }, { name: 'V2', value: 92 }, { name: 'V3', value: 98 }], color: '#6C5DD3' },
                { type: 'bar', title: 'Cascading Depth', data: [{ name: 'L1', value: 5 }, { name: 'L2', value: 12 }, { name: 'L3', value: 8 }], color: '#6C5DD3' },
                { type: 'dist', title: 'Scenario Types', data: [{ name: 'Weather', value: 40 }, { name: 'Load', value: 40 }, { name: 'Attack', value: 20 }] }
            ]
        },
        {
            id: 17,
            icon: <HospitalIcon fontSize="large" sx={{ color: '#FF6B6B' }} />,
            title: 'Hospital Life-Support',
            status: 'critical',
            color: '#FF6B6B',
            stats: ['0 Failures', '16 Hospitals', 'Live Mon'],
            charts: [
                { type: 'trend', title: 'Backup Reliability', data: [{ name: 'Q1', value: 99.9 }, { name: 'Q2', value: 99.8 }, { name: 'Q3', value: 100 }], color: '#FF6B6B' },
                { type: 'bar', title: 'Critical Incidents', data: [{ name: 'Gen', value: 2 }, { name: 'Fuel', value: 1 }, { name: 'Switch', value: 0 }], color: '#FF6B6B' },
                { type: 'dist', title: 'Hospital Types', data: [{ name: 'ICU', value: 30 }, { name: 'Gen', value: 50 }, { name: 'Emg', value: 20 }] }
            ]
        },
        {
            id: 18,
            icon: <BotIcon fontSize="large" sx={{ color: '#2ecc71' }} />,
            title: 'AI Restoration Planner',
            status: 'active',
            color: '#2ecc71',
            stats: ['Opt: 30s', 'Steps: 45', 'Valid'],
            charts: [
                { type: 'trend', title: 'Plan Efficiency', data: [{ name: 'Man', value: 40 }, { name: 'Semi', value: 70 }, { name: 'AI', value: 95 }], color: '#2ecc71' },
                { type: 'bar', title: 'Step Reduction', data: [{ name: 'Old', value: 60 }, { name: 'New', value: 45 }], color: '#2ecc71' },
                { type: 'dist', title: 'Resource Util', data: [{ name: 'Crew', value: 60 }, { name: 'Parts', value: 30 }, { name: 'Veh', value: 10 }] }
            ]
        }
    ];

    return (
        <Box sx={{ p: 4, bgcolor: '#f3f4f6', height: '100%', overflowY: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 1 }}>
                        Advanced AI Systems
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        18 Specialized Modules Monitoring Grid Health
                    </Typography>
                </Box>
                <Chip icon={<CheckIcon />} label="System Operational" color="success" variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }} />
            </Box>

            <Grid container spacing={3}>
                {features.map((feature) => (
                    <Grid item xs={12} sm={6} md={4} key={feature.id}>
                        <Paper
                            elevation={0}
                            onClick={() => setSelectedFeature(feature)}
                            sx={{
                                p: 3,
                                height: '100%',
                                bgcolor: 'white',
                                borderRadius: 4,
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    borderColor: feature.color
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${feature.color}15` }}>
                                    {feature.icon}
                                </Box>
                                <Chip
                                    label={feature.status.toUpperCase()}
                                    size="small"
                                    sx={{
                                        bgcolor: `${feature.color}15`,
                                        color: feature.color,
                                        fontWeight: 800,
                                        borderRadius: 2
                                    }}
                                />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                                {feature.title}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                {feature.stats.slice(0, 2).map((stat, idx) => (
                                    <Chip key={idx} label={stat} size="small" variant="outlined" sx={{ borderColor: '#e5e7eb', color: '#6b7280', fontSize: '0.7rem' }} />
                                ))}
                            </Stack>

                            <Box sx={{ mt: 'auto' }}>
                                <Typography variant="caption" sx={{ color: feature.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    VIEW ANALYTICS <CompareIcon fontSize="inherit" />
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Detailed Analytics Dialog */}
            <Dialog
                open={Boolean(selectedFeature)}
                onClose={() => setSelectedFeature(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 4 }
                }}
            >
                {selectedFeature && (
                    <>
                        <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${selectedFeature.color}15` }}>
                                    {selectedFeature.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>{selectedFeature.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Real-time Visualization Module</Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }} />
                                <Button onClick={() => setSelectedFeature(null)} color="inherit">Close</Button>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ p: 4, bgcolor: '#f9fafb' }}>
                            <Grid container spacing={3}>
                                {/* KPI Cards */}
                                {selectedFeature.stats.map((stat, idx) => (
                                    <Grid item xs={12} md={4} key={idx}>
                                        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 2, bgcolor: 'white', textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ color: selectedFeature.color, fontWeight: 800 }}>{stat.split(' ')[0]}</Typography>
                                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>{stat.split(' ').slice(1).join(' ')}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}

                                {/* Dynamic Charts based on data */}
                                {selectedFeature.charts.map((chart, idx) => (
                                    <Grid item xs={12} md={4} key={idx}>
                                        {chart.type === 'trend' && <TrendChart title={chart.title} data={chart.data} color={chart.color} />}
                                        {chart.type === 'dist' && <DistributionChart title={chart.title} data={chart.data} />}
                                        {chart.type === 'bar' && <BarComparisonChart title={chart.title} data={chart.data} color={chart.color} />}
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AdvancedFeaturesEnhanced;
