"""
ElectroWizard - Restoration Priority Algorithm
Intelligent prioritization for power restoration
"""

import pandas as pd
from typing import List, Dict
from datetime import datetime, timedelta

class RestorationPrioritizer:
    """Smart prioritization system for power restoration"""
    
    # Priority weights
    PRIORITY_WEIGHTS = {
        'hospital': 1000,
        'industry': 500,
        'school': 300,
        'residential': 100,
        'atm': 50
    }
    
    # Duration multipliers
    DURATION_MULTIPLIERS = {
        'critical': 3.0,  # > 6 hours
        'high': 2.0,      # 3-6 hours
        'medium': 1.5,    # 1-3 hours
        'low': 1.0        # < 1 hour
    }
    
    def __init__(self):
        self.restoration_queue = []
    
    def calculate_priority_score(self, zone_data: Dict) -> float:
        """Calculate priority score for a zone"""
        score = 0
        
        # Critical facilities impact
        score += zone_data.get('hospital_count', 0) * self.PRIORITY_WEIGHTS['hospital']
        score += zone_data.get('industry_count', 0) * self.PRIORITY_WEIGHTS['industry']
        score += zone_data.get('school_count', 0) * self.PRIORITY_WEIGHTS['school']
        score += zone_data.get('atm_count', 0) * self.PRIORITY_WEIGHTS['atm']
        
        # Population impact
        population_density = zone_data.get('population_density', 0)
        score += (population_density / 100) * self.PRIORITY_WEIGHTS['residential']
        
        # Duration multiplier
        duration = zone_data.get('outage_duration_hours', 0)
        if duration > 6:
            duration_mult = self.DURATION_MULTIPLIERS['critical']
        elif duration > 3:
            duration_mult = self.DURATION_MULTIPLIERS['high']
        elif duration > 1:
            duration_mult = self.DURATION_MULTIPLIERS['medium']
        else:
            duration_mult = self.DURATION_MULTIPLIERS['low']
        
        score *= duration_mult
        
        # Peak hour bonus
        if zone_data.get('is_peak_hour', 0) == 1:
            score *= 1.5
        
        # Impact score from ML model
        impact_score = zone_data.get('impact_score', 0)
        score += impact_score * 10
        
        return score
    
    def prioritize_zones(self, zones_data: List[Dict]) -> List[Dict]:
        """Prioritize zones for restoration"""
        prioritized = []
        
        for zone in zones_data:
            priority_score = self.calculate_priority_score(zone)
            
            # Determine priority category based on risk level and facilities
            risk_level = zone.get('risk_level', 'Low')
            
            # Use risk level as primary factor for balanced distribution
            if risk_level == 'Critical' or zone.get('hospital_count', 0) >= 10:
                category = 'Critical - Healthcare'
                priority_level = 1
            elif risk_level == 'High' or zone.get('industry_count', 0) >= 8:
                category = 'High - Industrial'
                priority_level = 2
            elif risk_level == 'Medium' or zone.get('school_count', 0) >= 15:
                category = 'Medium - Educational'
                priority_level = 3
            else:
                category = 'Standard - Residential'
                priority_level = 4
            
            prioritized.append({
                **zone,
                'priority_score': round(priority_score, 2),
                'priority_category': category,
                'priority_level': priority_level
            })
        
        # Sort by priority score (descending)
        prioritized.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return prioritized
    
    def generate_restoration_plan(self, prioritized_zones: List[Dict], 
                                 available_crews: int = 5) -> Dict:
        """Generate detailed restoration plan"""
        
        # Group zones by priority level
        critical_zones = [z for z in prioritized_zones if z['priority_level'] == 1]
        high_zones = [z for z in prioritized_zones if z['priority_level'] == 2]
        medium_zones = [z for z in prioritized_zones if z['priority_level'] == 3]
        standard_zones = [z for z in prioritized_zones if z['priority_level'] == 4]
        
        # Estimate restoration time (assuming 1 hour per crew per zone)
        def estimate_completion_time(zones_list, start_hour):
            if not zones_list:
                return start_hour
            batches = len(zones_list) // available_crews + (1 if len(zones_list) % available_crews else 0)
            return start_hour + batches
        
        current_time = 0
        critical_complete = estimate_completion_time(critical_zones, current_time)
        high_complete = estimate_completion_time(high_zones, critical_complete)
        medium_complete = estimate_completion_time(medium_zones, high_complete)
        standard_complete = estimate_completion_time(standard_zones, medium_complete)
        
        plan = {
            'total_zones': len(prioritized_zones),
            'available_crews': available_crews,
            'estimated_total_hours': standard_complete,
            'phases': [
                {
                    'phase': 'Phase 1 - Critical (Healthcare)',
                    'zone_count': len(critical_zones),
                    'estimated_hours': critical_complete,
                    'zones': critical_zones[:10]  # Top 10 for display
                },
                {
                    'phase': 'Phase 2 - High Priority (Industrial)',
                    'zone_count': len(high_zones),
                    'estimated_hours': high_complete - critical_complete,
                    'zones': high_zones[:10]
                },
                {
                    'phase': 'Phase 3 - Medium Priority (Educational)',
                    'zone_count': len(medium_zones),
                    'estimated_hours': medium_complete - high_complete,
                    'zones': medium_zones[:10]
                },
                {
                    'phase': 'Phase 4 - Standard (Residential)',
                    'zone_count': len(standard_zones),
                    'estimated_hours': standard_complete - medium_complete,
                    'zones': standard_zones[:10]
                }
            ],
            'recommendations': self._generate_recommendations(
                critical_zones, high_zones, available_crews
            )
        }
        
        return plan
    
    def _generate_recommendations(self, critical_zones, high_zones, crews):
        """Generate actionable recommendations"""
        recommendations = []
        
        if len(critical_zones) > crews:
            recommendations.append({
                'type': 'urgent',
                'message': f'⚠️ {len(critical_zones)} critical healthcare zones affected. Consider deploying additional crews.',
                'action': f'Request {len(critical_zones) - crews} additional emergency crews'
            })
        
        if len(critical_zones) > 0:
            recommendations.append({
                'type': 'priority',
                'message': f'🏥 {len(critical_zones)} hospitals without power. Immediate action required.',
                'action': 'Deploy all available crews to healthcare facilities first'
            })
        
        if len(high_zones) > 10:
            recommendations.append({
                'type': 'economic',
                'message': f'🏭 {len(high_zones)} industrial zones affected. Significant economic impact expected.',
                'action': 'Coordinate with industrial liaison for backup power arrangements'
            })
        
        recommendations.append({
            'type': 'communication',
            'message': '📢 Maintain regular communication with affected areas',
            'action': 'Send SMS/alerts with estimated restoration times'
        })
        
        return recommendations
    
    def get_zone_eta(self, zone_id: str, prioritized_zones: List[Dict], 
                     available_crews: int = 5) -> Dict:
        """Get estimated restoration time for a specific zone"""
        
        # Find zone position in queue
        zone_index = next((i for i, z in enumerate(prioritized_zones) 
                          if z.get('zone_id') == zone_id), None)
        
        if zone_index is None:
            return {'error': 'Zone not found'}
        
        zone = prioritized_zones[zone_index]
        
        # Calculate ETA based on position
        batch_number = zone_index // available_crews + 1
        eta_hours = batch_number
        
        return {
            'zone_id': zone_id,
            'position_in_queue': zone_index + 1,
            'priority_category': zone['priority_category'],
            'estimated_hours': eta_hours,
            'estimated_completion': f"{eta_hours} hours from restoration start",
            'priority_score': zone['priority_score']
        }

# Initialize global prioritizer
prioritizer = RestorationPrioritizer()
