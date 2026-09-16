"""
VIRALYTIX — ML Model Training Pipeline (Phase 4)
Generates synthetic short-form dataset and trains XGBoost regressor and classifier models.
"""
import os
import random
import numpy as np
import pandas as pd
import joblib
from xgboost import XGBRegressor, XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score, classification_report

FEATURES_LIST = [
    "hook_score", "scene_change_rate", "avg_brightness", "motion_score", 
    "text_density", "speech_rate", "silence_ratio", "audio_energy", 
    "word_count", "cta_score", "question_present",
    "completion_rate", "watch_rate", "like_rate", "share_rate", "comment_rate"
]

def generate_dataset(num_records=5000):
    """
    Generates a realistic synthetic dataset modeling TikTok/Instagram Reels virality.
    """
    print(f"Generating {num_records} synthetic video records...")
    
    data = []
    
    for i in range(num_records):
        duration = random.uniform(7.0, 90.0)
        
        # Single latent quality factor to drive correlation and wide variance
        quality = random.uniform(0.0, 1.0)
        
        # 1. Visual features
        avg_brightness = max(0.05, min(1.0, quality * 0.7 + random.uniform(0.05, 0.25)))
        motion_score = max(0.01, min(1.0, quality * 0.65 + random.uniform(0.02, 0.25)))
        scene_change_rate = max(0.0, min(4.0, quality * 3.2 + random.uniform(0.0, 0.5)))
        text_density = random.uniform(0.02, 0.9)
        
        # 2. Audio features
        audio_energy = max(0.001, min(1.0, quality * 0.7 + random.uniform(0.01, 0.2)))
        silence_ratio = max(0.02, min(0.75, 0.55 - (quality * 0.5) + random.uniform(-0.05, 0.05)))
        
        speech_rate = 135.0 + random.uniform(-45, 45)
        word_count = int(speech_rate * (duration / 60) * (1 - silence_ratio))
        
        # 3. Text features
        cta_score = random.uniform(0.1, 0.95)
        question_present = int(random.random() > 0.50)
        
        # Derive Hook Score based on quality
        hook_score = quality * 70.0 + 20.0 + random.uniform(-10.0, 10.0)
        hook_score = max(20.0, min(100.0, hook_score))
        
        # 4. Simulation aggregates
        completion_rate = quality * 0.75 + 0.10 + random.uniform(-0.10, 0.10)
        completion_rate = max(0.02, min(0.95, completion_rate))
        
        watch_rate = completion_rate * 1.1 + random.uniform(-0.05, 0.05)
        watch_rate = max(completion_rate, min(0.95, watch_rate))
        
        like_rate = completion_rate * 0.4 + random.uniform(-0.05, 0.05)
        like_rate = max(0.005, min(0.65, like_rate))
        
        share_rate = completion_rate * 0.15 + cta_score * 0.1 + random.uniform(-0.02, 0.02)
        share_rate = max(0.002, min(0.40, share_rate))
        
        comment_rate = completion_rate * 0.08 + question_present * 0.05 + random.uniform(-0.01, 0.01)
        comment_rate = max(0.001, min(0.30, comment_rate))
        
        # 5. Continuous Virality Score (0-100)
        virality_score = quality * 75.0 + 15.0 + random.uniform(-8.0, 8.0)
        virality_score = round(max(0.0, min(100.0, virality_score)), 1)
        
        # 6. Categorical Target Performance Category (Low=0, Medium=1, High=2)
        if virality_score >= 65.0:
            performance_cat = 2  # High
        elif virality_score >= 35.0:
            performance_cat = 1  # Medium
        else:
            performance_cat = 0  # Low
            
        data.append([
            hook_score, scene_change_rate, avg_brightness, motion_score,
            text_density, speech_rate, silence_ratio, audio_energy,
            word_count, cta_score, question_present,
            completion_rate, watch_rate, like_rate, share_rate, comment_rate,
            virality_score, performance_cat
        ])
        
    cols = FEATURES_LIST + ["target_score", "target_category"]
    df = pd.DataFrame(data, columns=cols)
    return df

def train_and_save():
    # 1. Dataset Generation
    df = generate_dataset()
    print("Dataset target category distribution:")
    print(df["target_category"].value_counts())
    
    X = df[FEATURES_LIST]
    y_reg = df["target_score"]
    y_clf = df["target_category"]
    
    # 2. Split Regressor Data
    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
        X, y_reg, test_size=0.2, random_state=42
    )
    
    # 3. Train Regressor
    print("\nTraining XGBRegressor on continuous virality score...")
    regressor = XGBRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    regressor.fit(X_train_r, y_train_r)
    
    # Evaluate Regressor
    y_pred_r = regressor.predict(X_test_r)
    mae = mean_absolute_error(y_test_r, y_pred_r)
    r2 = r2_score(y_test_r, y_pred_r)
    print(f"  Regressor Mean Absolute Error: {mae:.2f}")
    print(f"  Regressor R2 Score:            {r2:.4f}")
    
    # 4. Split Classifier Data
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
        X, y_clf, test_size=0.2, random_state=42
    )
    
    # 5. Train Classifier
    print("\nTraining XGBClassifier on performance category...")
    classifier = XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    classifier.fit(X_train_c, y_train_c)
    
    # Evaluate Classifier
    y_pred_c = classifier.predict(X_test_c)
    acc = accuracy_score(y_test_c, y_pred_c)
    print(f"  Classifier Accuracy: {acc:.4%}")
    print("\nClassification Report:")
    print(classification_report(y_test_c, y_pred_c, target_names=["Low", "Medium", "High"]))
    
    # 6. Save models
    models_dir = "./app/models"
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "viral_model.pkl")
    clf_path = os.path.join(models_dir, "viral_classifier.pkl")
    
    print(f"\nSaving model files to {models_dir}...")
    joblib.dump(regressor, model_path)
    joblib.dump(classifier, clf_path)
    print("[OK] Models saved successfully.")

if __name__ == "__main__":
    train_and_save()
