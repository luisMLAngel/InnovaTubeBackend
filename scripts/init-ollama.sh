#!/bin/bash

# Script para inicializar Ollama y descargar el modelo Mistral
# Este script debe ejecutarse después de que Ollama esté corriendo

echo "🤖 Esperando a que Ollama esté listo..."

# Esperar a que Ollama esté disponible
max_attempts=30
attempt=0
until curl -s http://ollama:11434/api/version > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Error: Ollama no está disponible después de $max_attempts intentos"
    exit 1
  fi
  echo "Esperando a Ollama... intento $attempt/$max_attempts"
  sleep 2
done

echo "✅ Ollama está listo"

# Verificar si el modelo ya está descargado
if curl -s http://ollama:11434/api/tags | grep -q "mistral"; then
  echo "✅ El modelo Mistral ya está descargado"
else
  echo "📥 Descargando modelo Mistral (esto puede tardar varios minutos)..."
  curl -X POST http://ollama:11434/api/pull -d '{"name": "mistral"}' || {
    echo "❌ Error al descargar el modelo"
    exit 1
  }
  echo "✅ Modelo Mistral descargado exitosamente"
fi

echo "🚀 Ollama está listo para usarse"
