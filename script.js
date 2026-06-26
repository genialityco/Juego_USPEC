// --- 1. DICCIONARIO DE DATOS ---
const cartasBase = [
    { id: "1", nombre: "Acceso a Internet", imagen: "img/internet.png", mensaje: "El acceso a Internet en USPEC proporciona la conexión esencial que permite a los empleados comunicarse, colaborar y acceder a información crucial para el desarrollo eficiente de las operaciones diarias." },
    { id: "2", nombre: "Acceso por VPN", imagen: "img/vpn.png", mensaje: "Proporciona una conexión segura y cifrada a la red corporativa a través de una infraestructura de red pública, permitiendo que los colaboradores accedan a recursos internos, aplicaciones y bases de datos de forma remota como si estuvieran físicamente en la oficina." },
    { id: "3", nombre: "Administración Intranet", imagen: "img/intranet.png", mensaje: "El portal digital centralizado para consultar información oficial y gestionar flujos de trabajo. Incluye soporte Técnico y permisos de usuario." },
    { id: "4", nombre: "APP Móvil USPEC", imagen: "img/app.png", mensaje: "Diseño y despliegue de apps personalizadas para tareas específicas, incluye configuración lógica, automatización de flujos de trabajo, envío de correos y PDFs. Ideal para reportar información desde cualquier lugar sin usar un PC." },
    { id: "5", nombre: "Servicios Audiovisuales", imagen: "img/audiovisuales.png", mensaje: "Para el desarrollo de reuniones y juntas en los auditorios y salas con los que cuenta la entidad, incluye servicio completo de configuración, sin alquiler de equipos externos y Garantía de presentaciones y conferencias." },
    { id: "6", nombre: "Equipos de cómputo", imagen: "img/computo.png", mensaje: "Instalación y configuración de hardware y software para los equipos asignados a los funcionarios y contratistas de la entidad, también incluye la Reparación de hardware institucional y reinstalación de imagen corporativa para mantener la operatividad de los equipos asignados." },
    { id: "7", nombre: "Gestión de Accesos", imagen: "img/accesos.png", mensaje: "Incluye la Creación, modificación o Inactivación de cuentas de usuarios Para el uso y acceso de los recursos y aplicaciones de IT en la Entidad. Diseñado para soportar el crecimiento de la planta de Personal y la incorporación de nuevas plataformas Tecnológicas mediante una infraestructura de directorio activo y sistemas de autenticación centralizados." },
    { id: "8", nombre: "Mesa de Servicios TIC", imagen: "img/mesa.png", mensaje: "Tu centro de ayuda tecnológica con soporte rápido y eficiente. Encargados de la Gestión de tickets y resolución de incidentes para mantener tu operación funcionando. " },
    { id: "9", nombre: "Impresión y Escaneado", imagen: "img/impresion.png", mensaje: "Acceso y configuración de los servicios de impresoras y escaner a los usuarios, así como el soporte especializado por el proveedor designado en la entidad." },
    { id: "10", nombre: "Máquinas Virtuales", imagen: "img/virtuales.png", mensaje: "Escritorio en la nube con recursos dedicados. Incluye recursos dedicados de CPU con acceso remoto seguro desde cualquier ubicación." },
    { id: "11", nombre: "Google Workspace", imagen: "img/workspace.png", mensaje: "Ecosistema digital para trabajo colaborativo eficiente y centralizado. Incluye licenciamiento, configuración de correo, herramientas ofimáticas y soporte técnico." },
    { id: "12", nombre: "Tableros de Control", imagen: "img/tableros.png", mensaje: "Diseño y mantenimiento de visualizaciones dinámicas de datos en tiempo real con la generación de tableros de control (Dashboards) para toma de decisiones, reportes de gestión misional y capacitación" },
    { id: "13", nombre: "Telefonía IP", imagen: "img/telefonia.png", mensaje: "Configuración de extensiones y teléfonos por internet para funcionarios. Incluye traslados de puestos telefónicos para los funcionarios de la Entidad." }
];

// --- 2. VARIABLES DEL JUEGO MULTIJUGADOR ---
let tablero = document.getElementById('tablero-juego');
let cartasVolteadas = [];
let parejasEncontradas = 0;
let bloqueoTablero = false;

// Variables Modo Competitivo y Tiempos
let turnoActual = 1; 
let puntosJ1 = 0;
let puntosJ2 = 0;
let intentosRestantes = 2; 

// Cronómetro
let tiempoJ1 = 0; 
let tiempoJ2 = 0; 
let intervaloCronometro;
let juegoPausado = false; 

// --- 3. LÓGICA PRINCIPAL ---
function iniciarJuego() {
    let mazo = [...cartasBase, ...cartasBase];
    
    // Algoritmo Fisher-Yates para barajar al azar de forma perfecta
    for (let i = mazo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]]; 
    }

    mazo.forEach(carta => {
        let elementoCarta = document.createElement('div');
        elementoCarta.classList.add('carta');
        elementoCarta.dataset.id = carta.id;
        
        elementoCarta.innerHTML = `
            <div class="carta-inner">
                <div class="carta-frente"><img src="${carta.imagen}" alt="${carta.nombre}"></div>
                <div class="carta-dorso">USPEC</div>
            </div>
        `;
        elementoCarta.addEventListener('click', voltearCarta);
        tablero.appendChild(elementoCarta);
    });

    actualizarUI();
    arrancarCronometro(); // Enciende el reloj al iniciar
}

function voltearCarta() {
    if (bloqueoTablero) return;
    if (this.classList.contains('volteada') || this.classList.contains('encontrada')) return;

    this.classList.add('volteada');
    cartasVolteadas.push(this);

    if (cartasVolteadas.length === 2) {
        verificarPareja();
    }
}

function verificarPareja() {
    bloqueoTablero = true;
    let [carta1, carta2] = cartasVolteadas;
    
    intentosRestantes--;
    actualizarUI(); 

    if (carta1.dataset.id === carta2.dataset.id) {
        carta1.classList.replace('volteada', 'encontrada');
        carta2.classList.replace('volteada', 'encontrada');
        
        if (turnoActual === 1) puntosJ1++; else puntosJ2++;
        
        parejasEncontradas++;
        actualizarUI(); 
        
        mostrarInformacion(carta1.dataset.id);
        cartasVolteadas = [];
    } else {
        setTimeout(() => {
            carta1.classList.remove('volteada');
            carta2.classList.remove('volteada');
            cartasVolteadas = [];
            evaluarCambioTurno(); 
            bloqueoTablero = false;
        }, 1000);
    }
}

function evaluarCambioTurno() {
    if (intentosRestantes === 0) {
        turnoActual = (turnoActual === 1) ? 2 : 1;
        intentosRestantes = 2;
    }
    actualizarUI(); 
}

function actualizarUI() {
    document.getElementById('puntos-j1').innerText = puntosJ1;
    document.getElementById('puntos-j2').innerText = puntosJ2;
    document.getElementById('intentos-restantes').innerText = intentosRestantes;
    document.getElementById('texto-turno').innerText = `Turno: Jugador ${turnoActual}`;
    
    // Actualiza los tiempos
    document.getElementById('tiempo-j1').innerText = formatearTiempo(tiempoJ1);
    document.getElementById('tiempo-j2').innerText = formatearTiempo(tiempoJ2);
    
    if (turnoActual === 1) {
        document.getElementById('marcador-j1').classList.add('activo');
        document.getElementById('marcador-j2').classList.remove('activo');
    } else {
        document.getElementById('marcador-j2').classList.add('activo');
        document.getElementById('marcador-j1').classList.remove('activo');
    }
}

// --- 4. VENTANAS EMERGENTES Y TIEMPOS ---
function mostrarInformacion(idCarta) {
    juegoPausado = true; // El reloj deja de avanzar aquí

    const infoCarta = cartasBase.find(carta => carta.id === idCarta);
    document.getElementById('imagen-mensaje').src = infoCarta.imagen;
    document.getElementById('titulo-mensaje').innerText = infoCarta.nombre;
    document.getElementById('texto-mensaje').innerText = infoCarta.mensaje;
    
    document.getElementById('modal-info').classList.remove('oculto');
}

function cerrarMensaje() {
    juegoPausado = false; // El reloj retoma su marcha

    document.getElementById('modal-info').classList.add('oculto');
    evaluarCambioTurno(); 
    bloqueoTablero = false;

    if (parejasEncontradas === cartasBase.length) {
        setTimeout(() => {
            lanzarVictoria();
        }, 500);
    }
}

// --- 5. FIN DEL JUEGO Y REINICIO ---
function lanzarVictoria() {
    clearInterval(intervaloCronometro); // Apaga el reloj completamente

    let mensajeGanador = "";
    
    if (puntosJ1 > puntosJ2) {
        mensajeGanador = "🏆 ¡Jugador 1 es el GANADOR! FELICIDADES!!!";
    } else if (puntosJ2 > puntosJ1) {
        mensajeGanador = "🏆 ¡Jugador 2 es el GANADOR! FELICIDADES!!!";
    } else {
        mensajeGanador = "🤝 ¡Es un EMPATE TÉCNICO!!! SON INCREIBLES!!!";
    }

    document.getElementById('titulo-victoria').innerText = mensajeGanador;
    
    // Muestra los puntos y el tiempo final para los premios
    document.getElementById('texto-victoria').innerHTML = `
        <br><b>Resultados Finales:</b><br><br>
        🔵 Jugador 1: ${puntosJ1} parejas | ⏱️ Tiempo: ${formatearTiempo(tiempoJ1)}<br>
        🔴 Jugador 2: ${puntosJ2} parejas | ⏱️ Tiempo: ${formatearTiempo(tiempoJ2)}<br><br>
        ¡AMBOS LA TIENEN CLARA! ¡SON EXPERTOS CONOCEDORES DE LOS SERVICIOS DE LA OTEC!!! 🌟💻
    `;

    lanzarFuegosArtificiales();
    document.getElementById('modal-victoria').classList.remove('oculto');
}

function lanzarFuegosArtificiales() {
    let duracion = 4 * 1000;
    let finAnimacion = Date.now() + duracion;
    let intervalo = setInterval(function() {
        let tiempoRestante = finAnimacion - Date.now();
        if (tiempoRestante <= 0) return clearInterval(intervalo);
        let particulas = 50 * (tiempoRestante / duracion);
        
        confetti({ particleCount: particulas, startVelocity: 30, spread: 360, origin: { x: Math.random() * 0.3, y: Math.random() - 0.2 }, zIndex: 3000 });
        confetti({ particleCount: particulas, startVelocity: 30, spread: 360, origin: { x: Math.random() * 0.3 + 0.7, y: Math.random() - 0.2 }, zIndex: 3000 });
    }, 250);
}

function reiniciarJuego() {
    document.getElementById('modal-victoria').classList.add('oculto');
    tablero.innerHTML = ''; 
    cartasVolteadas = [];
    
    parejasEncontradas = 0;
    puntosJ1 = 0;
    puntosJ2 = 0;
    turnoActual = 1;
    intentosRestantes = 2;
    bloqueoTablero = false;
    
    tiempoJ1 = 0; 
    tiempoJ2 = 0; 
    juegoPausado = false;

    iniciarJuego(); 
}

// --- 6. CRONÓMETRO FUNCIONES ---
function arrancarCronometro() {
    clearInterval(intervaloCronometro); 
    intervaloCronometro = setInterval(() => {
        if (!juegoPausado) {
            if (turnoActual === 1) {
                tiempoJ1++;
            } else {
                tiempoJ2++;
            }
            actualizarUI(); 
        }
    }, 1000); 
}

function formatearTiempo(totalSegundos) {
    let minutos = Math.floor(totalSegundos / 60);
    let segundos = totalSegundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

// --- 7. CONFIGURACION DEL FONDO ---
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#004b87" },
        links: { enable: true, distance: 150, color: "#004b87", opacity: 0.3, width: 1 },
        move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, outModes: { default: "bounce" } },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: 0.5 }
    },
    interactivity: { events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } }, modes: { grab: { distance: 180, links: { opacity: 0.8 } }, push: { quantity: 3 } } }, detectRetina: true
});

iniciarJuego();