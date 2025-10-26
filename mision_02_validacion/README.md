# Bestiario Digital - Misión 2: El Cronista de Datos NoSQL

## Descripción del Proyecto

Esta misión implementa un sistema de gestión de criaturas fantásticas y sus guardianes utilizando MongoDB. El proyecto explora conceptos avanzados de bases de datos NoSQL, incluyendo validación con JSON Schema, modelado de relaciones embebidas y referenciadas, y análisis comparativo de diferentes tipos de bases de datos.

**Autor:** Guerra Jennifer  
**Fecha:** 26 de octubre, 2025  
**Base de Datos:** MongoDB (bestiario)

---

## Estructura del Proyecto

### Fase 1: Definición de Colecciones

#### `01_definicion_guardianes.mongodb`
Define la colección `guardianes` con validación JSON Schema que incluye:
- Campos requeridos: `nombre`, `rango`, `password_acceso`, `inventario`
- Validación de `rango` con valores enum: "Aprendiz", "Maestro", "Gran Maestro"
- Validación de `password_acceso` con regex (mínimo 8 caracteres, una mayúscula, un número)
- Validación de `nivel` entre 1 y 99
- Relación 1-a-N embebida: `inventario` (array de items con nombre y cantidad)

#### `02_definicion_criaturas.mongodb`
Define la colección `criaturas` con validación JSON Schema que incluye:
- Campos requeridos: `nombre`, `habitat`, `nivel_peligro`, `es_legendaria`, `habilidades`, `ficha_veterinaria`, `id_guardian`
- Validación de `nivel_peligro` entre 1 y 10
- Validación de `habilidades` como array con mínimo 1 elemento string único
- Relación 1-a-1 embebida: `ficha_veterinaria` (objeto con `salud` y `ultima_revision`)
- Relación 1-a-N referenciada: `id_guardian` (ObjectId que referencia a guardianes)

### Fase 2: Pruebas de Validación

#### `03_pruebas_insercion.mongodb`
Contiene pruebas de integridad de datos:
- **Prueba 1:** Inserción válida de guardián (cumple todas las reglas)
- **Prueba 2:** Inserción inválida de guardián (captura error de validación)
- **Prueba 3:** Inserción válida de criatura (vinculada a guardián válido)
- **Prueba 4:** Inserción inválida de criatura (captura error de validación)
- Verificación final de documentos insertados correctamente

Cada prueba inválida incluye el mensaje de error completo devuelto por MongoDB como comentario.

### Fase 3: Análisis Teórico

#### `ANALISIS_VALIDACION.md`
Documento de análisis que responde:
1. **Validación a nivel de BD vs. Backend:** Justificación de por qué JSON Schema es preferible
2. **Relación 1-a-1 embebida:** Análisis de la ficha veterinaria y cuándo usar referencias
3. **Relaciones 1-a-N:** Comparación entre inventario embebido y criaturas referenciadas

---

## Modelo de Datos

### Colección: guardianes

```javascript
{
  _id: ObjectId,
  nombre: String,
  rango: String (enum: "Aprendiz" | "Maestro" | "Gran Maestro"),
  password_acceso: String (regex: min 8 chars, 1 mayúscula, 1 número),
  nivel: Number (1-99),
  inventario: [
    {
      nombre_item: String,
      cantidad: Number (>=1)
    }
  ]
}
```

### Colección: criaturas

```javascript
{
  _id: ObjectId,
  nombre: String,
  habitat: String,
  nivel_peligro: Number (1-10),
  es_legendaria: Boolean,
  habilidades: [String] (min 1 elemento, únicos),
  ficha_veterinaria: {
    salud: String (enum: "Óptima" | "Regular" | "Crítica"),
    ultima_revision: Date
  },
  id_guardian: ObjectId (referencia a guardianes)
}
```

---

## Tipos de Relaciones Implementadas

### 1. Relación 1-a-1 Embebida
**Criatura → Ficha Veterinaria**
- Cada criatura tiene exactamente una ficha veterinaria
- Embebida porque siempre se consulta junto con la criatura
- Tamaño pequeño y predecible

### 2. Relación 1-a-N Embebida
**Guardián → Inventario**
- Un guardián puede tener múltiples items (0-50)
- Embebida porque cardinalidad limitada y alta cohesión
- Requiere operaciones atómicas para gameplay

### 3. Relación 1-a-N Referenciada
**Guardián → Criaturas**
- Un guardián puede tener muchas criaturas (0-∞)
- Referenciada porque cardinalidad ilimitada
- Criaturas se consultan independientemente del guardián

---

## Cómo Ejecutar

### Prerrequisitos
- MongoDB instalado y corriendo
- MongoDB for VS Code extension (opcional pero recomendado)
- Conexión a base de datos `bestiario`

### Pasos de Ejecución

1. **Crear las colecciones con validación:**
```bash
# Ejecutar en orden:
mongosh < 01_definicion_guardianes.mongodb
mongosh < 02_definicion_criaturas.mongodb
```

2. **Ejecutar pruebas de inserción:**
```bash
mongosh < 03_pruebas_insercion.mongodb
```

3. **Verificar resultados:**
```javascript
use bestiario;

// Ver guardianes válidos
db.guardianes.find().pretty();

// Ver criaturas válidas
db.criaturas.find().pretty();

// Verificar validaciones activas
db.getCollectionInfos({name: "guardianes"})[0].options.validator;
db.getCollectionInfos({name: "criaturas"})[0].options.validator;
```

### Usando VS Code

1. Abrir cada archivo `.mongodb`
2. Presionar el botón Ejecutar o `Ctrl+Alt+N`
3. Verificar resultados en el panel "Output"

---

## Validaciones Implementadas

### Guardianes
- Password seguro: `^(?=.*[A-Z])(?=.*\d).{8,}$`
- Rango restringido a 3 valores específicos
- Nivel numérico entre 1-99
- Inventario con items que tienen cantidad >= 1

### Criaturas
- Nivel de peligro entre 1-10
- Array de habilidades no vacío con elementos únicos
- Ficha veterinaria con estado de salud validado (3 opciones)
- Fecha de última revisión como tipo Date
- ID de guardián como ObjectId válido

---

## Conceptos Clave Demostrados

1. **JSON Schema Validation:** Reglas de integridad a nivel de base de datos
2. **Modelado de Relaciones NoSQL:** Estrategias embebidas vs. referenciadas
3. **Atomicidad:** Operaciones garantizadas a nivel de documento
4. **Tipos BSON:** Validación nativa de ObjectId, Date, Number, etc.
5. **Patrones de Diseño:** Cohesión de datos y patrones de acceso

---

## Resultados Esperados

### Inserciones Válidas
- 1 guardián: "Aria Luminis" (Gran Maestro, nivel 45)
- 1 criatura: "Fénix Dorado" (legendaria, nivel peligro 9)

### Inserciones Inválidas (con errores capturados)
- 1 guardián con rango "Novato" y password "corta1"
- 1 criatura con habilidades vacías y sin campo salud en ficha

---

## Referencias

- MongoDB JSON Schema Validation: https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema

- BSON Types: https://www.mongodb.com/docs/manual/reference/bson-types

---

## Notas Adicionales

Este proyecto es parte del curso de Bases de Datos NoSQL y demuestra la comprensión práctica de:
- Diseño de esquemas flexibles en MongoDB
- Validación robusta de datos
- Estrategias de modelado según patrones de uso
- Comparación entre diferentes enfoques de bases de datos (SQL vs. NoSQL, Documentos vs. Grafos)