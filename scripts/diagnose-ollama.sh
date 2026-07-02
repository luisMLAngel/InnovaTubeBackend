#!/bin/bash

echo "🔍 Diagnóstico de Ollama"
echo "========================"
echo ""

# 1. Verificar que el contenedor está corriendo
echo "1. Estado del contenedor Ollama:"
docker ps --filter "name=waflow-ollama" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# 2. Verificar conectividad desde el host
echo "2. Conectividad desde el host (localhost:11434):"
if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
    echo "✅ Ollama accesible desde el host"
    curl -s http://localhost:11434/api/version | head -n 5
else
    echo "❌ No se puede conectar a Ollama desde el host"
fi
echo ""

# 3. Verificar conectividad desde el contenedor de app
echo "3. Conectividad desde el contenedor app (ollama:11434):"
docker exec waflow-backend-app-1 sh -c "curl -s http://ollama:11434/api/version" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Ollama accesible desde el contenedor app"
    docker exec waflow-backend-app-1 sh -c "curl -s http://ollama:11434/api/version" | head -n 5
else
    echo "❌ No se puede conectar a Ollama desde el contenedor app"
fi
echo ""

# 4. Listar modelos descargados
echo "4. Modelos de Ollama descargados:"
docker exec waflow-ollama ollama list
echo ""

# 5. Probar generación simple
echo "5. Prueba de generación (esto puede tardar la primera vez):"
echo "Enviando prompt de prueba..."
RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "prompt": "Di solo: hola",
    "stream": false,
    "options": {
      "num_predict": 5
    }
  }' 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Respuesta recibida"
    echo "$RESPONSE" | head -n 10
else
    echo "❌ Error en la generación"
    echo "$RESPONSE"
fi
echo ""

# 6. Verificar variables de entorno en app
echo "6. Variables de entorno en contenedor app:"
docker exec waflow-backend-app-1 sh -c "echo OLLAMA_URL=\$OLLAMA_URL && echo OLLAMA_MODEL=\$OLLAMA_MODEL"
echo ""

echo "========================"
echo "Diagnóstico completado"
