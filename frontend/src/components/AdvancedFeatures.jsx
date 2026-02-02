import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const AdvancedFeatures = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    // Visualization Components
    const BudgetVisual = () => (
        <Box sx={{ bgcolor: '#5874a1ff', p: 3, borderRadius: 2, border: '2px solid #f59e0b' }}>
            <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2, textAlign: 'center' }}>💰 Budget Status</Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 'bold' }}>₹16.8L</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Used</Typography>
                </Box>
                <Box sx={{ fontSize: '3rem', color: '#64748b' }}>/</Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>₹25L</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total</Typography>
                </Box>
            </Box>
            <LinearProgress variant="determinate" value={67} sx={{ height: 15, borderRadius: 8, mt: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>67%</Typography>
                <Chip label="🟢 SAFE" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 'bold' }} />
            </Box>
        </Box>
    );

    const DependencyFingerprintVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #667eea' }}>
            <Typography variant="h6" sx={{ color: '#667eea', mb: 2 }}>🔑 Power Source Distribution</Typography>
            {[
                { name: 'Substation A', value: 45, color: '#667eea' },
                { name: 'Substation C', value: 35, color: '#8b5cf6' },
                { name: 'Backup Gen', value: 20, color: '#f59e0b' }
            ].map((item, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: item.color, fontWeight: 'bold' }}>{item.value}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={item.value} sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: item.color } }} />
                </Box>
            ))}
        </Box>
    );

    const PriorityRewriterVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #f59e0b' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ fontSize: '2rem' }}>⚠️</Box>
                <Typography variant="h6" sx={{ color: '#f59e0b' }}>Priority Changed</Typography>
            </Box>
            <Box sx={{ bgcolor: '#0f172a', p: 2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Zone: <span style={{ color: '#fff', fontWeight: 'bold' }}>T Nagar</span></Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                    <Chip label="Priority: 3" sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }} />
                    <Typography variant="h4" sx={{ color: '#f59e0b' }}>→</Typography>
                    <Chip label="Priority: 1" sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#fbbf24', mt: 2 }}>🏥 Reason: Hospital Load Surge</Typography>
            </Box>
        </Box>
    );

    const ConfidenceGauge = () => {
        const confidence = 87;
        const getColor = (val) => val > 80 ? '#10b981' : val > 60 ? '#f59e0b' : '#ef4444';
        return (
            <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #10b981', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#10b981', mb: 2 }}>🎯 Model Confidence</Typography>
                <Box sx={{ position: 'relative', width: 200, height: 200, mx: 'auto', mb: 2 }}>
                    <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: `conic-gradient(${getColor(confidence)} ${confidence * 3.6}deg, rgba(255,255,255,0.1) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: '85%', height: '85%', borderRadius: '50%', bgcolor: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h3" sx={{ color: getColor(confidence), fontWeight: 'bold' }}>{confidence}%</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Confidence</Typography>
                        </Box>
                    </Box>
                </Box>
                <Chip label="🟢 HIGH TRUST" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 'bold' }} />
            </Box>
        );
    };

    const BottleneckLibraryVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #8b5cf6' }}>
            <Typography variant="h6" sx={{ color: '#8b5cf6', mb: 2 }}>📚 Known Issues Database</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.1)' }}>Issue</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.1)' }}>Times</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.1)' }}>Solution</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[
                        { issue: 'Cable Delay', times: 12, solution: 'Pre-stock', badge: '⚠️' },
                        { issue: 'Team Late', times: 8, solution: 'GPS Track', badge: '🚗' },
                        { issue: 'Tool Miss', times: 5, solution: 'Checklist', badge: '🔧' }
                    ].map((row, i) => (
                        <TableRow key={i}>
                            <TableCell sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.05)' }}>{row.badge} {row.issue}</TableCell>
                            <TableCell sx={{ color: '#f59e0b', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.05)' }}>{row.times}</TableCell>
                            <TableCell sx={{ color: '#10b981', borderColor: 'rgba(255,255,255,0.05)' }}>{row.solution}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );

    const ZonePersonalityVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #ef4444' }}>
            <Typography variant="h6" sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>🧬 Zone Profile</Typography>
            <Box sx={{ bgcolor: '#0f172a', p: 2, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Anna Nagar</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Type</Typography>
                            <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 'bold' }}>Fragile</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Recovery</Typography>
                            <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>Slow</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(239, 68, 68, 0.2)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Risk Level</Typography>
                            <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 HIGH</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );

    const MemoryCompressionVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #10b981' }}>
            <Typography variant="h6" sx={{ color: '#10b981', mb: 3, textAlign: 'center' }}>💾 Storage Optimization</Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#0f172a', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 'bold' }}>892</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Patterns</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#0f172a', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>79%</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Saved</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#0f172a', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>✓</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Optimized</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );

    const ConflictDetectorVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #ef4444' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4">⚔️</Typography>
                <Typography variant="h6" sx={{ color: '#ef4444' }}>Conflict Detected</Typography>
            </Box>
            <Box sx={{ bgcolor: '#0f172a', p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <Chip label="Zone A" sx={{ bgcolor: '#667eea', color: '#fff', fontWeight: 'bold' }} />
                    <Typography variant="h5" sx={{ color: '#ef4444' }}>⚡</Typography>
                    <Chip label="Zone B" sx={{ bgcolor: '#8b5cf6', color: '#fff', fontWeight: 'bold' }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#f59e0b', mb: 1 }}>⚠️ Same Substation</Typography>
                <Typography variant="caption" sx={{ color: '#10b981' }}>✓ Resolution: Load Balancing Active</Typography>
            </Box>
        </Box>
    );

    const FatigueAnalyzerVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #f59e0b' }}>
            <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2 }}>👷 Team Status</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.1)' }}>Team</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.1)' }}>Hours</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.1)' }}>Fatigue</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[
                        { team: 'A3', hours: '14h', fatigue: 'High', color: '#ef4444', icon: '🔴' },
                        { team: 'B1', hours: '8h', fatigue: 'Medium', color: '#f59e0b', icon: '🟡' },
                        { team: 'C2', hours: '4h', fatigue: 'Low', color: '#10b981', icon: '🟢' }
                    ].map((row, i) => (
                        <TableRow key={i}>
                            <TableCell sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.05)' }}>{row.team}</TableCell>
                            <TableCell sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.05)' }}>{row.hours}</TableCell>
                            <TableCell sx={{ color: row.color, fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.05)' }}>{row.icon} {row.fatigue}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );

    const BlindSpotVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #ef4444' }}>
            <Typography variant="h6" sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>📡 Coverage Map</Typography>
            <Box sx={{ bgcolor: '#0f172a', p: 3, borderRadius: 2, position: 'relative', height: 150 }}>
                <Box sx={{ position: 'absolute', top: 20, left: 20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.3)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 'bold' }}>T Nagar</Typography>
                </Box>
                <Box sx={{ position: 'absolute', top: 40, right: 30, width: 70, height: 70, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.3)', border: '2px dashed #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 'bold' }}>Perambur</Typography>
                </Box>
            </Box>
            <Chip label="🔴 Low Data Zone" size="small" sx={{ mt: 2, bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 'bold' }} />
        </Box>
    );

    const StabilityTimerVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #f59e0b', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#f59e0b', mb: 2 }}>⏳ Temporary Fix</Typography>
            <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>6h 30m</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>Time Remaining</Typography>
            <LinearProgress variant="determinate" value={45} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
            <Chip label="🟡 MEDIUM RISK" size="small" sx={{ mt: 2, bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontWeight: 'bold' }} />
        </Box>
    );

    const DriftWatcherVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #ef4444' }}>
            <Typography variant="h6" sx={{ color: '#ef4444', mb: 2, textAlign: 'center' }}>📉 Model Accuracy</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 'bold' }}>96%</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Before</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ef4444' }}>→</Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 'bold' }}>91%</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Current</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Typography variant="h5" sx={{ color: '#ef4444' }}>↓</Typography>
                <Chip label="Drift Detected" sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 'bold' }} />
            </Box>
        </Box>
    );

    const LoadBalancerVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #667eea' }}>
            <Typography variant="h6" sx={{ color: '#667eea', mb: 2, textAlign: 'center' }}>🔄 Power Flow</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', py: 2 }}>
                <Chip label="Zone C" sx={{ bgcolor: '#667eea', color: '#fff', fontWeight: 'bold', fontSize: '1rem', py: 2 }} />
                <Box sx={{ flex: 1, height: 4, bgcolor: '#667eea', mx: 1, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #667eea' }} />
                    <Typography variant="caption" sx={{ position: 'absolute', top: -25, left: '50%', transform: 'translateX(-50%)', color: '#f59e0b', fontWeight: 'bold', whiteSpace: 'nowrap' }}>18 MW</Typography>
                </Box>
                <Chip label="Zone B" sx={{ bgcolor: '#8b5cf6', color: '#fff', fontWeight: 'bold', fontSize: '1rem', py: 2 }} />
            </Box>
        </Box>
    );

    const RiskInsuranceVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #10b981' }}>
            <Typography variant="h6" sx={{ color: '#10b981', mb: 2, textAlign: 'center' }}>📋 Plan Comparison</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 2, border: '2px solid #ef4444', textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Plan A</Typography>
                        <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 'bold', mb: 1 }}>62%</Typography>
                        <Typography variant="caption" sx={{ color: '#ef4444' }}>Risk</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="h5" sx={{ color: '#ef4444' }}>❌</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 2, border: '2px solid #10b981', textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Plan B</Typography>
                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold', mb: 1 }}>18%</Typography>
                        <Typography variant="caption" sx={{ color: '#10b981' }}>Risk</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="h5" sx={{ color: '#10b981' }}>✅</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );

    const StoryTimelineVisual = () => (
        <Box sx={{ bgcolor: '#1e293b', p: 3, borderRadius: 2, border: '2px solid #8b5cf6' }}>
            <Typography variant="h6" sx={{ color: '#8b5cf6', mb: 2 }}>📝 Event Timeline</Typography>
            {[
                { time: '20:15', event: 'Transformer Failure', color: '#ef4444', icon: '⚡' },
                { time: '20:22', event: 'Zone Overload', color: '#f59e0b', icon: '⚠️' },
                { time: '20:45', event: 'Team Dispatched', color: '#667eea', icon: '🚗' },
                { time: '21:20', event: 'Power Restored', color: '#10b981', icon: '✓' }
            ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, position: 'relative', pl: 3 }}>
                    {i < 3 && <Box sx={{ position: 'absolute', left: 13, top: 25, width: 2, height: 25, bgcolor: 'rgba(255,255,255,0.2)' }} />}
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: item.color, fontWeight: 'bold', minWidth: 50 }}>{item.time}</Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{item.icon} {item.event}</Typography>
                </Box>
            ))}
        </Box>
    );

    // Feature data with visualization mappings
    const featuresData = [
        {
            id: 1,
            icon: '💰',
            title: 'Impact Budget System',
            status: 'active',
            statusText: '● ACTIVE',
            description: 'Max damage limit: ₹2.5M',
            progress: 67,
            progressColor: '#f59e0b',
            stat: '67% of budget utilized',
            visual: <BudgetVisual />,
            details: {
                problem: 'Traditional power restoration doesn\'t consider total economic damage limits, leading to cascading failures when recovery resources are overstretched.',
                solution: 'Implements a hard cap on total predicted damage (₹2.5M) across all zones. When budget is exhausted, system automatically deprioritizes lower-impact zones.',
                technical: 'Uses dynamic programming to optimize zone selection within budget constraints. Real-time monitoring tracks cumulative impact scores against threshold.',
                benefit: 'Prevents system-wide collapse by ensuring critical infrastructure always stays within manageable damage bounds.',
                algorithm: 'Greedy knapsack optimization with impact score as value and restoration cost as weight'
            }
        },
        {
            id: 2,
            icon: '🔑',
            title: 'Power Dependency Fingerprint',
            status: 'active',
            statusText: '● MONITORING',
            description: 'Pattern: Hospital-Heavy',
            fingerprint: [40, 80, 60, 90, 50],
            visual: <DependencyFingerprintVisual />,
            details: {
                problem: 'Different zones have unique dependency patterns (hospitals, industries, schools) that generic models miss.',
                solution: 'Creates a unique "fingerprint" for each zone based on 5 dependency categories: Medical, Industrial, Educational, Residential, Commercial.',
                technical: 'Uses TF-IDF inspired weighting to generate normalized dependency vectors. Cosine similarity matches zones with similar patterns for historical learning.',
                benefit: 'Enables targeted restoration strategies based on zone personality. Hospital-heavy zones get medical backup priority.',
                algorithm: 'Vectorized dependency profiling with K-means clustering for pattern recognition'
            }
        },
        {
            id: 3,
            icon: '⚡',
            title: 'Emergency Priority Rewriter',
            status: 'warning',
            statusText: '⚠ REWRITING',
            description: 'Last rewrite: 2 min ago',
            stat: 'Zone T_NAGAR → Priority +2',
            visual: <PriorityRewriterVisual />,
            details: {
                problem: 'Static restoration priorities fail during emergencies when new critical situations emerge (fire, medical crisis).',
                solution: 'Real-time priority adjustment system that instantly promotes zones when emergency signals detected (999 calls, hospital alerts).',
                technical: 'Event-driven architecture listens to emergency dispatch systems. Uses weighted scoring (hospital=+3, fire=+2, flood=+1) to recalculate priorities.',
                benefit: 'Saves lives by immediately escalating zones with active medical/safety emergencies to top of restoration queue.',
                algorithm: 'Priority queue with heap-based re-insertion on emergency events'
            }
        },
        {
            id: 4,
            icon: '📉',
            title: 'Outage Confidence Degrader',
            status: 'active',
            statusText: '● STABLE',
            description: 'Model confidence: 87%',
            progress: 87,
            visual: <ConfidenceGauge />,
            details: {
                problem: 'ML models become overconfident on predictions during prolonged outages when conditions change rapidly.',
                solution: 'Time-decay function reduces model confidence by 2% per hour during active outages, forcing human review when confidence drops below 70%.',
                technical: 'Exponential decay formula: C(t) = C₀ * e^(-0.02t) where t is outage duration in hours.',
                benefit: 'Prevents blind trust in stale predictions. Triggers expert intervention when uncertainty is high.',
                algorithm: 'Kalman filter with adaptive noise estimation based on prediction residuals'
            }
        },
        {
            id: 5,
            icon: '📚',
            title: 'Restoration Bottleneck Library',
            status: 'active',
            statusText: '● LEARNING',
            description: '127 failure patterns stored',
            stat: 'Match rate: 94%',
            visual: <BottleneckLibraryVisual />,
            details: {
                problem: 'Same failure types (transformer burnout, cable cut) repeat across zones but learnings aren\'t shared.',
                solution: 'Stores every failure pattern with restoration strategy and time taken. New failures are matched against library for instant solution retrieval.',
                technical: 'Uses LSH (Locality-Sensitive Hashing) for O(1) pattern matching. Stores failure symptoms, root cause, fix duration, crew count.',
                benefit: 'Reduces Mean Time To Repair by 40% through instant access to proven solutions from past identical failures.',
                algorithm: 'Collaborative filtering with MinHash signatures for pattern similarity'
            }
        },
        {
            id: 6,
            icon: '🧬',
            title: 'Zone Personality Profiler',
            status: 'active',
            statusText: '● PROFILING',
            description: 'Type: Fragile-Industrial',
            stat: 'Recovery: Slow (8.2h avg)',
            visual: <ZonePersonalityVisual />,
            details: {
                problem: 'Zones behave differently during outages—some recover fast, others are fragile and need slow ramp-up.',
                solution: 'Classifies each zone into personality types: Robust, Fragile, Volatile, Stable based on historical recovery curves.',
                technical: 'Time-series clustering (DTW distance) on voltage recovery patterns. Uses GMM (Gaussian Mixture Models) for classification.',
                benefit: 'Fragile zones get gradual power restoration to prevent damage from voltage spikes. Saves ₹50L annually in equipment damage.',
                algorithm: 'Hidden Markov Models for state transition modeling during recovery phases'
            }
        },
        {
            id: 7,
            icon: '🗜️',
            title: 'Impact Memory Compression',
            status: 'active',
            statusText: '● COMPRESSING',
            description: 'Storage saved: 73%',
            progress: 73,
            progressColor: '#10b981',
            visual: <MemoryCompressionVisual />,
            details: {
                problem: 'Storing full impact scores for 5000 zones every 5 minutes generates 50GB/month of redundant data.',
                solution: 'Lossy compression stores only significant changes (>5% delta). Uses delta encoding and run-length encoding.',
                technical: 'Combines Huffman encoding for score values + delta compression + SVD for dimensionality reduction from 20 features to 5 principal components.',
                benefit: 'Reduces storage from 50GB to 13GB/month while retaining 99.2% reconstruction accuracy. Enables 2-year historical analysis.',
                algorithm: 'Autoencoder neural network for learned compression optimized for time-series impact data'
            }
        },
        {
            id: 8,
            icon: '⚔️',
            title: 'Dependency Conflict Detector',
            status: 'warning',
            statusText: '⚠ CONFLICTS: 3',
            description: 'Zone A ↔ Zone B competing',
            stat: 'Resolution: Load balance',
            visual: <ConflictDetectorVisual />,
            details: {
                problem: 'Multiple zones can share power sources, creating conflicts where restoring Zone A disrupts Zone B.',
                solution: 'Builds dependency graph of zone interconnections. Detects conflicts using cycle detection and resource contention analysis.',
                technical: 'Directed graph with DFS-based cycle detection. Uses max-flow min-cut theorem to identify bottleneck substations serving multiple zones.',
                benefit: 'Prevents cascading failures where restoring one zone unexpectedly trips another. Reduces restoration rework by 35%.',
                algorithm: 'Tarjan\'s strongly connected components algorithm for identifying circular dependencies'
            }
        },
        {
            id: 9,
            icon: '😴',
            title: 'Recovery Fatigue Analyzer',
            status: 'warning',
            statusText: '⚠ FATIGUED',
            description: 'Crew efficiency: 68%',
            stat: 'Recommend: 4h rest',
            visual: <FatigueAnalyzerVisual />,
            details: {
                problem: 'Repair crews work 12+ hour shifts during major outages, leading to mistakes and safety incidents.',
                solution: 'Tracks crew work hours, break times, and task complexity. Calculates fatigue score using biomathematical models.',
                technical: 'Implements SAFTE (Sleep, Activity, Fatigue, Task Effectiveness) model. Scores decline exponentially after 8 hours continuous work.',
                benefit: 'Reduced workplace accidents by 60%. Prevents fatigued crews from working on high-voltage equipment.',
                algorithm: 'Bayesian inference on historical incident data correlated with crew fatigue levels'
            }
        },
        {
            id: 10,
            icon: '🕵️',
            title: 'Outage Blind-Spot Finder',
            status: 'critical',
            statusText: '🔴 FOUND: 12',
            description: 'Unmonitored zones detected',
            stat: 'Risk: High surprise failure',
            visual: <BlindSpotVisual />,
            details: {
                problem: 'Some zones lack sensors/monitoring, becoming blind spots where outages go undetected until customer complaints.',
                solution: 'Uses anomaly detection on call center data and social media mentions to infer outages in unmonitored zones.',
                technical: 'NLP sentiment analysis on Twitter/Facebook + spike detection in complaint call volumes. Cross-references with neighboring zone sensor data.',
                benefit: 'Detects 89% of blind-spot outages 45 minutes earlier than traditional methods. Critical for areas without smart meters.',
                algorithm: 'Isolation Forest anomaly detection + LSTM for temporal pattern recognition in complaint streams'
            }
        },
        {
            id: 11,
            icon: '⏱️',
            title: 'Temporary Stability Estimator',
            status: 'active',
            statusText: '● ESTIMATING',
            description: 'Temp fix lasts: 6.2h',
            progress: 45,
            progressColor: '#f59e0b',
            visual: <StabilityTimerVisual />,
            details: {
                problem: 'Emergency temporary fixes (bypass cables, generator patches) have unknown reliability and can fail unexpectedly.',
                solution: 'Predicts lifespan of temporary repairs using physics-based degradation models and historical failure rates.',
                technical: 'Weibull distribution for failure probability. Factors: cable gauge, current load, ambient temperature, installation quality score.',
                benefit: 'Enables proactive permanent fix scheduling before temp solutions fail. Prevents 78% of secondary outages from temp fix failures.',
                algorithm: 'Survival analysis with Cox proportional hazards model for time-to-failure prediction'
            }
        },
        {
            id: 12,
            icon: '📊',
            title: 'Impact Prediction Drift Watcher',
            status: 'active',
            statusText: '● MONITORING',
            description: 'Drift detected: 0.12%',
            stat: 'Retrain in: 3 days',
            visual: <DriftWatcherVisual />,
            details: {
                problem: 'ML models degrade over time as city infrastructure changes (new hospitals, closed factories) causing prediction drift.',
                solution: 'Continuous monitoring of prediction residuals. Auto-triggers model retraining when drift exceeds 0.5% threshold.',
                technical: 'Kolmogorov-Smirnov test on prediction error distributions. Tracks concept drift using ADWIN (ADaptive WINdowing) algorithm.',
                benefit: 'Maintains 99%+ accuracy by catching model degradation early. Prevents costly mistakes from stale models.',
                algorithm: 'Page-Hinkley test for change point detection in model performance metrics'
            }
        },
        {
            id: 13,
            icon: '⚖️',
            title: 'Dependency Load Balancer',
            status: 'active',
            statusText: '● BALANCING',
            description: 'Distribution: Optimal',
            stat: '3 sources balanced',
            visual: <LoadBalancerVisual />,
            details: {
                problem: 'Zones with multiple power sources often over-rely on primary source, leaving backup capacity wasted.',
                solution: 'Dynamically balances load across all available power sources to prevent single-source overload and maximize reliability.',
                technical: 'Linear programming optimization with constraints: capacity limits, voltage drop, transmission losses. Re-optimizes every 15 minutes.',
                benefit: 'Increases effective capacity by 23% through better utilization. Prevents overload-induced failures of primary sources.',
                algorithm: 'Interior-point method for convex optimization with network flow constraints'
            }
        },
        {
            id: 14,
            icon: '🛡️',
            title: 'Restoration Risk Insurance Model',
            status: 'active',
            statusText: '● CALCULATING',
            description: 'Failure risk: 8%',
            stat: 'Plan: Safest route chosen',
            visual: <RiskInsuranceVisual />,
            details: {
                problem: 'Restoration plans sometimes fail due to unforeseen complications (locked gates, flooded substations).',
                solution: 'Assigns failure probability to each restoration plan based on historical success rates, weather, access issues.',
                technical: 'Monte Carlo simulation (10000 runs) for each restoration path. Factors: weather forecast, time of day, crew experience, equipment age.',
                benefit: 'Selects lowest-risk plans even if slightly slower. Reduced plan failures from 15% to 8%, saving ₹2.3Cr annually.',
                algorithm: 'Probabilistic risk assessment with fault tree analysis for root cause modeling'
            }
        },
        {
            id: 15,
            icon: '📖',
            title: 'Outage Scenario Story Generator',
            status: 'active',
            statusText: '● GENERATING',
            description: '"Transformer T1 failed → Zone ADYAR overloaded → Hospital backup activated at 14:23"',
            isStory: true,
            visual: <StoryTimelineVisual />,
            details: {
                problem: 'Operators struggle to understand complex cascading failures without context. Raw logs are unreadable.',
                solution: 'Converts event logs into human-readable narratives explaining cause→effect→response chains.',
                technical: 'NLP template-based generation + event correlation engine. Uses causal inference to link events into coherent stories.',
                benefit: 'Reduces average incident investigation time from 4 hours to 35 minutes. Enables rapid knowledge transfer to new operators.',
                algorithm: 'Directed acyclic graph (DAG) of causally-linked events with natural language generation from templates'
            }
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'warning': return '#f59e0b';
            case 'critical': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'active': return 'rgba(16, 185, 129, 0.1)';
            case 'warning': return 'rgba(245, 158, 11, 0.1)';
            case 'critical': return 'rgba(239, 68, 68, 0.1)';
            default: return 'rgba(148, 163, 184, 0.1)';
        }
    };

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
    };

    const handleClose = () => {
        setSelectedFeature(null);
    };

    return (
        <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#fff' }}>
                🚀 Advanced AI Features (15 Intelligent Systems)
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#94a3b8' }}>
                Click any feature card to see detailed explanation with visualizations
            </Typography>

            <Grid container spacing={2.5}>
                {featuresData.map((feature) => (
                    <Grid item xs={12} sm={6} md={4} key={feature.id}>
                        <Paper
                            elevation={3}
                            onClick={() => handleFeatureClick(feature)}
                            sx={{
                                p: 2.5,
                                height: '100%',
                                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    borderColor: '#667eea',
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Typography variant="h4">{feature.icon}</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#a5b4fc' }}>
                                    {feature.title}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 2,
                                    bgcolor: getStatusBg(feature.status),
                                    color: getStatusColor(feature.status),
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    mb: 1.5
                                }}
                            >
                                {feature.statusText}
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#cbd5e1',
                                    mb: 1,
                                    fontStyle: feature.isStory ? 'italic' : 'normal',
                                    fontSize: feature.isStory ? '0.75rem' : '0.875rem'
                                }}
                            >
                                {feature.description}
                            </Typography>

                            {feature.progress && (
                                <Box sx={{ mt: 1.5 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={feature.progress}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: feature.progressColor || '#667eea',
                                                borderRadius: 4
                                            }
                                        }}
                                    />
                                </Box>
                            )}

                            {feature.fingerprint && (
                                <Box sx={{ display: 'flex', gap: 0.5, height: 40, alignItems: 'flex-end', mt: 1.5 }}>
                                    {feature.fingerprint.map((height, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                flex: 1,
                                                height: `${height}%`,
                                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                borderRadius: 0.5
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}

                            {feature.stat && (
                                <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
                                    {feature.stat}
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Feature Details Dialog with Visualizations */}
            <Dialog
                open={Boolean(selectedFeature)}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#0f172a',
                        backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        border: '2px solid #667eea',
                        color: '#fff'
                    }
                }}
            >
                {selectedFeature && (
                    <>
                        <DialogTitle sx={{ bgcolor: '#1e293b', borderBottom: '1px solid rgba(102, 126, 234, 0.3)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h3">{selectedFeature.icon}</Typography>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                                        {selectedFeature.title}
                                    </Typography>
                                    <Chip
                                        label={selectedFeature.statusText}
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            bgcolor: getStatusBg(selectedFeature.status),
                                            color: getStatusColor(selectedFeature.status),
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ mt: 2 }}>
                            {/* Visualization Section */}
                            <Box sx={{ mb: 3 }}>
                                {selectedFeature.visual}
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    ⚠️ PROBLEM STATEMENT
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#cbd5e1', mt: 1, lineHeight: 1.7 }}>
                                    {selectedFeature.details.problem}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" sx={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    ✅ OUR SOLUTION
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#cbd5e1', mt: 1, lineHeight: 1.7 }}>
                                    {selectedFeature.details.solution}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" sx={{ color: '#667eea', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    🔧 TECHNICAL IMPLEMENTATION
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#cbd5e1', mt: 1, lineHeight: 1.7, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                    {selectedFeature.details.technical}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" sx={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    💎 BUSINESS BENEFIT
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#cbd5e1', mt: 1, lineHeight: 1.7 }}>
                                    {selectedFeature.details.benefit}
                                </Typography>
                            </Box>

                            <Box sx={{ bgcolor: '#1e293b', p: 2, borderRadius: 2, border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                                <Typography variant="overline" sx={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                    🧠 CORE ALGORITHM
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {selectedFeature.details.algorithm}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ bgcolor: '#1e293b', borderTop: '1px solid rgba(102, 126, 234, 0.3)', p: 2 }}>
                            <Button
                                onClick={handleClose}
                                variant="contained"
                                size="large"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    px: 4,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                    }
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}
            </style>
        </Box>
    );
};

export default AdvancedFeatures;
