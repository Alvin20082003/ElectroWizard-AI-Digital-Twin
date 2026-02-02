import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Tabs, Tab, Box, Container,
    ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import {
    Map as MapIcon,
    Psychology as PsychologyIcon,
    Build as BuildIcon,
    Notifications as NotificationsIcon,
    Rocket as RocketIcon,
    LocalHospital as HospitalIcon,
    Science as ScienceIcon,
    AutoAwesome as AIIcon,
    Bolt as LightningIcon,
    BatteryChargingFull as BatteryIcon
} from '@mui/icons-material';

import RiskMap from './components/RiskMap';
import ExplainableAI from './components/ExplainableAIDashboard';
import RestorationDecision from './components/RestorationDecision';
import ResponseManagement from './components/ResponseManagement';
import AdvancedFeatures from './components/AdvancedFeaturesEnhanced';
import LiveGridMonitor from './components/LiveGridMonitor';
import HospitalLifeSupport from './components/HospitalLifeSupport';
import DigitalTwinSimulator from './components/DigitalTwinSimulator';
import AIRestorationPlanner from './components/AIRestorationPlanner';
import EnergyThresholdMonitor from './components/EnergyThresholdMonitor';
import BESSDashboard from './components/BESSDashboard';

// Light Theme
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6C5DD3',
        },
        secondary: {
            main: '#3B82F6',
        },
        background: {
            default: '#f3f4f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
        h6: {
            fontWeight: 700,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.Mui-selected': {
                        color: '#6C5DD3',
                    },
                },
            },
        },
    },
});

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index} style={{ height: '100%' }}>
            {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
        </div>
    );
}

function App() {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
                {/* Clean Header */}
                <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb', zIndex: 1201 }}>
                    <Toolbar sx={{ minHeight: 70 }}>
                        <AIIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 32 }} />
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                            ElectroWizard<span style={{ color: '#6C5DD3' }}>AI</span>
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Current User
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    Alvin Sudhan
                                </Typography>
                            </Box>
                            <Box sx={{
                                width: 42, height: 42, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6C5DD3 0%, #3B82F6 100%)',
                                display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(108, 93, 211, 0.3)'
                            }}>
                                AS
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Navigation Tabs */}
                <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 2 }}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        centered
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="secondary"
                        indicatorColor="secondary"
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                minHeight: '64px',
                                textTransform: 'none',
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: 'primary.main'
                                }
                            }
                        }}
                    >
                        {/* New Features - Phase 2 */}
                        <Tab icon={<MapIcon />} label="Live Grid Monitor" iconPosition="start" />
                        <Tab icon={<ScienceIcon />} label="Digital Twin Simulator" iconPosition="start" />
                        <Tab icon={<HospitalIcon />} label="Hospital Life-Support" iconPosition="start" />
                        <Tab icon={<AIIcon />} label="AI Restoration Planner" iconPosition="start" />

                        {/* Original Features - Phase 1 */}
                        <Tab icon={<PsychologyIcon />} label="Explainable AI" iconPosition="start" />
                        <Tab icon={<MapIcon />} label="Risk Map (Classic)" iconPosition="start" />
                        <Tab icon={<BuildIcon />} label="Restoration Decision" iconPosition="start" />
                        <Tab icon={<NotificationsIcon />} label="Response Management" iconPosition="start" />
                        <Tab icon={<RocketIcon />} label="Advanced Features" iconPosition="start" />
                        <Tab icon={<LightningIcon />} label="Energy Thresholds" iconPosition="start" />
                        <Tab icon={<BatteryIcon />} label="BESS Distribution" iconPosition="start" />
                    </Tabs>
                </Box>

                {/* Content Area */}
                <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
                    <TabPanel value={currentTab} index={0}><LiveGridMonitor /></TabPanel>
                    <TabPanel value={currentTab} index={1}><DigitalTwinSimulator /></TabPanel>
                    <TabPanel value={currentTab} index={2}><HospitalLifeSupport /></TabPanel>
                    <TabPanel value={currentTab} index={3}><AIRestorationPlanner /></TabPanel>
                    <TabPanel value={currentTab} index={4}><ExplainableAI /></TabPanel>
                    <TabPanel value={currentTab} index={5}><RiskMap /></TabPanel>
                    <TabPanel value={currentTab} index={6}><RestorationDecision /></TabPanel>
                    <TabPanel value={currentTab} index={7}><ResponseManagement /></TabPanel>
                    <TabPanel value={currentTab} index={8}><AdvancedFeatures /></TabPanel>
                    <TabPanel value={currentTab} index={9}><EnergyThresholdMonitor /></TabPanel>
                    <TabPanel value={currentTab} index={10}><BESSDashboard /></TabPanel>
                </Box>

                {/* Footer */}
                <Box sx={{
                    py: 1,
                    px: 3,
                    bgcolor: 'white',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            © 2026 ElectroWizard | Powered by XGBoost, Random Forest, K-Means
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: '#d32f2f', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Disclaimer: This system is a conceptual prototype designed for future implementation analysis. Real-world integration pending.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BuildIcon fontSize="small" sx={{ fontSize: 14 }} /> 19 Advanced Features Active
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} /> System Active
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
