# Utilisation d'une image Python allégée (standard d'entreprise pour réduire la surface d'attaque)
FROM python:3.12-slim

# Variables d'environnement pour optimiser Python dans Docker
# Empêche la création de fichiers .pyc
ENV PYTHONDONTWRITEBYTECODE=1
# Force les logs à s'afficher immédiatement dans la console (crucial pour le debugging)
ENV PYTHONUNBUFFERED=1

# Définition du répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Installation des dépendances système requises pour psycopg2 (PostgreSQL)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copie et installation des dépendances Python
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copie de l'intégralité du code source
COPY . /app/

# Le point d'entrée n'est PAS un serveur web, mais notre planificateur métier !
CMD ["python", "manage.py", "run_scheduler"]