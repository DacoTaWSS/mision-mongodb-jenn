
// Conectarse y crear la base de datos
use bestiario

// Crear la colección de criaturas
db.createCollection("criaturas")

// Inserción
db.criaturas.insertOne({
    nombre: "Kaiju No. 8",
    anime: "Kaiju No. 8",
    tipo: "Kaiju Humanoide",
    nivel_fortificacion: 9.8,
    numero_nucleo: 8,
    puede_transformarse: true,
    forma_humana: {
        nombre: "Kafka Hibino",
        edad: 32,
        ocupacion: "Miembro de la Fuerza de Defensa"
    },
    habilidades: [
        "Transformación kaiju",
        "Regeneración acelerada",
        "Súper fuerza",
        "Visión de núcleo",
        "Disparo de energía"
    ],
    estadisticas_combate: {
        fuerza: 8500,
        velocidad: 9200,
        regeneracion: 9500
    },
    color_primario: "negro con líneas luminosas",
    consciente_en_forma_kaiju: true,
    fecha_registro: new Date()
})

db.criaturas.insertOne({
    nombre: "Rey de las Bestias Marinas",
    anime: "One Piece",
    tipo: "Rey Marino",
    clasificacion: "depredador apex",
    tamaño_aproximado_km: 5,
    habitat_exclusivo: "Calm Belt",
    numero_de_escamas: "incontables",
    tipo_escamas: "casi impenetrables",
    dieta: "carnívoro - devora barcos enteros",
    debilidad_fatal: "usuarios de Akuma no Mi en el agua",
    inmune_a: ["cañones convencionales", "espadas normales"],
    velocidad_nado: "extremadamente rápida",
    territorios: ["East Blue Calm Belt", "Grand Line Calm Belt"],
    avistamientos_registrados: 47,
    barcos_destruidos: 200,
    fecha_registro: new Date()
})

db.criaturas.insertOne({
    nombre: "Seiryu",
    anime: "One Piece",
    tipo: "Transformación Zoan Mítica",
    fruta_del_diablo: "Uo Uo no Mi, Modelo: Seiryu",
    usuario_actual: "Kaido",
    titulo_usuario: "La Criatura Más Fuerte del Mundo",
    rango: "Yonko",
    forma_dragon: {
        color: "azul oriental con escamas brillantes",
        tipo_cuerpo: "serpentino tradicional asiático",
        longitud_km: "varios kilómetros",
        tiene_alas: false,
        metodo_vuelo: "Flame Clouds (nubes de llama)"
    },
    ataques_especiales: [
        {nombre: "Bolo Breath", tipo: "aliento de fuego", potencia: "destruye montañas"},
        {nombre: "Kaifuu", tipo: "ráfagas de viento cortante", alcance: "kilómetros"},
        {nombre: "Tatsumaki", tipo: "tornados", efecto: "devastación masiva"}
    ],
    haki_dominado: ["Observación", "Armadura", "Conquistador", "Conquista Avanzado"],
    debilidades: ["técnicas de Ryou avanzadas", "Nika Gear 5"],
    peleas_legendarias: ["vs Oden", "vs Luffy (múltiples)", "vs Big Mom"],
    cicatrices: {
        de_quien: "Kozuki Oden",
        ubicacion: "torso",
        permanente: true
    },
    fecha_registro: new Date()
})

db.criaturas.insertOne({
    nombre: "Jinki Gigante",
    anime: "Gachiakuta",
    tipo: "Bestia de Basura Amalgamada",
    composicion: [
        "metal oxidado",
        "plástico corrupto",
        "residuos orgánicos",
        "materiales tóxicos"
    ],
    forma: "amorfa y cambiante",
    numero_nucleos: "múltiples (3-7)",
    tamaño: "variable según absorción",
    peso_toneladas: 450,
    metodo_crecimiento: "absorción continua de desechos",
    nivel_toxicidad: 9000,
    emite_gases: true,
    gases_emitidos: ["metano", "compuestos tóxicos", "vapores corrosivos"],
    regeneracion: "instantánea mediante absorción de basura",
    debilidad_primaria: "Givers (limpiadores con habilidades)",
    zona_aparicion: "vertederos urbanos del Abismo",
    peligro_para: ["humanos", "estructuras", "medio ambiente"],
    puede_ser_domesticado: false,
    inteligencia: "instintiva básica",
    fecha_registro: new Date()
})

db.criaturas.insertOne({
    nombre: "Guardián del Abismo",
    anime: "Gachiakuta",
    tipo: "Jinki Evolucionado",
    habitat: "Profundidades del Abismo",
    nivel_peligro: 10,
    evolucion_de: "Jinki común",
    años_evolucionando: 50,
    nucleos_vitales: {
        cantidad: 7,
        ubicaciones: "desconocidas dentro del cuerpo",
        destruccion_necesaria: "todos simultáneamente"
    },
    forma_corporal: "quimérica - mezcla de múltiples bestias",
    partes_identificables: [
        "garras de metal",
        "tentáculos de cables",
        "mandíbulas múltiples",
        "ojos brillantes dispersos"
    ],
    altura_metros: 45,
    territorio: {
        nombre: "Profundidades del Abismo",
        tamaño_km2: 12,
        otros_jinkis_en_zona: 200,
        dominio: "absoluto"
    },
    habilidades_comando: "controla jinkis menores telepáticamente",
    jinkis_bajo_control: 50,
    nivel_inteligencia: "táctica limitada",
    ataque_area: {
        nombre: "Corrupción Tóxica Masiva",
        radio_metros: 500,
        efecto: "transforma área en zona inhabitable"
    },
    hostilidad: "extrema hacia humanos",
    encuentros_registrados: 3,
    bajas_causadas: 127,
    estrategia_combate: "usar subordinados primero, luego ataque directo",
    fecha_registro: new Date()
})

db.criaturas.insertMany([
    {
        nombre: "Titán Colosal",
        anime: "Attack on Titan",
        tipo: "Titán Cambiante",
        habitat: "Murallas de Paradis",
        nivel_peligro: 10,
        altura_metros: 60,
        habilidades: [
            "Explosión de vapor",
            "Regeneración",
            "Transformación"
        ],
        estadisticas: {
            fuerza: 9800,
            velocidad: 2000,
            resistencia: 9500
        },
        debilidad: "nuca",
        usuario: "Bertholdt Hoover",
        puede_hablar: false,
        fecha_registro: new Date()
    },
    {
        nombre: "Hollow Vasto Lorde",
        anime: "Bleach",
        tipo: "Hollow Evolucionado",
        habitat: "Hueco Mundo",
        nivel_peligro: 9,
        mascara: true,
        agujero_hollow: "pecho",
        habilidades: [
            "Cero",
            "Sonido",
            "Regeneración instantánea",
            "Hierro"
        ],
        poder_espiritual: 9500,
        rareza: "extremadamente raro",
        inteligencia: "humana completa",
        fecha_registro: new Date()
    }
])

// Lectura (Read):

db.criaturas.find().pretty()


db.criaturas.find({ habitat: "Profundidades del Abismo" })

db.criaturas.find({ nivel_peligro: { $gt: 8 } })


// Actualización

db.criaturas.updateOne(
    { nombre: "Kaiju No. 8" },
    { $push: { habilidades: "Modo Berserk" } }
)


db.criaturas.updateMany(
    { habitat: "Profundidades del Abismo" },
    { $inc: { nivel_peligro: 1 } }
)
