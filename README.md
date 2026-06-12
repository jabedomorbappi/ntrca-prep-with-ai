# 🚀 ExamForge: The Ultimate NTRCA Prep Platform

**ExamForge** is a full-stack, containerized learning management system designed to help candidates prepare for the NTRCA (Non-Government Teachers Registration & Certification Authority) examination.

---

## 🎯 Project Functionality
The core mission of ExamForge is to provide an interactive, data-driven environment for exam preparation:
* **Structured Learning:** Subjects are broken down into topics and subtopics for focused study.
* **Adaptive Testing:** Users can generate mock exams based on specific subjects/subtopics.
* **Performance Analytics:** Tracks exam history, calculates scores, and provides review capabilities for past attempts.
* **Authentication & Security:** Secure user portals for tracking personal progress and historical performance.

---

## 🛠 Tech Stack
We utilize a modern, robust architecture to ensure scalability:

### Frontend
* **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
* **UI Library:** [Bootstrap](https://getbootstrap.com/) for a responsive, clean design.
* **State Management:** React Context API for authentication and exam state.
* **Routing:** React Router v6.

### Backend
* **Framework:** [Django](https://www.djangoproject.com/) (Python)
* **API Framework:** [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
* **Database:** PostgreSQL (Production standard).

### DevOps
* **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
* **Web Server:** Nginx (for serving the React build).

---

## 🔌 API Documentation
ExamForge utilizes a RESTful API architecture. Key endpoints include:
* `/api/auth/`: Handles registration, login, and token-based authentication.
* `/api/study/`: Fetches subject, topic, and subtopic hierarchies.
* `/api/exam/`: Manages exam generation, question retrieval, and submission.
* `/api/user/`: Manages profile data and individual exam history.

---

## 🏗 Setup & Installation
### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Deployment Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/john/ntrca-prep.git
   cd ntrca-prep