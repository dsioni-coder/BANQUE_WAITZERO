# Utilisation d'une image Python légère et officielle
FROM python:3.12-slim

# Définition des variables d'environnement pour Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Installation des dépendances système nécessaires pour PostgreSQL
RUN apt-get update \
    && apt-get install -y libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Copie du fichier des dépendances et installation
COPY requirements.txt /app/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copie de tout le code source dans le conteneur 
COPY . /app/

# Commande par défaut (qui lance le serveur Django)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]