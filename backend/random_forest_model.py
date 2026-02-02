from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

class RandomForestModel:
    """
    Robust Ensemble Model for Risk Level Classification
    """
    def __init__(self):
        # Initialize Random Forest with 150 trees
        self.model = RandomForestClassifier(
            n_estimators=150,         # Number of trees in the forest
            max_depth=10,             # Max depth of each tree
            min_samples_split=5,      # Min samples to split a node
            random_state=42,          # Reproducibility
            n_jobs=-1                 # Use all CPU cores
        )
        
    def train(self, X_train, y_train):
        """Train the Random Forest Classifier"""
        print("Training Random Forest...")
        self.model.fit(X_train, y_train)
        print("Training Complete.")
        
    def predict(self, X_test):
        """Make predictions"""
        return self.model.predict(X_test)
    
    def predict_proba(self, X):
        """Get probability scores for risk levels"""
        return self.model.predict_proba(X)
    
    def evaluate(self, X_test, y_test):
        """Evaluate accuracy"""
        predictions = self.predict(X_test)
        return accuracy_score(y_test, predictions)
    
    def save(self, path='models/rf_classifier.pkl'):
        """Save model artifact"""
        joblib.dump(self.model, path)
