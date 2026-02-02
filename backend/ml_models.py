"""
ElectroWizard - ML Models Module
Implements XGBoost, Random Forest, Decision Tree, and K-Means models
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
import joblib
import os

class PowerOutagePredictor:
    """Complete ML pipeline for power outage impact prediction"""
    
    def __init__(self):
        self.xgb_model = None
        self.rf_classifier = None
        self.dt_classifier = None
        self.kmeans_model = None
        self.scaler = StandardScaler()
        
        # Feature columns
        self.feature_cols = [
            'population_density', 'hospital_count', 'industry_count', 
            'school_count', 'atm_count', 'outage_duration_hours',
            'outage_hour', 'is_peak_hour', 'load_demand_kw',
            'historical_outages', 'equipment_age_years', 'transformer_capacity_kva'
        ]
        
    def load_data(self, filepath='chennai_power_outage_data.csv'):
        """Load dataset"""
        print(f"📊 Loading data from {filepath}...")
        df = pd.read_csv(filepath)
        
        # Encode weather condition
        weather_mapping = {'Clear': 0, 'Rain': 1, 'Storm': 2, 'Hot': 0.5}
        df['weather_encoded'] = df['weather_condition'].map(weather_mapping)
        
        # Encode risk level
        risk_mapping = {'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3}
        df['risk_encoded'] = df['risk_level'].map(risk_mapping)
        
        self.feature_cols.append('weather_encoded')
        
        return df
    
    def train_models(self, df):
        """Train all ML models"""
        print("\n🤖 Training Machine Learning Models...")
        print("=" * 60)
        
        # Prepare features and targets
        X = df[self.feature_cols]
        y_impact = df['impact_score']  # Regression target
        y_risk = df['risk_encoded']    # Classification target
        
        # Split data
        X_train, X_test, y_impact_train, y_impact_test, y_risk_train, y_risk_test = train_test_split(
            X, y_impact, y_risk, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # 1. XGBoost Regressor - Primary Impact Prediction
        print("\n1️⃣ Training XGBoost Regressor (Impact Score Prediction)...")
        self.xgb_model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=8,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        self.xgb_model.fit(X_train, y_impact_train)
        
        y_pred_xgb = self.xgb_model.predict(X_test)
        mse_xgb = mean_squared_error(y_impact_test, y_pred_xgb)
        r2_xgb = r2_score(y_impact_test, y_pred_xgb)
        print(f"   ✓ XGBoost MSE: {mse_xgb:.2f}, R² Score: {r2_xgb:.4f}")
        
        # 2. Random Forest Classifier - Risk Level Classification
        print("\n2️⃣ Training Random Forest Classifier (Risk Level)...")
        self.rf_classifier = RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            min_samples_split=5,
            random_state=42
        )
        self.rf_classifier.fit(X_train_scaled, y_risk_train)
        
        y_pred_rf = self.rf_classifier.predict(X_test_scaled)
        acc_rf = accuracy_score(y_risk_test, y_pred_rf)
        print(f"   ✓ Random Forest Accuracy: {acc_rf:.4f}")
        
        # 3. Decision Tree - Explainable Model
        print("\n3️⃣ Training Decision Tree (Explainable Model)...")
        self.dt_classifier = DecisionTreeClassifier(
            max_depth=8,
            min_samples_split=10,
            random_state=42
        )
        self.dt_classifier.fit(X_train_scaled, y_risk_train)
        
        y_pred_dt = self.dt_classifier.predict(X_test_scaled)
        acc_dt = accuracy_score(y_risk_test, y_pred_dt)
        print(f"   ✓ Decision Tree Accuracy: {acc_dt:.4f}")
        
        # 4. K-Means Clustering - Zone Grouping
        print("\n4️⃣ Training K-Means Clustering (Zone Grouping)...")
        self.kmeans_model = KMeans(n_clusters=5, random_state=42, n_init=10)
        cluster_features = X[['population_density', 'hospital_count', 'industry_count', 'load_demand_kw']]
        cluster_features_scaled = StandardScaler().fit_transform(cluster_features)
        self.kmeans_model.fit(cluster_features_scaled)
        print(f"   ✓ K-Means trained with 5 clusters")
        
        print("\n✅ All models trained successfully!")
        
        return {
            'xgb_r2': r2_xgb,
            'rf_accuracy': acc_rf,
            'dt_accuracy': acc_dt
        }
    
    def predict_impact(self, features_dict):
        """Predict impact score for a single zone"""
        # Convert dict to DataFrame
        X = pd.DataFrame([features_dict])[self.feature_cols]
        
        # XGBoost prediction
        impact_score = self.xgb_model.predict(X)[0]
        
        # Random Forest classification
        X_scaled = self.scaler.transform(X)
        risk_class = self.rf_classifier.predict(X_scaled)[0]
        risk_proba = self.rf_classifier.predict_proba(X_scaled)[0]
        
        # K-Means cluster
        cluster_features = X[['population_density', 'hospital_count', 'industry_count', 'load_demand_kw']]
        cluster_features_scaled = StandardScaler().fit_transform(cluster_features)
        cluster = self.kmeans_model.predict(cluster_features_scaled)[0]
        
        risk_levels = ['Low', 'Medium', 'High', 'Critical']
        
        return {
            'impact_score': float(impact_score),
            'risk_level': risk_levels[risk_class],
            'risk_probabilities': {
                'Low': float(risk_proba[0]),
                'Medium': float(risk_proba[1]),
                'High': float(risk_proba[2]),
                'Critical': float(risk_proba[3])
            },
            'cluster': int(cluster)
        }
    
    def get_feature_importance(self):
        """Get feature importance from XGBoost model"""
        importance = self.xgb_model.feature_importances_
        feature_importance = dict(zip(self.feature_cols, importance))
        return sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
    
    def save_models(self, directory='models'):
        """Save all trained models"""
        os.makedirs(directory, exist_ok=True)
        
        joblib.dump(self.xgb_model, f'{directory}/xgb_model.pkl')
        joblib.dump(self.rf_classifier, f'{directory}/rf_classifier.pkl')
        joblib.dump(self.dt_classifier, f'{directory}/dt_classifier.pkl')
        joblib.dump(self.kmeans_model, f'{directory}/kmeans_model.pkl')
        joblib.dump(self.scaler, f'{directory}/scaler.pkl')
        joblib.dump(self.feature_cols, f'{directory}/feature_cols.pkl')
        
        print(f"\n💾 Models saved to {directory}/")
    
    def load_models(self, directory='models'):
        """Load pre-trained models"""
        self.xgb_model = joblib.load(f'{directory}/xgb_model.pkl')
        self.rf_classifier = joblib.load(f'{directory}/rf_classifier.pkl')
        self.dt_classifier = joblib.load(f'{directory}/dt_classifier.pkl')
        self.kmeans_model = joblib.load(f'{directory}/kmeans_model.pkl')
        self.scaler = joblib.load(f'{directory}/scaler.pkl')
        self.feature_cols = joblib.load(f'{directory}/feature_cols.pkl')
        
        print(f"✅ Models loaded from {directory}/")

def main():
    """Train and save all models"""
    predictor = PowerOutagePredictor()
    
    # Load data
    df = predictor.load_data()
    
    # Train models
    metrics = predictor.train_models(df)
    
    print("\n📈 Model Performance Summary:")
    print(f"   XGBoost R² Score: {metrics['xgb_r2']:.4f}")
    print(f"   Random Forest Accuracy: {metrics['rf_accuracy']:.4f}")
    print(f"   Decision Tree Accuracy: {metrics['dt_accuracy']:.4f}")
    
    # Feature importance
    print("\n📊 Top 5 Important Features:")
    for feature, importance in predictor.get_feature_importance()[:5]:
        print(f"   {feature}: {importance:.4f}")
    
    # Save models
    predictor.save_models()
    
    print("\n🎉 Training complete!")

if __name__ == "__main__":
    main()
