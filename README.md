# DataSwift Platform

## Overview
DataSwift is a comprehensive data science platform for data upload, EDA, transformation, modeling, and deployment—all in one place.

## Key Features
- **Data Upload & Connections:** Import data from files, APIs, or databases.
- **Automated EDA:** Run exploratory data analysis with AI-powered insights.
- **Data Transformation:**
  - Feature engineering (e.g., polynomial features)
  - Encoding (one-hot, label encoding)
  - Scaling (normalization, standardization)
  - Export transformed datasets
  - **Train-Test Split:** Easily split your data for robust model evaluation and download train/test sets
- **ModelLab:**
  - Configure, train, and compare machine learning models
  - Use the split training set for all modeling steps
  - Deploy models with one click
- **Model Testing:** Evaluate deployed models with new data
- **Activity History:**
  - Track all actions, including data transformation and train-test split
  - Filter and export your activity log

## How to Use This Website

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd DataSwift
```

### 2. Install Dependencies
Make sure you have [pnpm](https://pnpm.io/) and Python 3.9+ installed.
```sh
pnpm install
```
This will install dependencies for both the `frontend` and `backend` workspaces.

### 3. Run the Backend
Navigate to the backend directory and install Python dependencies:
```sh
cd backend
pip install -r requirements.txt
```
Start the FastAPI backend:
```sh
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 4. Run the Frontend
Open a new terminal, then:
```sh
cd frontend
pnpm dev
```
This will start the Next.js frontend on [http://localhost:3000](http://localhost:3000).

### 5. Access the App
- Go to [http://localhost:3000](http://localhost:3000) in your browser.
- The frontend will connect to the backend at [http://localhost:8000](http://localhost:8000).

### 6. Workflow Highlights
- **Data Upload:** Upload your datasets in the Data section.
- **EDA:** Explore your data with automated EDA.
- **Data Transformation:** Use feature engineering, encoding, scaling, and train-test split tools.
- **ModelLab:** Build, train, and compare models (uses the split training set).
- **Model Testing:** Evaluate deployed models.
- **Activity History:** Track all actions, including data transformation and splits.

### 7. Documentation
See the in-app Knowledge Hub for detailed guides on every feature.

---
For questions or support, please refer to the in-app help or contact the DataSwift team.
