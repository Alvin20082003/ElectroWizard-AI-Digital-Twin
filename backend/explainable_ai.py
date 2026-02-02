"""
ElectroWizard - Explainable AI Module
Uses SHAP for model interpretability
"""

import shap
import numpy as np
import pandas as pd

class ExplainableAI:
    """Explainable AI module using SHAP values"""
    
    def __init__(self, model, feature_names):
        self.model = model
        self.feature_names = feature_names
        self.explainer = None
        
    def create_explainer(self, X_background):
        """Create SHAP explainer with background data"""
        print("🔍 Creating SHAP explainer...")
        # Use TreeExplainer for XGBoost (faster and exact)
        self.explainer = shap.TreeExplainer(self.model)
        print("✅ Explainer ready!")
        
    def explain_prediction(self, features_dict):
        """Generate explanation for a single prediction"""
        # Convert to DataFrame
        X = pd.DataFrame([features_dict])[self.feature_names]
        
        # Calculate SHAP values
        shap_values = self.explainer.shap_values(X)
        
        # Get base value (expected value)
        base_value = self.explainer.expected_value
        
        # Create feature importance dictionary
        feature_impacts = {}
        for i, feature in enumerate(self.feature_names):
            feature_impacts[feature] = {
                'value': float(X[feature].iloc[0]),
                'shap_value': float(shap_values[0][i]),
                'impact': 'increases' if shap_values[0][i] > 0 else 'decreases'
            }
        
        # Sort by absolute SHAP value
        sorted_features = sorted(
            feature_impacts.items(),
            key=lambda x: abs(x[1]['shap_value']),
            reverse=True
        )
        
        # Generate human-readable explanation
        explanation_text = self._generate_explanation(sorted_features[:5], features_dict)
        
        return {
            'base_value': float(base_value),
            'predicted_value': float(base_value + sum([v['shap_value'] for v in feature_impacts.values()])),
            'feature_impacts': dict(sorted_features),
            'explanation': explanation_text,
            'top_factors': [
                {
                    'feature': feature,
                    'contribution': impact['shap_value'],
                    'value': impact['value']
                }
                for feature, impact in sorted_features[:5]
            ]
        }
    
    def _generate_explanation(self, top_features, features_dict):
        """Generate human-readable explanation"""
        explanations = []
        
        feature_descriptions = {
            'hospital_count': 'critical healthcare facilities',
            'industry_count': 'industrial establishments',
            'population_density': 'population density',
            'outage_duration_hours': 'outage duration',
            'is_peak_hour': 'peak hour timing',
            'load_demand_kw': 'power load demand',
            'historical_outages': 'past outage frequency',
            'school_count': 'educational institutions',
            'equipment_age_years': 'equipment age',
            'weather_encoded': 'weather conditions'
        }
        
        for feature, impact in top_features:
            feature_name = feature_descriptions.get(feature, feature)
            shap_val = impact['shap_value']
            feature_val = impact['value']
            
            if feature == 'hospital_count':
                if shap_val > 0:
                    explanations.append(
                        f"🏥 **High hospital count ({int(feature_val)})** significantly increases risk due to critical medical service dependency"
                    )
            elif feature == 'industry_count':
                if shap_val > 0:
                    explanations.append(
                        f"🏭 **Multiple industries ({int(feature_val)})** elevate impact due to economic disruption potential"
                    )
            elif feature == 'population_density':
                if shap_val > 0:
                    explanations.append(
                        f"👥 **High population density ({int(feature_val)} per sq km)** increases the number of affected residents"
                    )
            elif feature == 'outage_duration_hours':
                if shap_val > 0:
                    explanations.append(
                        f"⏱️ **Extended outage duration ({feature_val} hours)** compounds the severity of impact"
                    )
            elif feature == 'is_peak_hour':
                if feature_val == 1 and shap_val > 0:
                    explanations.append(
                        f"🕐 **Peak hour timing** intensifies impact due to higher activity and demand"
                    )
            elif feature == 'load_demand_kw':
                if shap_val > 0:
                    explanations.append(
                        f"⚡ **High load demand ({int(feature_val)} kW)** indicates heavy power consumption area"
                    )
            elif feature == 'historical_outages':
                if shap_val > 0:
                    explanations.append(
                        f"📊 **Frequent past outages ({int(feature_val)})** suggest infrastructure vulnerability"
                    )
        
        if not explanations:
            return "This zone shows low risk factors across all parameters."
        
        return "\n\n".join(explanations)
    
    def batch_explain(self, X_data):
        """Explain multiple predictions"""
        shap_values = self.explainer.shap_values(X_data)
        
        return {
            'shap_values': shap_values.tolist(),
            'features': self.feature_names,
            'base_value': float(self.explainer.expected_value)
        }

def create_explainer_from_model(model, feature_names, background_data=None):
    """Factory function to create explainer"""
    explainer = ExplainableAI(model, feature_names)
    
    if background_data is not None:
        explainer.create_explainer(background_data)
    
    return explainer
