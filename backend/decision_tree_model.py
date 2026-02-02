from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib

class DecisionTreeModel:
    """
    Explainable AI Model for Power Grid Risk Classification
    """
    def __init__(self):
        # Initialize Decision Tree with specific hyperparameters for interpretability
        self.model = DecisionTreeClassifier(
            max_depth=8,              # Limit depth to prevent overfitting
            min_samples_split=10,     # Ensure sufficient samples per split
            random_state=42           # Reproducibility
        )
        
    def train(self, X_train, y_train):
        """Train the Decision Tree Classifier"""
        print("Training Decision Tree...")
        self.model.fit(X_train, y_train)
        print("Training Complete.")
        
    def predict(self, X_test):
        """Make predictions"""
        return self.model.predict(X_test)
    
    def evaluate(self, X_test, y_test):
        """Evaluate accuracy"""
        predictions = self.predict(X_test)
        return accuracy_score(y_test, predictions)
    
    def save(self, path='models/dt_classifier.pkl'):
        """Save model artifact"""
        joblib.dump(self.model, path)
