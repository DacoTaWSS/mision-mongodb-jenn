
## Análisis de Validación y Modelado de Relaciones
### Bestiario Digital

**Autor:** Guerra Jennifer  
**Fecha:** 26 de octubre, 2025  
**Proyecto:** Tarea 2 Individual - Fase 4

---

## 1. Validación a Nivel de Base de Datos vs. Código de Aplicación

### ¿Por qué es preferible implementar la validación con JSON Schema en MongoDB?

La validación a nivel de base de datos ofrece ventajas críticas sobre la validación únicamente en el backend:

#### Garantía de Integridad Independiente de la Aplicación

La validación en JSON Schema actúa como última línea de defensa. Si múltiples aplicaciones acceden a la base de datos (API REST, panel administrativo, scripts de migración, MongoDB Compass), todas deben cumplir las mismas reglas sin necesidad de reimplementar la validación en cada aplicación.

**Ejemplo del problema sin JSON Schema:**
```javascript
// Backend A (Node.js) - valida correctamente
if (password.length < 8) throw Error();

// Backend B (Python) - olvidan validar
db.guardianes.insert_one(data)  // Datos corruptos entran
```

**Con JSON Schema:**
MongoDB rechaza automáticamente datos inválidos desde cualquier punto de acceso, garantizando consistencia absoluta.

#### Documentación Ejecutable y Centralizada

El JSON Schema sirve como documentación viva del modelo de datos. Cualquier desarrollador puede ejecutar:

```javascript
db.getCollectionInfos({name: "guardianes"})[0].options.validator
```

Y ver exactamente qué datos son válidos, sin necesidad de buscar en múltiples archivos de código.

#### Protección Contra Bugs y Cambios Accidentales

Si un desarrollador modifica accidentalmente la validación en el backend (por ejemplo, reduce la longitud mínima de password de 8 a 6 caracteres), JSON Schema mantiene las reglas originales intactas. La base de datos actúa como contrato inmutable.

#### Validación de Tipos BSON Nativos

MongoDB maneja tipos específicos como `objectId`, `date`, `int` vs `double`. JSON Schema valida estos tipos nativamente, mientras que en código de aplicación requeriría implementación manual compleja.

**Ejemplo:**
```javascript
// JSON Schema valida ObjectId nativamente
{
  "id_guardian": {
    "bsonType": "objectId"
  }
}

// En JavaScript requeriría regex complejos o librerías externas
```

#### Atomicidad de Validación

MongoDB valida durante la operación de inserción/actualización en una transacción atómica, sin overhead adicional de red. La validación en backend requiere un round-trip adicional antes de la inserción.

### Conclusión

La mejor práctica es implementar validación en ambas capas:
- **Backend:** Para feedback rápido al usuario (experiencia de usuario)
- **Base de Datos:** Para garantizar integridad absoluta como última línea de defensa

---

## 2. Relación 1-a-1: Ficha Veterinaria Embebida

### ¿Por qué fue un buen enfoque?

La ficha veterinaria embebida fue la decisión correcta por las siguientes razones:

#### Cohesión de Datos

La ficha veterinaria siempre se consulta junto con la criatura. Cuando un usuario consulta el perfil de una criatura, necesita ver su estado de salud inmediatamente. Embeber elimina la necesidad de una segunda consulta.

```javascript
// Una sola consulta obtiene todo
db.criaturas.findOne({ nombre: "Fénix Dorado" });
// Resultado incluye ficha_veterinaria inmediatamente
```

#### Atomicidad de Operaciones

Las actualizaciones a la criatura y su ficha veterinaria deben ser atómicas. MongoDB garantiza atomicidad a nivel de documento único:

```javascript
db.criaturas.updateOne(
  { nombre: "Fénix Dorado" },
  { 
    $set: { 
      "ficha_veterinaria.salud": "Regular",
      "ficha_veterinaria.ultima_revision": new Date()
    }
  }
);
// Operación atómica garantizada
```

Si estuviera en colecciones separadas, requerirían dos operaciones no atómicas con riesgo de inconsistencia.

#### Tamaño Predecible y Pequeño

La ficha veterinaria contiene solo dos campos:
- `salud`: string (valores enum: "Óptima", "Regular", "Crítica")
- `ultima_revision`: date

Tamaño total aproximado: 20-30 bytes, insignificante comparado con el límite de 16 MB por documento de MongoDB.

#### Simplicidad de Código

Insertar una criatura con su ficha es una sola operación:

```javascript
db.criaturas.insertOne({
  nombre: "Dragón Ancestral",
  habitat: "Cavernas Profundas",
  ficha_veterinaria: {
    salud: "Óptima",
    ultima_revision: new Date()
  }
});
```

### Circunstancias para Preferir Relación Referenciada

La ficha veterinaria debería estar en colección separada si:

#### 1. Historial Médico Extenso

Si la ficha incluyera historial completo con miles de registros de consultas médicas, exámenes y tratamientos que podrían crecer indefinidamente y superar 1 MB de tamaño.

```javascript
// Hipotético: historial de 10 años con 1000+ registros
ficha_veterinaria: {
  consultas: [ /* 1000 registros */ ],  // 5 MB de datos
  examenes: [ /* 500 registros */ ],
  tratamientos: [ /* 300 registros */ ]
}
```

#### 2. Acceso Independiente Frecuente

Si veterinarios consultaran fichas médicas frecuentemente sin necesitar información de la criatura. Por ejemplo, reportes de salud diarios que solo procesan estados de salud sin datos de la criatura.

#### 3. Ficha Compartida

Si múltiples criaturas pudieran compartir la misma ficha (por ejemplo, criaturas clonadas o gemelas que comparten historial médico inicial), una referencia evitaría duplicación de datos.

#### 4. Actualizaciones Muy Frecuentes

Si la ficha se actualizara cada pocos minutos (monitoreo en tiempo real con sensores), embeber causaría reescritura constante del documento completo de la criatura, afectando rendimiento.

---

## 3. Relaciones 1-a-N: Inventario Embebido vs. Criaturas Referenciadas

### Guardián → Inventario (Embebida)

#### Justificación de la Decisión

La relación guardián-inventario embebida fue correcta por:

#### Cardinalidad Limitada

Un guardián típicamente tiene entre 5-20 items en su inventario, con límite lógico máximo de 50 items. Cada item ocupa aproximadamente 50 bytes:

```
50 items × 50 bytes = 2,500 bytes = 2.5 KB
```

Muy por debajo del límite de documento de MongoDB, sin riesgo de crecimiento descontrolado.

#### Operaciones Atómicas Críticas

El inventario se modifica frecuentemente durante el juego (usar pociones, agregar items). Estas operaciones deben ser atómicas para evitar race conditions:

```javascript
// Usar poción - operación atómica
db.guardianes.updateOne(
  { nombre: "Aria Luminis", "inventario.nombre_item": "Poción de Vida" },
  { $inc: { "inventario.$.cantidad": -1 } }
);
```

Si estuviera referenciado, requerirían múltiples operaciones no atómicas con riesgo de inconsistencias en juego multijugador.

#### Patrón de Acceso

El inventario siempre se consulta junto con el guardián. Al ver el perfil del guardián, el usuario necesita ver su inventario inmediatamente. Una consulta obtiene ambos.

#### Simplicidad CRUD

Agregar item: una operación `$push`  
Eliminar guardián: automáticamente elimina inventario embebido  
No requiere gestión manual de referencias ni limpieza de datos huérfanos.

---

### Guardián → Criaturas (Referenciada)

#### Justificación de la Decisión

La relación guardián-criaturas referenciada fue correcta por:

#### Cardinalidad Ilimitada

Un guardián puede capturar potencialmente cientos o miles de criaturas a lo largo del tiempo. Embeber todas en array causaría:
- Documentos de varios MB
- Problemas de rendimiento al cargar todo el array
- Posible superación del límite de 16 MB

#### Documentos de Criatura Extensos

Cada criatura tiene múltiples campos complejos:
- Arrays de habilidades
- Objetos anidados (ficha veterinaria)
- Metadatos extensos

Un solo documento de criatura puede ocupar 1-5 KB. 1000 criaturas embebidas = 1-5 MB por guardián.

#### Acceso Independiente Frecuente

Las criaturas se consultan frecuentemente sin necesitar datos del guardián:
- Búsquedas por especie: "mostrar todos los dragones"
- Filtros por nivel de peligro
- Consultas del bestiario global
- Estadísticas de criaturas capturadas

```javascript
// Consulta independiente del guardián
db.criaturas.find({ es_legendaria: true, nivel_peligro: { $gte: 8 } });
```

#### Actualizaciones Independientes

Las criaturas se actualizan frecuentemente (estado de salud, nivel, habilidades adquiridas) sin necesidad de modificar el documento del guardián. Con embebido, cada actualización de criatura reescribiría todo el documento del guardián.

#### Reasignación de Criaturas

Una criatura puede cambiar de guardián (transferencias, intercambios). Con referencia, solo se actualiza el campo `id_guardian`:

```javascript
db.criaturas.updateOne(
  { nombre: "Fénix Dorado" },
  { $set: { id_guardian: nuevoGuardianId } }
);
```

Con embebido, requeriría eliminar de un array y agregar a otro (dos operaciones complejas).

#### Escalabilidad

A medida que el bestiario crece con millones de criaturas, las consultas permanecen eficientes. MongoDB puede crear índices específicos en la colección de criaturas:

```javascript
db.criaturas.createIndex({ id_guardian: 1, es_legendaria: 1 });
```

### Tabla Comparativa

| Criterio | Inventario (Embebido) | Criaturas (Referenciado) |
|----------|----------------------|--------------------------|
| **Cardinalidad** | Limitada (5-50 items) | Ilimitada (0-∞ criaturas) |
| **Tamaño individual** | Pequeño (~50 bytes) | Grande (~1-5 KB) |
| **Patrón de acceso** | Siempre con guardián | Frecuentemente independiente |
| **Atomicidad crítica** | Sí (operaciones de juego) | No crítica |
| **Actualizaciones** | Baja frecuencia | Alta frecuencia |
| **Reasignación** | No aplica | Sí (intercambios) |
| **Consultas globales** | No necesarias | Sí (búsquedas en bestiario) |

---

## Conclusión

Las decisiones de modelado respondieron a principios fundamentales de diseño en MongoDB:

1. **Embeber cuando:** Relación 1-a-1 o 1-a-pocos, tamaño limitado, alta cohesión, atomicidad necesaria
2. **Referenciar cuando:** Relación 1-a-muchos ilimitada, documentos grandes, acceso independiente, actualizaciones frecuentes

El Bestiario Digital demostró que no existe una solución única. Cada relación requiere análisis específico de patrones de uso, tamaño de datos y requisitos de atomicidad.