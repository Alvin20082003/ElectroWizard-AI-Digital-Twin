// Chatbot Intelligence Engine - Enhanced with typo tolerance
import { api } from '../services/api';

class ChatbotEngine {
    constructor() {
        this.context = {
            currentTab: 'home',
            gridStats: null,
            lastQuery: null
        };

        // Common typo mappings for fuzzy matching
        this.typoMap = {
            'staus': 'status',
            'stauts': 'status',
            'satus': 'status',
            'gird': 'grid',
            'girds': 'grid',
            'critcal': 'critical',
            'critica': 'critical',
            'zonse': 'zones',
            'zons': 'zones',
            'aler': 'alert',
            'alrt': 'alert',
            'hosptial': 'hospital',
            'hospitl': 'hospital',
            'breech': 'breach',
            'restor': 'restoration',
            'restoraion': 'restoration',
            'repiar': 'repair',
            'repir': 'repair',
            'explin': 'explain',
            'explan': 'explain',
            'shw': 'show',
            'opn': 'open',
            'navigat': 'navigate',
            'tak': 'take',
            'hlp': 'help',
            'asist': 'assist',
            'assit': 'assist'
        };
    }

    setContext(key, value) {
        this.context[key] = value;
    }

    // Normalize message with typo correction
    normalizeMessage(message) {
        if (!message) return '';
        let normalized = message.toLowerCase().trim();

        // Replace common typos
        Object.keys(this.typoMap).forEach(typo => {
            const regex = new RegExp(`\\b${typo}\\b`, 'gi');
            normalized = normalized.replace(regex, this.typoMap[typo]);
        });

        return normalized;
    }

    async getResponse(userMessage) {
        // Normalize message to fix common typos
        const message = this.normalizeMessage(userMessage);

        // Fetch real-time grid data if needed
        if (!this.context.gridStats) {
            try {
                const res = await api.getStatistics();
                this.context.gridStats = res.data;
            } catch (error) {
                console.error('Failed to fetch grid stats', error);
            }
        }

        // Pattern matching for different query types
        if (this.matchesPattern(message, ['hello', 'hi', 'hey', 'start'])) {
            return this.getGreeting();
        }

        if (this.matchesPattern(message, ['status', 'grid', 'current', 'now'])) {
            return this.getGridStatus();
        }

        if (this.matchesPattern(message, ['critical', 'zones', 'dangerous', 'risk'])) {
            return this.getCriticalZones();
        }

        if (this.matchesPattern(message, ['help', 'what can you', 'assist'])) {
            return this.getHelpMessage();
        }

        if (this.matchesPattern(message, ['breach', 'alert', 'emergency'])) {
            return this.getBreachInfo();
        }

        if (this.matchesPattern(message, ['restoration', 'repair', 'fix'])) {
            return this.getRestorationGuidance();
        }

        if (this.matchesPattern(message, ['hospital', 'medical'])) {
            return this.getHospitalInfo();
        }

        if (this.matchesPattern(message, ['show', 'navigate', 'take me', 'open'])) {
            return this.getNavigationResponse(message);
        }

        if (this.matchesPattern(message, ['predict', 'forecast', 'future'])) {
            return this.getPredictionInfo();
        }

        if (this.matchesPattern(message, ['how', 'why', 'explain'])) {
            return this.getExplanation(message);
        }

        // Intelligent fallback with keyword detection
        return this.getSmartFallback(userMessage);
    }

    matchesPattern(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getGreeting() {
        const greetings = [
            "👋 Hello! I'm ElectroWizard AI Assistant. I can help you analyze the power grid, identify critical zones, and guide restoration decisions. What would you like to know?",
            "Hi there! I'm here to assist with grid management. Ask me about zone status, risk levels, or restoration priorities.",
            "Welcome! I can provide real-time grid insights and decision support. How can I help you today?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getGridStatus() {
        if (!this.context.gridStats) {
            return "⚡ **Current Grid Status:**\n- I'm fetching the latest data...\n- Please ask again in a moment.";
        }

        const stats = this.context.gridStats;
        return `⚡ **Live Grid Status Update:**\n\n📊 Zone Distribution:\n- 🔴 Critical: ${stats.critical_zones || 687}\n- 🟠 High Risk: ${stats.high_risk_zones || 58}\n- 🟡 Medium: ${stats.risk_distribution?.Medium || 206}\n- 🟢 Low Risk: ${stats.risk_distribution?.Low || 49}\n\n💡 Total Monitored Zones: ${stats.total_zones || 1000}\n\nWould you like details on any specific zone?`;
    }

    getCriticalZones() {
        return `🚨 **Critical Zone Alert:**\n\n687 zones are currently marked as CRITICAL priority.\n\n**Top Concerns:**\n1. High hospital density areas\n2. Major industrial zones\n3. High population density regions\n\n**Recommended Action:**\n- View the Risk Map for detailed locations\n- Check Restoration Planner for priority sequence\n- Review AI explanations for root causes\n\n[Would you like me to open the Risk Map?]`;
    }

    getHelpMessage() {
        return `🤖 **I can help you with:**\n\n📊 **Grid Analysis:**\n- "What's the current grid status?"\n- "Show me critical zones"\n- "How many breaches today?"\n\n🔧 **Decision Support:**\n- "What should I do about Zone X?"\n- "Show restoration plan"\n- "Explain this alert"\n\n🗺️ **Navigation:**\n- "Open the risk map"\n- "Take me to energy thresholds"\n- "Show hospital monitor"\n\n💡 **AI Insights:**\n- "Why is Zone X critical?"\n- "Predict next outage"\n- "Explain this failure"\n\nJust ask naturally - I understand context!`;
    }

    getBreachInfo() {
        return `⚠️ **Recent Breach Analysis:**\n\nLast 30 days: 12 threshold breaches detected\n\n**Most Recent:**\n- Location: Chennai Sector 4 Hub\n- Type: Hospital Energy Surge\n- Cause: Medical equipment spike (MRI + 3 ventilators)\n- Status: Auto-alert sent to supervisors\n\n**AI Diagnosis:**\nConfidence: 94%\nPredicted transformer failure in 45 mins if load not reduced.\n\n🔧 Automated rerouting already initiated.\n\n[View Energy Thresholds Tab for details]`;
    }

    getRestorationGuidance() {
        return `🔧 **Restoration Guidance:**\n\n**Current Strategy:**\n- Phase 1: Critical (Healthcare) - 51 min ETA\n- Phase 2: High Priority (Industrial) - 81 min ETA\n- Phase 3: Medium Priority - 2.5 hrs ETA\n- Phase 4: Standard (Residential) - 4 hrs ETA\n\n**Active Crews:** 5 teams deployed\n\n**Optimization:**\nAI has sequenced repairs to minimize impact on critical infrastructure.\n\n💡 Total restoration time: 9h 15m\n\n[Open Restoration Planner for full details]`;
    }

    getHospitalInfo() {
        return `🏥 **Hospital Power Status:**\n\n**General Hospital Block A:**\n- Status: ⚠️ Running on Backup\n- Backup Duration: 45 mins remaining\n- ICU Patients: 12 active\n- Critical Equipment: 3 Ventilators + MRI Scanner\n\n**City Medical Center:**\n- Status: ⚠️ Generator Switch (G2 Active)\n- O2 Supply Stability: 92%\n- ICU Patients: 5\n\n🚨 URGENT: Hospital Block A requires priority restoration.\n\n[View Hospital Life-Support tab for real-time monitoring]`;
    }

    getNavigationResponse(message) {
        if (message.includes('risk map') || message.includes('map')) {
            return { text: "🗺️ Opening Risk Map visualization...", action: 'navigate', target: 'risk-map' };
        }
        if (message.includes('energy') || message.includes('threshold')) {
            return { text: "⚡ Taking you to Energy Thresholds...", action: 'navigate', target: 'energy' };
        }
        if (message.includes('restoration') || message.includes('plan')) {
            return { text: "🔧 Opening Restoration Planner...", action: 'navigate', target: 'restoration' };
        }
        if (message.includes('hospital')) {
            return { text: "🏥 Navigating to Hospital Monitor...", action: 'navigate', target: 'hospital' };
        }
        if (message.includes('ai') || message.includes('explain')) {
            return { text: "🧠 Opening Explainable AI panel...", action: 'navigate', target: 'xai' };
        }
        return "I can help you navigate! Try: 'Show me the risk map' or 'Open energy thresholds'";
    }

    getPredictionInfo() {
        return `🔮 **AI Predictions:**\n\n**Next 24 Hours:**\n- Probability of new critical zone: 23%\n- Expected load spike: 6 PM - 9 PM\n- High-risk zones: 12 likely to escalate\n\n**Machine Learning Models Active:**\n- XGBoost Impact Predictor: 91.2% accuracy\n- Random Forest Classifier: 89.7%\n- Decision Tree (Explainable): 87.3%\n\n**Confidence Level:** HIGH\n\nRecommendation: Pre-position crews near T. Nagar and Guindy zones.\n\n[View AI Models tab for detailed analysis]`;
    }

    getExplanation(message) {
        return `🧠 **AI Explainability:**\n\nI use multiple AI models to analyze the grid:\n\n1. **XGBoost** - Predicts impact severity\n2. **Random Forest** - Classifies risk levels\n3. **Decision Tree** - Provides interpretable rules\n4. **K-Means** - Groups similar zones\n\n**How I make decisions:**\n- Analyze historical patterns\n- Consider real-time sensor data\n- Factor in critical infrastructure (hospitals, industries)\n- Apply SHAP values for transparency\n\nEvery prediction includes:\n- Confidence score\n- Contributing factors\n- Recommended actions\n\n[Check the XAI tab to see feature importance visualizations]`;
    }

    getSmartFallback(userMsg) {
        const msg = userMsg.toLowerCase();
        const suggestions = [];

        // Detect keywords and suggest relevant queries
        if (/zone|area|location|sector|region/i.test(msg)) {
            suggestions.push("💡 Try: 'Show critical zones' or 'What zones need attention?'");
        }
        if (/power|energy|electric|load/i.test(msg)) {
            suggestions.push("💡 Ask: 'What's the grid status?' or 'Show energy levels'");
        }
        if (/break|fail|outage|problem|issue|down/i.test(msg)) {
            suggestions.push("💡 Try: 'Show breach status' or 'What's the emergency?'");
        }
        if (/when|time|how long|duration/i.test(msg)) {
            suggestions.push("💡 Ask: 'Show restoration timeline' or 'How long for repairs?'");
        }
        if (/where|map|show me|find/i.test(msg)) {
            suggestions.push("💡 Say: 'Open the risk map' or 'Navigate to zones'");
        }

        if (suggestions.length > 0) {
            return `I think I can help with that!\n\n${suggestions.join('\n')}\n\n📚 Type "help" for all capabilities.`;
        }

        // Complete fallback for truly random questions
        return `🤔 Hmm, I'm not sure about that specific question.\n\nI'm specialized in:\n\n⚡ Grid status & zone analysis\n🚨 Emergency alerts & breaches\n🗺️ Dashboard navigation\n🤖 AI predictions & insights\n\nTry: "What's the grid status?" or "help"`;
    }
}

export const chatbotEngine = new ChatbotEngine();
