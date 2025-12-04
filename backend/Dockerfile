FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema para MySQL
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código
COPY . .

# Exponer puerto
EXPOSE 8000

# Iniciar FastAPI - SIN el prefijo "app." porque main.py está en la raíz
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]