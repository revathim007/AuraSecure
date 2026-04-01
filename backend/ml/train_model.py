import os
import sys
import django
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import joblib

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import SensorData1Tbl

def train_model():
    # Fetch data from the database
    data = SensorData1Tbl.objects.all()
    df = pd.DataFrame(list(data.values()))

    # Define alarm and warning conditions
    alarm_conditions = (
        (df['gas_level'] > 250) | 
        (df['smoke_level'] > 15) | 
        (df['temperature'] > 90)
    )
    
    warning_conditions = (
        (df['gas_level'] > 200) | 
        (df['smoke_level'] > 10) | 
        (df['temperature'] > 75)
    ) & ~alarm_conditions

    # Create a 3-level target variable
    df['alarm_level'] = np.select(
        [alarm_conditions, warning_conditions],
        [2, 1], # 2 for Alarm, 1 for Warning
        default=0 # 0 for Safe
    )

    # Select features and target
    features = ['gas_level', 'smoke_level', 'temperature']
    target = 'alarm_level'

    X = df[features]
    y = df[target]

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Initialize and train the Gradient Boosting model
    model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    print(f'Model Accuracy: {accuracy_score(y_test, y_pred)}')

    # Save the trained model
    joblib.dump(model, 'ml/gradient_boosting_model.joblib')

if __name__ == '__main__':
    train_model()
