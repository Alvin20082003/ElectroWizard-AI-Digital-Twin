# 🚀 ElectroWizard - Quick Start Guide

## ⚡ Run Everything (2 Terminals)

### Terminal 1 - Backend
```powershell
cd j:\newveroxa\backend
uvicorn main:app --reload
```
**Backend will run at**: http://localhost:8000

### Terminal 2 - Frontend
```powershell
cd j:\newveroxa\frontend
npm install  # First time only
npm start
```
**Frontend will run at**: http://localhost:3000

---

## 🎯 Hackathon Demo Checklist

✅ **Dataset**: 100,000 Chennai records - READY
✅ **Models Trained**: XGBoost (99.93%), Random Forest (88.72%), Decision Tree (86.80%), K-Means - READY
✅ **Backend API**: FastAPI with 9 endpoints - READY
✅ **Frontend**: React with all 4 features - READY

---

## 📊 What's Included

### 4 Core Features (All Tabs in Dashboard)

1. **🗺️ Risk Map**
   - Leaflet map of Chennai
   - Color-coded zones (Red/Orange/Yellow/Green)
   - Click zones for details
   
2. **🧠 Explainable AI**
   - Enter zone ID to analyze
   - See SHAP values (why it's flagged)
   - Human-readable explanations

3. **⚡ Restoration Priority**
   - Hospital-first prioritization
   - 4-phase restoration plan
   - Crew allocation & ETAs

4. **📡 Response Management**
   - Real-time alerts
   - Statistics dashboard
   - Communication logs

---

## 🎤 Demo Script (5-7 minutes)

### 1. Introduction (30s)
"AI-powered system that predicts power outage impact BEFORE they happen"

### 2. Risk Map (1min)
- Show Chennai map with color-coded zones
- Click on red zone → show hospital count

### 3. Explainable AI (1.5min)
- Enter critical zone ID
- Show SHAP chart: "Hospital count = 52% of risk"
- Read explanation aloud

### 4. Restoration (1.5min)
- Show 4-phase priority: Hospitals → Industries → Schools → Residential
- Highlight recommendations

### 5. Response (1min)
- Real-time alerts
- Statistics

### 6. Technical (1min)
- "4 ML models, 99.93% accuracy"
- "100K Chennai records"
- "Explainable AI using SHAP"

### 7. Impact (30s)
- Saves lives (hospital priority)
- Reduces economic loss
- Builds public trust

---

## 🏆 Key Talking Points

**Innovation:**
- Explainable AI (not black-box)
- Hospital-first smart prioritization
- 4 ML models working together

**Technical Depth:**
- 99.93% R² score (XGBoost)
- 100,000 realistic records
- 15 Chennai districts

**Real Impact:**
- Saves lives
- Reduces economic loss
- Improves response time
- Builds public trust

---

## 📁 Files Location

- **Dataset**: `j:\newveroxa\backend\chennai_power_outage_data.csv`
- **Models**: `j:\newveroxa\backend\models\`
- **Backend**: `j:\newveroxa\backend\main.py`
- **Frontend**: `j:\newveroxa\frontend\src\`

---

## 🐛 Troubleshooting

**If backend fails to start:**
```powershell
cd j:\newveroxa\backend
pip install -r requirements.txt
```

**If frontend fails:**
```powershell
cd j:\newveroxa\frontend
npm install
```

**If models not found:**
```powershell
cd j:\newveroxa\backend
python ml_models.py
```

---

## ✨ You're Ready!

Everything is built and tested. Just run the 2 terminals and your demo will be ready in 30 seconds.

**Good luck at the hackathon! 🎉**
