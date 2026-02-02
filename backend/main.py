"""
ElectroWizard - FastAPI Backend Server
Main API server with all endpoints
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import pandas as pd
import os
from mongodb_config import mongo_db, init_mongodb, seed_initial_data

from ml_models import PowerOutagePredictor
from explainable_ai import create_explainer_from_model
from restoration_priority import RestorationPrioritizer

# Initialize FastAPI app
app = FastAPI(
    title="ElectroWizard API",
    description="AI-Based Power Outage Impact Prediction System",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
predictor = PowerOutagePredictor()
explainer = None
prioritizer = RestorationPrioritizer()
dataset = None

# Request/Response models
class ZoneFeatures(BaseModel):
    population_density: int
    hospital_count: int
    industry_count: int
    school_count: int
    atm_count: int
    outage_duration_hours: float
    outage_hour: int
    is_peak_hour: int
    load_demand_kw: float
    historical_outages: int
    equipment_age_years: float
    transformer_capacity_kva: int
    weather_encoded: float = 0.0
    zone_id: Optional[str] = None
    district: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PredictResponse(BaseModel):
    impact_score: float
    risk_level: str
    risk_probabilities: Dict[str, float]
    cluster: int

class ExplanationResponse(BaseModel):
    base_value: float
    predicted_value: float
    feature_impacts: Dict
    explanation: str
    top_factors: List[Dict]

# Startup event - Load models
@app.on_event("startup")
async def startup_event():
    global predictor, explainer, dataset
    
    print("🚀 Starting ElectroWizard API Server...")
    
    # Check if models exist
    if os.path.exists('models/xgb_model.pkl'):
        print("📦 Loading pre-trained models...")
        predictor.load_models()
        
        # Try to create explainer (optional - may fail on some systems)
        try:
            print("🔍 Creating SHAP explainer (Skipped for stability)...")
            # explainer = create_explainer_from_model(
            #     predictor.xgb_model,
            #     predictor.feature_cols
            # )
            # explainer.create_explainer(None)
            # print("✅ SHAP explainer ready!")
            explainer = None
        except Exception as e:
            print(f"⚠️ SHAP explainer failed to initialize: {str(e)}")
            print("⚠️ Explainable AI feature will be limited. Other features will work normally.")
            explainer = None
        
        print("✅ Models loaded successfully!")
    else:
        print("⚠️ No pre-trained models found. Run ml_models.py first to train models.")
    
    # Load dataset if available
    if os.path.exists('chennai_power_outage_data.csv'):
        print("📊 Loading dataset...")
        dataset = pd.read_csv('chennai_power_outage_data.csv')
        
        # Encode weather_condition to weather_encoded
        weather_mapping = {'Clear': 0, 'Rainy': 1, 'Storm': 2, 'Hot': 3}
        if 'weather_condition' in dataset.columns:
            dataset['weather_encoded'] = dataset['weather_condition'].map(weather_mapping).fillna(0)
        else:
            dataset['weather_encoded'] = 0.0
            
        print(f"✅ Loaded {len(dataset)} records with encoded weather")
    else:
        print("⚠️ Dataset not found. Run dataset_generator.py first.")
    
    # Initialize MongoDB
    print("🗄️ Initializing MongoDB...")
    if init_mongodb():
        seed_initial_data()
        print("✅ MongoDB ready!")
    else:
        print("⚠️ MongoDB not available. Using CSV data only.")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "service": "ElectroWizard API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/api/predict",
            "explain": "/api/explain",
            "restoration": "/api/restoration",
            "zones": "/api/zones",
            "stats": "/api/stats"
        }
    }

# Prediction endpoint
@app.post("/api/predict", response_model=PredictResponse)
async def predict_impact(features: ZoneFeatures):
    """Predict impact score and risk level for a zone"""
    try:
        features_dict = features.dict()
        prediction = predictor.predict_impact(features_dict)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Explainability endpoint
@app.post("/api/explain", response_model=ExplanationResponse)
async def explain_prediction(features: ZoneFeatures):
    """Get explanation for why a zone is flagged at a certain risk level"""
    try:
        if explainer is None:
            # Return a basic explanation without SHAP
            features_dict = features.dict()
            prediction = predictor.predict_impact(features_dict)
            
            # Create basic explanation
            basic_explanation = f"""
This zone has an impact score of {prediction['impact_score']:.2f} and is classified as {prediction['risk_level']} risk.

Key contributing factors:
- Hospitals: {features.hospital_count}
- Industries: {features.industry_count}  
- Population Density: {features.population_density}
- Outage Duration: {features.outage_duration_hours} hours

Note: Detailed SHAP analysis is currently unavailable. The system is using the ML model predictions.
"""
            
            return {
                "base_value": 50.0,
                "predicted_value": prediction['impact_score'],
                "feature_impacts": {},
                "explanation": basic_explanation,
                "top_factors": [
                    {"feature": "hospital_count", "contribution": features.hospital_count * 10, "value": features.hospital_count},
                    {"feature": "industry_count", "contribution": features.industry_count * 5, "value": features.industry_count},
                    {"feature": "population_density", "contribution": features.population_density * 0.01, "value": features.population_density}
                ]
            }
        
        features_dict = features.dict()
        explanation = explainer.explain_prediction(features_dict)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all zones with predictions
@app.get("/api/zones")
async def get_all_zones(limit: int = 1000, risk_level: Optional[str] = None):
    """Get all zones with risk predictions"""
    try:
        if dataset is None:
            raise HTTPException(status_code=503, detail="Dataset not loaded")
        
        # Filter by risk level if specified
        if risk_level:
            filtered_data = dataset[dataset['risk_level'] == risk_level]
        else:
            filtered_data = dataset
        
        # Limit results
        results = filtered_data.head(limit).to_dict('records')
        
        return {
            "total": len(filtered_data),
            "returned": len(results),
            "zones": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get zones by district
@app.get("/api/zones/district/{district_name}")
async def get_zones_by_district(district_name: str):
    """Get all zones in a specific district"""
    try:
        if dataset is None:
            raise HTTPException(status_code=503, detail="Dataset not loaded")
        
        district_data = dataset[dataset['district'] == district_name]
        
        if len(district_data) == 0:
            raise HTTPException(status_code=404, detail=f"District '{district_name}' not found")
        
        return {
            "district": district_name,
            "total_zones": len(district_data),
            "zones": district_data.to_dict('records')
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Restoration prioritization endpoint
@app.post("/api/restoration/prioritize")
async def prioritize_restoration(zone_ids: Optional[List[str]] = None, available_crews: int = 5):
    """Get prioritized restoration plan"""
    try:
        if dataset is None:
            raise HTTPException(status_code=503, detail="Dataset not loaded")
        
        # If specific zones provided, filter; otherwise use high-risk zones
        if zone_ids:
            zones_data = dataset[dataset['zone_id'].isin(zone_ids)].to_dict('records')
        else:
            # Get high and critical risk zones
            zones_data = dataset[dataset['risk_level'].isin(['High', 'Critical'])].to_dict('records')
        
        if not zones_data:
            return {"message": "No zones to prioritize"}
        
        # Prioritize zones
        prioritized = prioritizer.prioritize_zones(zones_data)
        
        # Generate restoration plan
        plan = prioritizer.generate_restoration_plan(prioritized, available_crews)
        
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get restoration ETA for specific zone
@app.get("/api/restoration/eta/{zone_id}")
async def get_restoration_eta(zone_id: str, available_crews: int = 5):
    """Get estimated restoration time for a specific zone"""
    try:
        if dataset is None:
            raise HTTPException(status_code=503, detail="Dataset not loaded")
        
        # Get all affected zones
        zones_data = dataset[dataset['risk_level'].isin(['High', 'Critical'])].to_dict('records')
        prioritized = prioritizer.prioritize_zones(zones_data)
        
        eta = prioritizer.get_zone_eta(zone_id, prioritized, available_crews)
        
        return eta
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Statistics endpoint
@app.get("/api/stats")
async def get_statistics():
    """Get overall statistics and insights"""
    try:
        if dataset is None:
            raise HTTPException(status_code=503, detail="Dataset not loaded")
        
        stats = {
            "total_zones": len(dataset),
            "risk_distribution": dataset['risk_level'].value_counts().to_dict(),
            "district_distribution": dataset['district'].value_counts().to_dict(),
            "average_impact_score": float(dataset['impact_score'].mean()),
            "total_hospitals": int(dataset['hospital_count'].sum()),
            "total_industries": int(dataset['industry_count'].sum()),
            "total_population_affected": int(dataset['population_density'].sum()),
            "critical_zones": len(dataset[dataset['risk_level'] == 'Critical']),
            "high_risk_zones": len(dataset[dataset['risk_level'] == 'High']),
            "districts": {
                district: {
                    "total_zones": int(district_data['zone_id'].count()),
                    "avg_impact": float(district_data['impact_score'].mean()),
                    "risk_breakdown": district_data['risk_level'].value_counts().to_dict()
                }
                for district, district_data in dataset.groupby('district')
            }
        }
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Feature importance endpoint
@app.get("/api/model/feature-importance")
async def get_feature_importance():
    """Get feature importance from the model"""
    try:
        importance = predictor.get_feature_importance()
        return {
            "features": [
                {"feature": feat, "importance": float(imp)}
                for feat, imp in importance
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# MongoDB-powered endpoints

@app.get("/api/grid/stats")
async def get_grid_stats():
    """Get real-time grid statistics from MongoDB"""
    try:
        zones_coll = mongo_db.get_collection('zones')
        if zones_coll is None:
            # Fallback to CSV data
            if dataset is not None:
                total = len(dataset)
                high_risk = len(dataset[dataset['risk_level'] == 'Critical'])
                medium_risk = len(dataset[dataset['risk_level'] == 'Medium'])
                low_risk = len(dataset[dataset['risk_level'] == 'Low'])
            else:
                total, high_risk, medium_risk, low_risk = 0, 0, 0, 0
        else:
            total = zones_coll.count_documents({})
            high_risk = zones_coll.count_documents({'risk_level': 'Critical'})
            medium_risk = zones_coll.count_documents({'risk_level': 'Medium'})
            low_risk = zones_coll.count_documents({'risk_level': 'Low'})
        
        return {
            'total_zones': total,
            'high_risk': high_risk,
            'medium_risk': medium_risk,
            'safe': low_risk,
            'risk_distribution': {
                'high': high_risk,
                'medium': medium_risk,
                'low': low_risk
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hospitals")
async def get_hospitals():
    """Get hospital life-support status"""
    try:
        hospitals_coll = mongo_db.get_collection('hospitals')
        if hospitals_coll is not None:
            hospitals = list(hospitals_coll.find({}, {'_id': 0}))
            
            # Fallback for demo if DB is empty
            if not hospitals:
                hospitals = [
                    {
                        "name": "General Hospital Block A",
                        "backup_status": "45",
                        "icu_patients": 12,
                        "why_matters": "CRITICAL: 3 Ventilators + MRI Scanner active. Main grid lost.",
                        "status": "Critical"
                    },
                    {
                        "name": "City Medical Center",
                        "backup_status": "110",
                        "icu_patients": 5,
                        "why_matters": "Switching to Generator 2. O2 Supply Stability: 92%.",
                        "status": "Warning"
                    }
                ]
        else:
            hospitals = []
        
        return {'hospitals': hospitals, 'total_on_backup': len(hospitals)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/digital-twin/simulate")
async def simulate_cascade(outage_cause: str, origin_zone: str, duration_hours: float):
    """Run digital twin cascading failure simulation"""
    try:
        # Simple cascade simulation logic
        zones_coll = mongo_db.get_collection('zones')
        
        # Get origin zone
        if zones_coll is not None:
            origin = zones_coll.find_one({'zone_id': origin_zone})
        else:
            origin = dataset[dataset['zone_id'] == origin_zone].iloc[0].to_dict() if dataset is not None else None
        
        if not origin:
            raise HTTPException(status_code=404, detail="Origin zone not found")
        
        # Dynamic Impact Analysis based on Zone Data
        population = origin.get('population_density', 5000)
        industries = origin.get('industry_count', 5)
        hospitals = origin.get('hospital_count', 1)
        load = origin.get('load_demand_kw', 1000)
        
        # Calculate variability factor based on zone ID hash to ensure consistency per zone
        import hashlib
        zone_hash = int(hashlib.md5(origin_zone.encode()).hexdigest(), 16) % 100
        variability = 0.8 + (zone_hash / 200) # 0.8 to 1.3
        
        # 1. Economic Loss (₹)
        # Formula: (Industries * 50k + Population * 100 + Hospitals * 100k) * Duration * Variability
        base_loss = (industries * 50000) + (population * 100) + (hospitals * 100000)
        economic_loss = base_loss * duration_hours * variability
        
        # 2. Carbon Impact (Tons)
        # Diesel generator usage: 0.5 tons per hour per MW load
        carbon_impact = (load / 1000) * 0.5 * duration_hours * variability
        
        # 3. Affected Zones (Cascade Spread)
        # Higher load & density = wider spread
        base_spread = 1
        if load > 5000: base_spread += 2
        if population > 10000: base_spread += 2
        affected_zones = int(base_spread * (duration_hours / 5) * variability)
        affected_zones = max(1, min(affected_zones, 20)) # Cap between 1 and 20
        
        # 5. Outage Cause Logic (Multipliers)
        cause_multiplier = 1.0
        spread_multiplier = 1.0
        carbon_multiplier = 1.0
        cause_detail = ""
        
        if outage_cause == "Weather Event":
            # Weather affects wide area, less equipment damage but high spread
            cause_multiplier = 1.2
            spread_multiplier = 1.8 
            cause_detail = "Storm front movement detected. Multiple lines affected."
            
        elif outage_cause == "Overload":
            # Overload causes thermal damage and heavy diesel usage
            cause_multiplier = 1.3
            carbon_multiplier = 1.5
            cause_detail = "Thermal limits exceeded. Transformers overheating."
            
        elif outage_cause == "Maintenance Error":
            # Human error is localized but expensive (fixing mistakes)
            cause_multiplier = 1.1
            spread_multiplier = 0.5 # Localized
            cause_detail = "Inadvertent breaker trip during scheduled maintenance."
            
        elif outage_cause == "Equipment Failure":
            # Standard random failure
            cause_detail = "Aging component fatigue detected in substation."
            
        # Apply Multipliers
        economic_loss = economic_loss * cause_multiplier
        carbon_impact = carbon_impact * carbon_multiplier
        affected_zones = int(affected_zones * spread_multiplier)
        affected_zones = max(1, min(affected_zones, 25))

        # 4. Dynamic Timeline
        timeline = []
        
        # T+0: Initial Event
        timeline.append({
            'time': 'T + 0 min',
            'event': f'Failure Origin: {origin_zone}',
            'detail': f'{outage_cause} Detected. {cause_detail} Load lost: {load}kW.',
            'status': 'critical'
        })
        
        # T+15: Grid Reaction
        reaction_event = "Automatic Isolators Tripped"
        if outage_cause == "Weather Event": reaction_event = "Reclosers Locked Out (Safety Mode)"
        if outage_cause == "Overload": reaction_event = "Load Shedding Protocol Initiated"
        
        timeline.append({
            'time': 'T + 15 min',
            'event': 'Grid Response',
            'detail': f'{reaction_event}. Trying to contain fault.',
            'status': 'warning'
        })
        
        # T+60: Cascade Effect (if severe)
        if affected_zones > 2:
            cascade_reason = "load transfer instability"
            if outage_cause == "Weather Event": cascade_reason = "physical infrastructure damage"
            
            timeline.append({
                'time': 'T + 1 hour',
                'event': 'Cascade Propagation',
                'detail': f'Fault spread to {affected_zones - 1} neighboring zones due to {cascade_reason}.',
                'status': 'critical'
            })
            
        # T+End: Impact Summary
        timeline.append({
            'time': f'T + {int(duration_hours)} hours',
            'event': 'Projected Impact Peak',
            'detail': f'Est. Financial Loss: ₹{(economic_loss/100000):.1f} Lakhs. Hospitals affected: {hospitals}.',
            'status': 'warning'
        })
        
        return {
            'timeline': timeline,
            'impact': {
                'economic_loss': round(economic_loss, 2),
                'carbon_tons': round(carbon_impact, 2),
                'affected_zones': affected_zones
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/restoration/ai-plan")
async def get_ai_restoration_plan(affected_zones: List[str], available_crews: int = 5):
    """Get AI-powered restoration plan"""
    try:
        zones_coll = mongo_db.get_collection('zones')
        
        # Get zone details
        if zones_coll is not None:
            zones = list(zones_coll.find({'zone_id': {'$in': affected_zones}}, {'_id': 0}))
        else:
            zones = dataset[dataset['zone_id'].isin(affected_zones)].to_dict('records') if dataset is not None else []
        
        # AI-powered priority sorting (by impact score)
        zones_sorted = sorted(zones, key=lambda x: x.get('impact_score', 0), reverse=True)
        
        # Generate step-by-step plan
        steps = []
        for i, zone in enumerate(zones_sorted[:5]):  # Top 5
            steps.append({
                'step': i + 1,
                'zone_id': zone['zone_id'],
                'action': 'CASCADE REPAIR',
                'priority': 'Critical' if i == 0 else 'High',
                'eta_minutes': 51 + (i * 30),
                'reasoning': f"High risk critical facility. Restoring this zone will bring power to {zone.get('population_density', 0)} residents.",
                'impact': f"Restoring this zone will bring power to {zone.get('population_density', 0)} residents, including {zone.get('hospital_count', 0)} hospital and commercial areas.",
                'resources': f"{available_crews} crews, 0 mobile substations, {zone.get('equipment_age_years', 0)} line workers"
            })
        
        return {
            'plan': steps,
            'total_steps': len(steps),
            'estimated_total_time': sum(s['eta_minutes'] for s in steps)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class EnergyHistoryResponse(BaseModel):
    day: int
    hospital_usage: float
    industry_usage: float
    school_usage: float
    other_usage: float
    total_usage: float
    threshold_breach: bool
    breach_reason: Optional[str] = None

class EnergyEmergencyResponse(BaseModel):
    scenario: str
    total_available: float
    zone_a_allocation: float
    zone_b_allocation: float
    reasoning: str
    priority_zone: str

@app.get("/api/energy/history")
async def get_energy_history(days: int = 30):
    """Get 30-day energy consumption history with anomalies"""
    import random
    
    history = []
    # Thresholds
    THRESHOLDS = {
        'hospital': 200,
        'industry': 500,
        'school': 150,
        'other': 100
    }
    
    reasons = [
        "Medical Emergency Surge",
        "HVAC System Malfunction",
        "Unscheduled Night Shift",
        "Equipment Calibration Error",
        "Grid Voltage Fluctuation",
        "New Wing Testing"
    ]
    
    for day in range(1, days + 1):
        # Base usage with random variance
        hosp = random.normalvariate(180, 20)
        ind = random.normalvariate(450, 50)
        school = random.normalvariate(120, 15)
        other = random.normalvariate(80, 10)
        
        # Introduce anomaly every ~7 days
        breach = False
        reason = None
        
        if day % 7 == 0:
            anomaly_type = random.choice(['hospital', 'industry'])
            if anomaly_type == 'hospital':
                hosp += 150 # Spikes to ~330 (Threshold 200)
                reason = f"Hospital Breach: {random.choice(reasons)}"
            else:
                ind += 300 # Spikes to ~750 (Threshold 500)
                reason = f"Industry Breach: {random.choice(reasons)}"
            breach = True
            
        history.append({
            "day": day,
            "hospital_usage": round(hosp, 1),
            "industry_usage": round(ind, 1),
            "school_usage": round(school, 1),
            "other_usage": round(other, 1),
            "total_usage": round(hosp + ind + school + other, 1),
            "threshold_breach": breach,
            "breach_reason": reason
        })
        
    return {"history": history, "thresholds": THRESHOLDS}

@app.post("/api/energy/emergency-split", response_model=EnergyEmergencyResponse)
async def calculate_emergency_split(zone_a_demand: float, zone_b_demand: float, total_available: float = 100000):
    """Calculate AI-driven power split during emergency"""
    
    # Calculate deficit
    total_demand = zone_a_demand + zone_b_demand
    
    if total_demand <= total_available:
        return {
            "scenario": "Normal Operation",
            "total_available": total_available,
            "zone_a_allocation": zone_a_demand,
            "zone_b_allocation": zone_b_demand,
            "reasoning": "Supply exceeds demand. No shedding required.",
            "priority_zone": "None"
        }
    
    # Emergency: Deficit
    # Logic: Allocating based on "Criticality Score"
    # Assume Zone A is Hospital Heavy (Score 0.8), Zone B is Residential (Score 0.4)
    
    # AI Decision
    reason = "Zone A prioritized due to 3 Major Hospitals and 100% ICU Uptime Requirement. Zone B (Residential) undergoes rolling load shedding."
    
    # Allocations
    # Give Zone A full power min(demand, total)
    zone_a_alloc = min(zone_a_demand, total_available * 0.7) # Cap at 70% of total avail
    zone_b_alloc = max(0, total_available - zone_a_alloc)
    
    return {
        "scenario": "Emergency Load Shedding",
        "total_available": total_available,
        "zone_a_allocation": round(zone_a_alloc, 1),
        "zone_b_allocation": round(zone_b_alloc, 1),
        "reasoning": reason,
        "priority_zone": "Zone A (Hospital Hub)"
    }


class EmailRequest(BaseModel):
    priority: str
    subject: str
    content: str
    recipients: List[str]

@app.post("/api/send-email")
async def send_email(email: EmailRequest):
    """Send real critical alerts using Gmail SMTP"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    import time
    
    # Credentials provided by user
    SENDER_EMAIL = "alvinofficial646@gmail.com"
    APP_PASSWORD = "gbdq fwjw cnas hnrn".replace(" ", "")
    
    print("\n" + "="*60)
    print(f"🚀 INITIATING REAL-TIME EMAIL BROADCAST ({email.priority})")
    print(f"To: {email.recipients}")
    
    try:
        # Create message container
        msg = MIMEMultipart()
        msg['From'] = f"ElectroWizard Grid Alert <{SENDER_EMAIL}>"
        msg['To'] = ", ".join(email.recipients)
        msg['Subject'] = email.subject
        
        # Add body to email
        msg.attach(MIMEText(email.content, 'plain'))
        
        # Connect to Gmail SMTP Server
        print("🔌 Connecting to smtp.gmail.com:587...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        # Login
        print("🔑 Authenticating...")
        server.login(SENDER_EMAIL, APP_PASSWORD)
        
        # Send mail
        print(f"📤 Sending to {len(email.recipients)} stakeholders...")
        server.sendmail(SENDER_EMAIL, email.recipients, msg.as_string())
        
        server.quit()
        
        print("✅ EMAIL SENT SUCCESSFULLY!")
        print("="*60 + "\n")
        
        return {
            "status": "sent", 
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "recipients": email.recipients,
            "mode": "live_smtp"
        }
        
    except Exception as e:
        print(f"❌ EMAIL SENDING FAILED: {str(e)}")
        print("="*60 + "\n")
        # Return mock success for frontend stability if net fails, but log error
        return {
            "status": "error", 
            "detail": str(e),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
