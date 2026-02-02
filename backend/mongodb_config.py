from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

# MongoDB Connection String
MONGO_URI = "mongodb+srv://alvinofficial646_db_user:jIdaIg32j0W9G5kZ@cluster0.k4dgxgp.mongodb.net/?appName=Cluster0"
DB_NAME = "electrowizard_db"

class MongoDB:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance
    
    def connect(self):
        """Connect to MongoDB Atlas"""
        try:
            if self._client is None:
                print("🔌 Connecting to MongoDB Atlas...")
                self._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
                # Test connection
                self._client.admin.command('ping')
                self._db = self._client[DB_NAME]
                print(f"✅ Connected to MongoDB: {DB_NAME}")
                return True
        except ConnectionFailure as e:
            print(f"❌ MongoDB connection failed: {str(e)}")
            return False
    
    def get_db(self):
        """Get database instance"""
        if self._db is None:
            self.connect()
        return self._db
    
    def get_collection(self, collection_name):
        """Get collection"""
        db = self.get_db()
        return db[collection_name] if db is not None else None
    
    def close(self):
        """Close MongoDB connection"""
        if self._client:
            self._client.close()
            print("🔌 MongoDB connection closed")

# Global MongoDB instance
mongo_db = MongoDB()

def init_mongodb():
    """Initialize MongoDB and create collections"""
    if not mongo_db.connect():
        return False
    
    db = mongo_db.get_db()
    
    # Collections
    collections = {
        'zones': 'Power grid zones with risk data',
        'hospitals': 'Hospital life-support tracking',
        'simulations': 'Digital twin simulation results',
        'restoration_plans': 'AI restoration plans'
    }
    
    existing_collections = db.list_collection_names()
    
    for coll_name, description in collections.items():
        if coll_name not in existing_collections:
            db.create_collection(coll_name)
            print(f"✅ Created collection: {coll_name} ({description})")
    
    print("✅ MongoDB initialization complete!")
    return True

def seed_initial_data():
    """Seed initial data from CSV to MongoDB"""
    import pandas as pd
    
    # Load CSV data
    if not os.path.exists('chennai_power_outage_data.csv'):
        print("⚠️ CSV file not found. Skipping seed.")
        return
    
    df = pd.read_csv('chennai_power_outage_data.csv')
    
    # Encode weather
    weather_mapping = {'Clear': 0, 'Rainy': 1, 'Storm': 2, 'Hot': 3}
    if 'weather_condition' in df.columns:
        df['weather_encoded'] = df['weather_condition'].map(weather_mapping).fillna(0)
    
    # Convert to dict
    zones_data = df.to_dict('records')
    
    # Insert to MongoDB
    zones_coll = mongo_db.get_collection('zones')
    
    # Clear existing
    zones_coll.delete_many({})
    
    # Insert new
    if zones_data:
        zones_coll.insert_many(zones_data)
        print(f"✅ Seeded {len(zones_data)} zones to MongoDB")
    
    # Seed hospitals
    hospitals_data = [
        {
            "hospital_id": "GLOBAL_T",
            "name": "Global T Hospital",
            "zone_id": "T_NAGAR_Z001",
            "backup_status": "9min",
            "icu_patients": 17,
            "why_matters": "ICU patients depend on continuous power. If backup fails, oxygen systems and life-support could stop. Priority restoration required within 0 minutes."
        },
        {
            "hospital_id": "KAUVERY_T",
            "name": "Kauvery T Hospital",
            "zone_id": "T_NAGAR_Z002",
            "backup_status": "9min",
            "icu_patients": 11,
            "why_matters": "ICU patients depend on continuous power. If backup fails, oxygen systems and life-support could stop. Priority restoration required within 0 minutes."
        }
    ]
    
    hospitals_coll = mongo_db.get_collection('hospitals')
    hospitals_coll.delete_many({})
    hospitals_coll.insert_many(hospitals_data)
    print(f"✅ Seeded {len(hospitals_data)} hospitals to MongoDB")
