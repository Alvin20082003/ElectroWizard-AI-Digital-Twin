from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

class KMeansCluster:
    """
    Unsupervised Learning for Zone Pattern Recognition
    """
    def __init__(self, n_clusters=5):
        # Initialize K-Means with 5 clusters
        self.model = KMeans(
            n_clusters=n_clusters,
            random_state=42,
            n_init=10
        )
        self.scaler = StandardScaler()
        
    def train(self, X_train):
        """Train K-Means on features"""
        print("Training K-Means Clustering...")
        # Scale features first
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled)
        print("Training Complete.")
        
    def predict_cluster(self, X):
        """Assign cluster to new data"""
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
    
    def save(self, model_path='models/kmeans_model.pkl', scaler_path='models/scaler.pkl'):
        """Save model and scaler"""
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
