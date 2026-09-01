<div align="center">

# 🚀 VIRALYTIX

### Multimodal Machine Learning & Persona-Based Social Media Virality Prediction System

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML_Engine-FF6F00?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/SHAP-Explainability-red?style=for-the-badge)](https://shap.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **Predict how well your short-form video will perform before you publish it.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Multimodal Signal Processing](#-multimodal-signal-processing)
- [Persona Engagement Swarm Engine](#-persona-engagement-swarm-engine)
- [Machine Learning & SHAP Explainability](#-machine-learning--shap-explainability)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Local Installation & Setup](#-local-installation--setup)
- [Academic & Research Context](#-academic--research-context)
- [Build Roadmap](#-build-roadmap)
- [License](#-license)

---

## 📌 Overview

**VIRALYTIX** is an end-to-end predictive analytics framework designed for short-form video content creators, marketers, and researchers. By combining **multimodal signal processing** (visual, audio, speech) with **agentic audience persona simulations** and **gradient-boosted tree algorithms**, VIRALYTIX estimates potential view counts, virality scores, and engagement rates prior to video distribution across platforms like TikTok, Instagram Reels, and YouTube Shorts.

---

## ✨ Key Features

- **🎥 Multimodal Feature Extraction**: Extracts over 15 frame-level, audio-level, and transcript-level signals including scene transition frequency, motion vectors, acoustic energy, visual contrast, pitch variation, and speech sentiment.
- **👥 Persona-Based Swarm Simulation**: Simulates content propagation through 6 distinct synthetic target demographic personas (*Tech Enthusiasts, Students, Founders, Creators, Designers, General Viewers*) across discrete time cascade rounds.
- **🤖 Comparative ML Ensemble**: Harnesses XGBoost, Random Forest, Neural Networks, and Ridge Regression to forecast continuous virality metrics and discrete performance tier classifications.
- **🔍 SHAP Explainability**: Integrates TreeSHAP factor attribution to break down positive and negative drivers behind every prediction score.
- **⚡ AI Optimization Recommendations**: Generates tailored actionable advice (e.g., *“Increase audio pacing in seconds 0-3 to prevent student drop-off”*).
- **⚔️ A/B Comparison Dashboard**: Side-by-side comparative analysis between two video variations to identify optimal hooks and pacing.
- **🎨 Glassmorphic Interactive Dashboard**: Premium Next.js frontend featuring high-performance canvas wave simulations, interactive node swarm charts, and Recharts analytics.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (Next.js 14)"]
        UI["Dashboard / UI"]
        SingleView["Single Video Analysis"]
        ABView["A/B Comparative Mode"]
        SwarmUI["Persona Swarm Graph"]
    end

    subgraph API ["Backend Gateway (FastAPI)"]
        Router["API Router (/api)"]
        UploadHandler["File Upload & Streamer"]
    end

    subgraph Pipeline ["Processing Pipeline"]
        FFmpeg["FFmpeg Visual & Audio Signal Extractor"]
        Whisper["OpenAI Whisper Transcript Engine"]
        FeatureVector["32-Dim Multimodal Feature Vector"]
    end

    subgraph Simulation ["Swarm Engine"]
        PersonaDB[("SQLAlchemy / SQLite Persona DB")]
        CascadeSim["Persona Cascade Simulator (6 Personas)"]
    end

    subgraph ML ["Predictive Core"]
        XGBoost["XGBoost Regressor & Classifier"]
        SHAPEngine["SHAP Explainability Attribution"]
    end

    UI -->|Upload Video| UploadHandler
    UploadHandler --> FFmpeg
    UploadHandler --> Whisper
    FFmpeg & Whisper --> FeatureVector
    FeatureVector --> CascadeSim
    PersonaDB --> CascadeSim
    FeatureVector & CascadeSim --> XGBoost
    XGBoost --> SHAPEngine
    SHAPEngine --> Router
    Router -->|JSON Payload| UI
```

---

## 🌊 Multimodal Signal Processing

VIRALYTIX analyzes raw MP4 / MOV videos across three primary channels:

```mermaid
graph LR
    Video[Raw Video File] --> Visual[Visual Stream]
    Video --> Audio[Audio Stream]
    Video --> Speech[Speech Stream]

    Visual --> |Frame Sampling| V1[Brightness & Contrast]
    Visual --> |Motion Estimation| V2[Motion Vector Density]
    Visual --> |Scene Cut Detection| V3[Cut Rate per 10s]

    Audio --> |RMS Signal| A1[Acoustic Energy & Pacing]
    Audio --> |Spectral Analysis| A2[Frequency Distribution]

    Speech --> |Whisper Model| S1[Automated Transcript]
    Speech --> |VADER / NLP| S2[Sentiment & Hook Intensity]

    V1 & V2 & V3 & A1 & A2 & S1 & S2 --> Vector[Normalized 32-D Feature Tensor]
```

---

## 👥 Persona Engagement Swarm Engine

Rather than treating target audiences as static averages, VIRALYTIX runs an **agentic audience network cascade**:

| Persona | Interest Vector | Attention Span | Share Rate | Skip Threshold |
| :--- | :--- | :---: | :---: | :---: |
| **Alex (Tech Enthusiast)** | AI, ML, Startups, Code | High (0.76) | 0.71 | Low (0.21) |
| **Sam (Student)** | Education, Productivity, Fun | Medium (0.58) | 0.55 | Medium (0.35) |
| **Jordan (Founder)** | SaaS, Business, Growth | High (0.62) | 0.48 | Medium (0.38) |
| **Casey (Creator)** | Content, Trends, Video | High (0.70) | 0.82 | Low (0.28) |
| **Morgan (Designer)** | UI/UX, Aesthetics, Tools | High (0.67) | 0.60 | Low (0.30) |
| **Riley (General Viewer)** | Entertainment, General | Low (0.45) | 0.22 | High (0.58) |

$$\text{Engagement Score} = w_1 \cdot \text{Similarity}(\vec{I}_{\text{persona}}, \vec{V}_{\text{content}}) + w_2 \cdot \text{Pacing} - w_3 \cdot \text{SkipProb}$$

---

## 🤖 Machine Learning & SHAP Explainability

### Model Performance Metrics

| Model | $R^2$ Score | MAE | RMSE | Status |
| :--- | :---: | :---: | :---: | :---: |
| **XGBoost Regressor** *(Selected)* | **0.912** | **3.42** | **4.81** | 🟢 Active Production |
| **Random Forest** | 0.884 | 4.15 | 5.62 | 🟡 Fallback |
| **Neural Network (MLP)** | 0.865 | 4.88 | 6.20 | 🟡 Evaluated |
| **Linear Regression** | 0.710 | 7.95 | 9.44 | 🔴 Baseline |

### Feature Attribution Breakdown (SHAP)

```
[+] Hook Density (0-3s)     ████████████████████ (+18.4 pts)
[+] Audio Pacing Signal     █████████████ (+12.1 pts)
[+] Visual Motion Density   █████████ (+8.5 pts)
[-] Long Silence Duration   ████████ (-7.2 pts)
[-] Low Resolution Contrast █████ (-4.1 pts)
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lenis Smooth Scroll |
| **Backend API** | Python 3.10+, FastAPI, Pydantic v2, Uvicorn, SQLAlchemy |
| **Database** | SQLite (Development) / PostgreSQL (Production) |
| **ML & Data Science** | XGBoost, Scikit-Learn, NumPy, Pandas, SHAP |
| **Media Processing** | FFmpeg, OpenAI Whisper, OpenCV |

---

## 📂 Project Structure

```
viralytix/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Endpoints (videos, predictions, simulations)
│   │   ├── database/         # Database models, connection & seed data
│   │   ├── ml/               # Inference & SHAP explanation modules
│   │   ├── models/           # Pre-trained ML artifacts (.pkl)
│   │   ├── services/         # Multimodal extraction & simulation engines
│   │   ├── config.py         # App configuration settings
│   │   └── main.py           # FastAPI entrypoint
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
├── frontend/                 # Next.js Application
│   ├── app/                  # Next.js App Router (pages, layout, globals.css)
│   ├── public/               # Static assets & icons
│   ├── package.json          # Dependencies & npm scripts
│   ├── tailwind.config.ts    # Tailwind styling config
│   └── tsconfig.json         # TypeScript configuration
├── ml/                       # Machine Learning Pipeline
│   ├── datasets/             # Synthetic & real engagement datasets
│   ├── notebooks/            # Jupyter Notebooks (EDA, Training, Validation)
│   └── experiments/          # Model comparison logs
└── docs/                     # Documentation & Architecture specs
```

---

## 🔌 API Endpoints

### Core Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and documentation index |
| `GET` | `/health` | Server health check |
| `POST` | `/api/videos/upload` | Upload video file for extraction |
| `POST` | `/api/predictions/predict` | Run XGBoost model prediction & SHAP explainability |
| `POST` | `/api/simulations/run` | Execute persona swarm engagement simulation |
| `GET` | `/api/simulations/personas` | Retrieve seeded audience personas |

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Python** $\ge 3.10$
- **Node.js** $\ge 18.0.0$
- **FFmpeg** installed on PATH

### 1. Clone & Setup Backend

```bash
cd viralytix/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# Activate virtual environment (macOS/Linux)
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI backend
uvicorn app.main:app --reload --port 8000
```
> Backend running at: `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`)

### 2. Setup Frontend

```bash
cd viralytix/frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
> Frontend running at: `http://localhost:3000`

---

## 🎓 Academic & Research Context

- **Course**: Predictive Analytics / Machine Learning
- **Author**: Prabhu Shankar Mund (Raj)
- **Institution**: Centurion University of Technology and Management, Odisha, India
- **Research Question**: *"Can multimodal feature extraction coupled with agentic audience persona simulation yield accurate pre-distribution virality predictions for short-form video content?"*

---

## 📊 Build Roadmap

| Phase | Feature Module | Status |
| :---: | :--- | :---: |
| **01** | Core FastAPI & Next.js Skeleton | ✅ Completed |
| **02** | FFmpeg Video & Audio Pipeline | ✅ Completed |
| **03** | Visual & Acoustic Feature Extractor | ✅ Completed |
| **04** | Dataset Generation & Model Training | ✅ Completed |
| **05** | Persona Simulation Engine | ✅ Completed |
| **06** | XGBoost Prediction API Integration | ✅ Completed |
| **07** | SHAP Factor Explainability & Recommendations | ✅ Completed |
| **08** | Glassmorphism Dashboard UI Rebuild | ✅ Completed |
| **09** | A/B Video Testing Mode | ✅ Completed |
| **10** | Cloud Production Deployment | ⬜ Pending |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

<div align="center">
  <sub>Built with ❤️ by Prabhu Shankar Mund (Raj) for Centurion University of Technology and Management</sub>
</div>

