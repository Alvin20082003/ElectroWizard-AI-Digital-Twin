import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Button, TextField, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Snackbar } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Bolt as PowerIcon, Warning as WarningIcon, CheckCircle as CheckIcon, Science as ScienceIcon, LocalHospital as HospitalIcon, Factory as FactoryIcon, Email as EmailIcon, Send as SendIcon, PhoneInTalk as PhoneIcon } from '@mui/icons-material';
import { api } from '../services/api';

const EnergyThresholdMonitor = () => {
    const [historyData, setHistoryData] = useState([]);
    const [thresholds, setThresholds] = useState({});
    const [loading, setLoading] = useState(true);

    // Emergency Sim State
    const [simZoneA, setSimZoneA] = useState(60000);
    const [simZoneB, setSimZoneB] = useState(60000);
    const [simAvailable, setSimAvailable] = useState(100000);
    const [simResult, setSimResult] = useState(null);

    // Email Alert State
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailType, setEmailType] = useState('energy'); // 'energy' or 'patient'
    const [sending, setSending] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [autoAlertOpen, setAutoAlertOpen] = useState(false);
    const [callModalOpen, setCallModalOpen] = useState(false);
    const hasAutoSent = useRef(false);

    const RECIPIENTS = [
        'xjennatherese@gmail.com',
        'alvinofficial646@gmail.com',
        'nharishraghavan@gmail.com',
        'dilloncruz005@gmail.com'
    ];

    useEffect(() => {
        loadData();
    }, []);

    // Automatic Alert Trigger
    useEffect(() => {
        if (!loading && historyData.length > 0 && !hasAutoSent.current) {
            const breaches = historyData.filter(d => d.threshold_breach);
            if (breaches.length > 0) {
                // Trigger auto alert for the latest breach
                hasAutoSent.current = true;
                setTimeout(() => {
                    // Automatically send the email
                    sendAlertEmail(true, 'energy');
                }, 1500);
            }
        }
    }, [historyData, loading]);

    // Escalation Watchdog: If Alert sent and no action in 10s, trigger Call
    useEffect(() => {
        if (autoAlertOpen) {
            const timer = setTimeout(() => {
                setCallModalOpen(true);
            }, 10000); // 10 seconds demo delay (simulating 30 mins)
            return () => clearTimeout(timer);
        }
    }, [autoAlertOpen]);

    const loadData = async () => {
        try {
            const res = await api.getEnergyHistory();
            setHistoryData(res.data.history);
            setThresholds(res.data.thresholds);
            setLoading(false);
        } catch (error) {
            console.error("Error loading energy data", error);
            setLoading(false);
        }
    };

    const runSimulation = async () => {
        try {
            const res = await api.calculateEmergencySplit(simZoneA, simZoneB, simAvailable);
            setSimResult(res.data);
        } catch (error) {
            console.error("Error running simulation", error);
        }
    };

    const handleOpenEmail = (type) => {
        setEmailType(type);
        setEmailOpen(true);
        setEmailSuccess(false);
    };

    const generateEmailContent = () => {
        return `🚨 CRITICAL GRID ALERT: Hub Threshold Breach (ID: CHE-04)

🏭 HUB INFORMATION
Hub Name: Chennai Sector 4 Priority Hub
ID: HUB-CHE-004
Alert Time: ${new Date().toLocaleString()}
Supervisor: Alvin Sudhan (ID: ADMIN-01)

📍 LIVE SENSOR STATUS
Location: T. Nagar, Chennai (GPS: 13.0418° N, 80.2341° E)
Zone Status: ⚠️ CRITICAL BREACH
Grid Stability: 78% (Dropping)
Network Load: 98% Capacity

📊 ENERGY VITAL SIGNS
Metric        | Current   | Threshold | Status
--------------|-----------|-----------|--------
Daily Usage   | 350 Units | 200 Units | ❌ LOW
Voltage       | 210V      | 230V      | ⚠️ UNSTABLE
Frequency     | 48.5Hz    | 50.0Hz    | ⚠️ LOW
Temp (Trans)  | 85°C      | 75°C      | ❌ OVERHEAT

🧠 AI CAUSAL ANALYSIS
Primary Cause: Medical Emergency Surge
Confidence: 94%
Detail: 3 Ventilators + MRI Scanner active simultaneously in Hospital Block A.
Prediction: Transformer failure in 45 mins if load not reduced.

📈 24-HOUR LOAD TREND
Morning (6AM-12PM): 120 Units (Normal)
Afternoon (12PM-6PM): 180 Units (High)
Evening (6PM-Now): 350 Units (CRITICAL)

🛡️ RECOMMENDED ACTIONS (AI GUIDED)
1. [EXECUTING] Auto-Reroute 150 Units from Industrial Zone B.
2. [PENDING] Activate Diesel Backup Generators at Hospital.
3. [URGENT] Dispatch Technical Team to Substation 4.

⚠️ IMMEDIATE ACTION REQUIRED! ⚠️
⚡ ElectroWizard AI Grid Monitor v2.0 | Auto-Alert system
Generated: ${new Date().toLocaleString()}`;
    };


    const sendAlertEmail = async (isAuto = false, typeOverride = null) => {
        const type = typeOverride || emailType;
        if (!isAuto) setSending(true);

        try {
            const subject = "🚨 CRITICAL ENERGY ALERT: Hospital Threshold Breached";

            const content = generateEmailContent();

            await api.sendEmail('High', subject, content, RECIPIENTS);

            if (isAuto) {
                setAutoAlertOpen(true);
            } else {
                setSending(false);
                setEmailSuccess(true);
            }
        } catch (error) {
            console.error("Error sending email", error);
            if (!isAuto) setSending(false);
        }
    };

    return (
        <Box sx={{ p: 4, height: '100%', overflow: 'auto', bgcolor: '#f3f4f6' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 1 }}>
                        Chennai Energy Hub Monitor
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Tracking Daily Consumption vs 100,000 Unit Threshold
                    </Typography>
                </Box>
                <Chip icon={<PowerIcon />} label="Hub Active" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>

            {/* Top Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
                        <Typography variant="subtitle2" color="text.secondary">Daily Supply Limit</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#3B82F6' }}>100,000</Typography>
                        <Typography variant="caption" color="text.secondary">Units (kWh)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
                        <Typography variant="subtitle2" color="text.secondary">Hospital Threshold</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF6B6B' }}>{thresholds.hospital || 200}</Typography>
                        <Typography variant="caption" color="text.secondary">Units / Day (Critical)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
                        <Typography variant="subtitle2" color="text.secondary">Industry Threshold</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF9F43' }}>{thresholds.industry || 500}</Typography>
                        <Typography variant="caption" color="text.secondary">Units / Day</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
                        <Typography variant="subtitle2" color="text.secondary">Anomalies Detected</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444' }}>
                            {historyData.filter(d => d.threshold_breach).length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Last 30 Days</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Main Consumption Chart */}
                <Grid item xs={12} lg={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', height: 400 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>30-Day Critical Consumption Tracker</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <ReferenceLine y={200} label="Hosp Limit" stroke="#FF6B6B" strokeDasharray="3 3" />
                                <ReferenceLine y={500} label="Ind Limit" stroke="#FF9F43" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="hospital_usage" name="Hospitals" stroke="#FF6B6B" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="industry_usage" name="Industry" stroke="#FF9F43" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="total_usage" name="Total Zone Load" stroke="#3B82F6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Simulation Control */}
                <Grid item xs={12} lg={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <ScienceIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Emergency Distributor</Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>Total Available Supply Today</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={simAvailable}
                                onChange={(e) => setSimAvailable(Number(e.target.value))}
                                InputProps={{ endAdornment: <Typography variant="caption">Units</Typography> }}
                            />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                                <Typography variant="caption">Zone A Demand (Hosp)</Typography>
                                <TextField
                                    fullWidth size="small" type="number"
                                    value={simZoneA} onChange={(e) => setSimZoneA(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption">Zone B Demand (Ind)</Typography>
                                <TextField
                                    fullWidth size="small" type="number"
                                    value={simZoneB} onChange={(e) => setSimZoneB(Number(e.target.value))}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={runSimulation}
                            sx={{ bgcolor: '#6C5DD3', mb: 3, '&:hover': { bgcolor: '#5b4bc4' } }}
                        >
                            Calculate Optimal Split
                        </Button>

                        {simResult && (
                            <Box sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: simResult.scenario.includes('Emergency') ? '#EF4444' : '#10B981', mb: 1 }}>
                                    {simResult.scenario.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>{simResult.reasoning}</Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: 'white', border: '1px solid #e5e7eb' }}>
                                            <Typography variant="caption">Zone A</Typography>
                                            <Typography variant="h6" color="primary">{simResult.zone_a_allocation}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: 'white', border: '1px solid #e5e7eb' }}>
                                            <Typography variant="caption">Zone B</Typography>
                                            <Typography variant="h6" color="secondary">{simResult.zone_b_allocation}</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Emergency Communications */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff5f5' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <WarningIcon color="error" fontSize="large" />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#991b1b' }}>Emergency Alert System</Typography>
                                    <Typography variant="body2" sx={{ color: '#b91c1c' }}>
                                        Broadcast critical alerts to stakeholders ({RECIPIENTS.length} active recipients)
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<EmailIcon />}
                                    onClick={() => handleOpenEmail('energy')}
                                    sx={{ fontWeight: 700 }}
                                >
                                    Broadcast Alert
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Anomalies Table */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Breach Analysis Log</Typography>
                        </Box>
                        <TableContainer sx={{ maxHeight: 300 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Day</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Usage</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Threshold</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>AI Reason Analysis</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {historyData.filter(d => d.threshold_breach).map((row, idx) => (
                                        <TableRow key={idx} hover>
                                            <TableCell>Day {row.day}</TableCell>
                                            <TableCell>
                                                {row.hospital_usage > thresholds.hospital ?
                                                    <Chip icon={<HospitalIcon />} label="Hospital" size="small" color="error" variant="outlined" /> :
                                                    <Chip icon={<FactoryIcon />} label="Industry" size="small" color="warning" variant="outlined" />
                                                }
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>
                                                {row.hospital_usage > thresholds.hospital ? row.hospital_usage : row.industry_usage}
                                            </TableCell>
                                            <TableCell sx={{ color: '#6b7280' }}>
                                                {row.hospital_usage > thresholds.hospital ? thresholds.hospital : thresholds.industry}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label="BREACH" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700 }} />
                                            </TableCell>
                                            <TableCell>{row.breach_reason}</TableCell>
                                        </TableRow>
                                    ))}
                                    {historyData.filter(d => d.threshold_breach).length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No threshold anomalies detected.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Email Preview Dialog */}
            <Dialog open={emailOpen} onClose={() => setEmailOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #e5e7eb' }}>
                    <EmailIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Broadcast Critical Hub Alert
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        This will send a high-priority email notification to the 4 registered stakeholders.
                    </Alert>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#6b7280' }}>To:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {RECIPIENTS.map(email => (
                                <Chip key={email} label={email} size="small" />
                            ))}
                        </Box>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f9fafb', fontFamily: 'monospace' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>
                            Subject: 🚨 CRITICAL ENERGY ALERT: Hospital Threshold Breached
                        </Typography>
                        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
                            {generateEmailContent()}
                        </Typography>
                    </Paper>

                    {emailSuccess && (
                        <Alert severity="success" sx={{ mt: 3 }}>
                            ✅ Alert broadcasted successfully to all recipients!
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
                    <Button onClick={() => setEmailOpen(false)} disabled={sending}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        onClick={() => sendAlertEmail(false)}
                        disabled={sending || emailSuccess}
                    >
                        {sending ? 'Sending...' : 'Confirm & Broadcast'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Auto Alert Snackbar */}
            <Snackbar
                open={autoAlertOpen}
                autoHideDuration={6000}
                onClose={() => setAutoAlertOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setAutoAlertOpen(false)} severity="warning" sx={{ width: '100%', border: '1px solid #f5c6cb', color: '#721c24', bgcolor: '#f8d7da', fontWeight: 700 }}>
                    🚨 AUTOMATIC ALERT SENT: Threshold Breach Detected! Email sent to stakeholders.
                </Alert>
            </Snackbar>

            {/* Emergency Call Simulation Dialog */}
            <Dialog open={callModalOpen} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#111827', color: 'white', borderRadius: 4, textAlign: 'center' } }}>
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 3, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.2)', animation: 'pulse 1.5s infinite' }}>
                        <PhoneIcon sx={{ fontSize: 60, color: '#EF4444' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>
                        ESCALATION PROTOCOL ACTIVE
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
                        Operator unresponsive for 30 minutes.
                        <br />
                        <strong>Auto-dialing Supervisor (Alvin Sudhan)...</strong>
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, my: 2, fontFamily: 'monospace' }}>
                        +91 98XXX XXXXX
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        fullWidth
                        onClick={() => setCallModalOpen(false)}
                        sx={{ borderRadius: 10, py: 1.5, fontSize: '1.2rem', fontWeight: 800 }}
                    >
                        CANCEL CALL
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default EnergyThresholdMonitor;
