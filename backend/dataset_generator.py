"""
ElectroWizard - Chennai Power Outage Dataset Generator
Generates 100,000 records with realistic Chennai district data
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Chennai districts and their characteristics
CHENNAI_DISTRICTS = {
    'Anna Nagar': {'lat_center': 13.0850, 'lon_center': 80.2101, 'density': 'high', 'critical_level': 'high'},
    'T Nagar': {'lat_center': 13.0418, 'lon_center': 80.2341, 'density': 'very_high', 'critical_level': 'high'},
    'Adyar': {'lat_center': 13.0067, 'lon_center': 80.2582, 'density': 'high', 'critical_level': 'medium'},
    'Velachery': {'lat_center': 12.9750, 'lon_center': 80.2210, 'density': 'high', 'critical_level': 'medium'},
    'Tambaram': {'lat_center': 12.9249, 'lon_center': 80.1000, 'density': 'medium', 'critical_level': 'low'},
    'Porur': {'lat_center': 13.0358, 'lon_center': 80.1564, 'density': 'medium', 'critical_level': 'medium'},
    'Guindy': {'lat_center': 13.0067, 'lon_center': 80.2206, 'density': 'high', 'critical_level': 'high'},
    'Mylapore': {'lat_center': 13.0339, 'lon_center': 80.2619, 'density': 'very_high', 'critical_level': 'medium'},
    'Kodambakkam': {'lat_center': 13.0525, 'lon_center': 80.2253, 'density': 'high', 'critical_level': 'medium'},
    'Nungambakkam': {'lat_center': 13.0569, 'lon_center': 80.2425, 'density': 'high', 'critical_level': 'high'},
    'Egmore': {'lat_center': 13.0732, 'lon_center': 80.2609, 'density': 'very_high', 'critical_level': 'high'},
    'Royapettah': {'lat_center': 13.0524, 'lon_center': 80.2625, 'density': 'high', 'critical_level': 'medium'},
    'Triplicane': {'lat_center': 13.0543, 'lon_center': 80.2780, 'density': 'very_high', 'critical_level': 'medium'},
    'Saidapet': {'lat_center': 13.0210, 'lon_center': 80.2231, 'density': 'high', 'critical_level': 'medium'},
    'Tondiarpet': {'lat_center': 13.1290, 'lon_center': 80.2847, 'density': 'medium', 'critical_level': 'low'}
}

DENSITY_VALUES = {
    'very_high': (8000, 12000),
    'high': (5000, 8000),
    'medium': (2000, 5000),
    'low': (500, 2000)
}

CRITICAL_HOSPITALS = {
    'high': (3, 8),
    'medium': (1, 3),
    'low': (0, 1)
}

def generate_realistic_dataset(n_records=1000):
    """Generate realistic power outage dataset for Chennai"""
    
    np.random.seed(42)
    random.seed(42)
    
    data = []
    
    # Distribute records across districts
    district_names = list(CHENNAI_DISTRICTS.keys())
    district_weights = [1.5 if d['density'] == 'very_high' else 
                       1.2 if d['density'] == 'high' else 
                       1.0 if d['density'] == 'medium' else 0.7 
                       for d in CHENNAI_DISTRICTS.values()]
    
    for i in range(n_records):
        # Select district
        district = random.choices(district_names, weights=district_weights)[0]
        district_info = CHENNAI_DISTRICTS[district]
        
        # Generate coordinates
        lat_offset = np.random.uniform(-0.02, 0.02)
        lon_offset = np.random.uniform(-0.02, 0.02)
        
        lat = district_info['lat_center'] + lat_offset
        lon = district_info['lon_center'] + lon_offset
        
        # Coastal Guardrail: Chennai is on East Coast (approx Lon > 80.28 is Ocean)
        # If point lands in ocean, "bounce" it back West onto land
        if lon > 80.275:
            diff = lon - 80.275
            lon = 80.275 - diff # Reflect relative to boundary
            
        # Hard cap just in case reflection wasn't enough (e.g. extremely East center)
        if lon > 80.28:
            lon = 80.28 - np.random.uniform(0.001, 0.01)
        
        # Population density
        density_range = DENSITY_VALUES[district_info['density']]
        population_density = np.random.randint(density_range[0], density_range[1])
        
        # Critical facilities
        hospital_range = CRITICAL_HOSPITALS[district_info['critical_level']]
        hospital_count = np.random.randint(hospital_range[0], hospital_range[1] + 1)
        
        # Industries (more in medium density areas)
        industry_count = np.random.randint(0, 15) if district_info['density'] in ['medium', 'high'] else np.random.randint(0, 5)
        
        # Schools and other critical facilities
        school_count = np.random.randint(1, 8)
        atm_count = np.random.randint(2, 20)
        
        # Outage characteristics
        # Outage characteristics
        outage_duration_hours = np.random.choice([0.5, 1, 2, 3, 4, 6, 8, 12, 24], p=[0.15, 0.25, 0.2, 0.15, 0.1, 0.08, 0.04, 0.02, 0.01])
        
        # Time of outage (hour of day)
        outage_hour = np.random.randint(0, 24)
        
        # Peak hours have higher impact
        is_peak_hour = 1 if outage_hour in [9, 10, 11, 18, 19, 20, 21] else 0
        
        # Historical outages (more frequent in some areas)
        historical_outages = np.random.poisson(3) if district_info['critical_level'] == 'high' else np.random.poisson(2)
        
        # Equipment age (years)
        equipment_age_years = np.random.uniform(5, 30)
 
        # Transformer capacity
        transformer_capacity_kva = np.random.choice([100, 250, 500, 1000, 1600])

        # 4. Weather (Encoded directly to match model expectations)
        # 0=Clear, 1=Rain, 2=Storm, 0.5=Hot
        weather_options = ['Clear', 'Rain', 'Storm', 'Hot']
        weather_condition = np.random.choice(weather_options, p=[0.6, 0.2, 0.1, 0.1])
        weather_map = {'Clear': 0.0, 'Rain': 1.0, 'Storm': 2.0, 'Hot': 0.5}
        weather_encoded = weather_map[weather_condition]
        
        # 5. Logic for Risk Calculation
        risk_score = (
            (population_density / 30000) * 0.2 +
            (hospital_count * 0.3) +
            (outage_duration_hours / 24) * 0.2 +
            (1 if weather_condition == 'Storm' else 0) * 0.3 +
            (equipment_age_years / 30) * 0.1
        )
        
        # Load demand (kW) - higher during peak hours
        base_load = population_density * np.random.uniform(0.8, 1.5)
        load_demand_kw = base_load * 1.5 if is_peak_hour else base_load
        
        if risk_score > 0.7:
            risk_level = 'Critical'
            impact_score = np.random.uniform(80, 100)
        elif risk_score > 0.5:
            risk_level = 'High'
            impact_score = np.random.uniform(60, 80)
        elif risk_score > 0.3:
            risk_level = 'Medium'
            impact_score = np.random.uniform(40, 60)
        else:
            risk_level = 'Low'
            impact_score = np.random.uniform(0, 40)
            
        # Zone ID
        zone_id = f"{district.replace(' ', '_').upper()}_Z{i % 1000:03d}"

        data.append({
            'zone_id': zone_id,
            'district': district,
            'latitude': lat,
            'longitude': min(lon, 80.295), # Clamp longitude to stay on land (approx coast line)
            'population_density': population_density,
            'hospital_count': hospital_count,
            'industry_count': industry_count,
            'school_count': school_count,
            'atm_count': atm_count,
            'outage_duration_hours': round(outage_duration_hours, 2),
            'outage_hour': outage_hour,
            'is_peak_hour': is_peak_hour,
            'load_demand_kw': round(load_demand_kw, 2),
            'historical_outages': historical_outages,
            'equipment_age_years': equipment_age_years,
            'transformer_capacity_kva': transformer_capacity_kva,
            'weather_condition': weather_condition,
            'weather_encoded': weather_encoded,
            'risk_level': risk_level,
            'impact_score': round(impact_score, 2)
        })
    
    return pd.DataFrame(data)

def main():
    print("🚀 ElectroWizard Dataset Generator")
    print("=" * 50)
    print(f"Generating 1,000 records for Chennai districts...")
    
    # Generate dataset
    df = generate_realistic_dataset(1000)
    
    # Display statistics
    print(f"\n✅ Dataset Generated!")
    print(f"Total Records: {len(df)}")
    print(f"\nDistrict Distribution:")
    print(df['district'].value_counts())
    
    print(f"\n Risk Level Distribution:")
    print(df['risk_level'].value_counts())
    
    print(f"\n Summary Statistics:")
    print(df[['population_density', 'hospital_count', 'industry_count', 'impact_score']].describe())
    
    # Save to CSV
    csv_path = 'chennai_power_outage_data.csv'
    df.to_csv(csv_path, index=False)
    print(f"\n💾 Saved to CSV: {csv_path}")
    
    # Save to Excel
    excel_path = 'chennai_power_outage_data.xlsx'
    df.to_excel(excel_path, index=False, engine='openpyxl')
    print(f"💾 Saved to Excel: {excel_path}")
    
    print(f"\n✨ Dataset generation complete!")

if __name__ == "__main__":
    main()
