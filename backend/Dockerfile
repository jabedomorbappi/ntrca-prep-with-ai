# 1. Base Image: We use Python 3.12 (a stable version)
FROM python:3.12-slim

# 2. Prevent Python from writing .pyc files and buffering output (better for debugging)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Install system dependencies (e.g., for database connections)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your project code
COPY . .

# 7. Expose the port Django runs on
EXPOSE 8000

# 8. Command to start the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]