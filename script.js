// Elementos principales
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const albumCircle = document.getElementById('albumCircle');
const lyricsContent = document.getElementById('lyricsContent');
const lyricsPlaceholder = document.getElementById('lyricsPlaceholder');
const indicatorDots = document.querySelectorAll('.indicator-dot');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');

// Elementos para galería de fotos
const galleryBtn = document.getElementById('galleryBtn');
const photoViewer = document.getElementById('photoViewer');
const photoDisplay = document.getElementById('photoDisplay');
const photoTitle = document.getElementById('photoTitle');
const photoCaption = document.getElementById('photoCaption');
const prevPhotoBtn = document.getElementById('prevPhotoBtn');
const nextPhotoBtn = document.getElementById('nextPhotoBtn');
const currentPhotoEl = document.getElementById('currentPhoto');
const totalPhotosEl = document.getElementById('totalPhotos');
const photoDots = document.getElementById('photoDots');

// CONFIGURACIÓN PERSONALIZABLE
// =============================

// 1. Configuración de la canción
const songConfig = {
    title: "Dandelions",
    artist: "Ruth B.",
    // Los tiempos de las letras (ajústalos según tu canción)
    lyrics: [
        [12, "Quizás sea la forma en que dices mi nombre."],
        [18, "Quizás sea la forma en que juegas tu juego."],
        [23, "Pero es tan bueno"],
        [25, "Nunca he conocido a nadie como tú"],
        [29, "Pero es tan bueno"],
        [31, "Nunca he soñado con nadie como tú"],
        [36, "Y he oído hablar de un amor que llega una vez en la vida."],
        [43, "Y estoy bastante segura de que tú eres ese amor mío 💗."],
        [48, "Porque estoy en un campo de dientes de león."],
        [52, "Deseando a todos que seas mío, mío."],
        [61, "Y veo la eternidad en tus ojos"],
        [64, "Me siento bien cuando te veo sonreír, sonreír."],
        [73, "Deseando tener dientes de león todo el tiempo"],
        [76, "Orando a Dios para que un día seas mío"],
        [79, "Deseando dientes de león todo el tiempo, todo el tiempo"],
        [86, "Creo que eres el indicado para mí 💗"],
        [92, "Porque se hace muy difícil respirar"],
        [97, "Cuando me miras"],
        [99, "Nunca me he sentido tan viva y libre."],
        [103, "Cuando me miras"],
        [105, "Nunca me he sentido tan felíz"],
        [110, "Y he oído hablar de un amor que llega una vez en la vida."],
        [116, "Y estoy bastante segura de que tú eres ese amor mío 💗"],
        [122, "Porque estoy en un campo de dientes de león."],
        [126, "Deseando a todos que seas mío, mío."],
        [135, "Y veo la eternidad en tus ojos"],
        [138, "Me siento bien cuando te veo sonreír, sonreír."],
        [146, "Deseando tener dientes de león todo el tiempo"],
        [150, "Orando a Dios para que un día seas mío"],
        [153, "Deseando dientes de león todo el tiempo, todo el tiempo"],
        [160,"Diente de león, vas hacia el viento"],
        [163, "¿No se lo harás saber a mi amor?"],
        [166, "Diente de león, vas hacia el viento"],
        [169, "¿No le dejarás saber a mi querido que..."],
        [174, "Estoy en un campo de dientes de león."],
        [177, "Deseando a todos que seas mío, mío."],
        [186, "Y veo la eternidad en tus ojos"],
        [189, "Me siento bien cuando te veo sonreír, sonreír."],
        [197, "Deseando tener dientes de león todo el tiempo"],
        [200, "Orando a Dios para que un día seas mío"],
        [203, "Deseando dientes de león todo el tiempo, todo el tiempo"],
        [210, "Estoy en un campo de dientes de león."],
        [214, "Deseando a todos que seas mío, mío."],
        [224, "Te Amo ♥️"]
        
        
    ]
};

// 2. Galería de fotos (rutas relativas a la carpeta assets/images/)
const photos = [
    {
        title: "Nuestro Primer Día",
        caption: "El día que todo comenzó, y supe que eras especial.",
        url: "assets/images/foto1.jpg"
    },
    {
        title: "Sonrisas Compartidas",
        caption: "Esos momentos donde nuestras sonrisas fluyen naturalmente y el tiempo parece detenerse.",
        url: "assets/images/foto2.jpg"
    },
    {
        title: "Atardeceres Juntos",
        caption: "Compartiendo sueños y construyendo recuerdos.",
        url: "assets/images/foto3.jpg"
    },
    {
        title: "Pequeños Detalles",
        caption: "Esas miradas que dicen más que mil palabras, esos gestos que lo significan todo.",
        url: "assets/images/foto4.jpg"
    }
 
];

// Variables de estado
let currentLyricIndex = -1;
let currentPhotoIndex = 0;
let galleryRevealed = false;
let currentIndicator = 0;
let lastDirection = 'next';

// ============================================
// SISTEMA MEJORADO DE CORAZONES DE FONDO
// (Arriba hacia abajo con diferentes transparencias)
// ============================================

function createFloatingHeartsSystem() {
    const container = document.getElementById('heartsContainer');
    
    // Capa 1: Corazones grandes y lentos (60% transparencia)
    for (let i = 0; i < 10; i++) {
        createDownwardHeart(container, 'heart-bg-down', 24, 32, 20, 0.4); // 60% visible
    }
    
    // Capa 2: Corazones medianos (40% transparencia)
    for (let i = 0; i < 15; i++) {
        createDownwardHeart(container, 'heart-bg-down-medium', 18, 26, 25, 0.6); // 40% visible
    }
    
    // Capa 3: Corazones pequeños y rápidos (20% transparencia)
    for (let i = 0; i < 20; i++) {
        createDownwardHeart(container, 'heart-bg-down-fast', 14, 20, 15, 0.8); // 20% visible
    }
}

function createDownwardHeart(container, className, minSize, maxSize, baseDuration, baseOpacity) {
    const heart = document.createElement('div');
    heart.className = className;
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    
    // Posición inicial aleatoria en la parte superior
    const leftPos = Math.random() * 100;
    const delay = Math.random() * 30;
    const heartDuration = baseDuration + Math.random() * 10;
    
    // Tamaño aleatorio
    const size = minSize + Math.random() * (maxSize - minSize);
    
    // Opacidad aleatoria (más opacos que los de fondo anterior)
    const opacity = baseOpacity + Math.random() * 0.15;
    
    // Colores con diferentes niveles de transparencia
    const colors = [
        `rgba(255, 64, 129, ${opacity})`,    // Rosa fuerte
        `rgba(233, 30, 99, ${opacity})`,     // Rosa medio
        `rgba(194, 24, 91, ${opacity})`,     // Rosa oscuro
        `rgba(255, 128, 171, ${opacity})`    // Rosa claro
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    heart.style.left = `${leftPos}%`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${heartDuration}s`;
    heart.style.fontSize = `${size}px`;
    heart.style.color = color;
    
    // Rotación inicial aleatoria
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    container.appendChild(heart);
}

// ============================================
// SISTEMA OPTIMIZADO DE CORAZONES PARA LETRAS
// (Explotan a los costados sin tapar el texto)
// ============================================

function createLyricHeartsOptimized() {
    const lyricsContainer = document.querySelector('.lyrics-container');
    const rect = lyricsContainer.getBoundingClientRect();
    
    // Crear contenedor para corazones de letras si no existe
    let heartsContainer = document.querySelector('.lyrics-hearts-container');
    if (!heartsContainer) {
        heartsContainer = document.createElement('div');
        heartsContainer.className = 'lyrics-hearts-container';
        lyricsContainer.appendChild(heartsContainer);
    }
    
    // Limpiar corazones anteriores
    heartsContainer.innerHTML = '';
    
    // Crear corazones que explotan desde diferentes direcciones
    const heartCount = 8; // Menos corazones pero mejor posicionados
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heartType = Math.floor(Math.random() * 8);
            let heartClass, startPosition;
            
            switch(heartType) {
                case 0: // Izquierda
                    heartClass = 'heart-lyric-left';
                    startPosition = {
                        left: '10%',
                        top: `${30 + Math.random() * 40}%`
                    };
                    break;
                case 1: // Derecha
                    heartClass = 'heart-lyric-right';
                    startPosition = {
                        right: '10%',
                        top: `${30 + Math.random() * 40}%`
                    };
                    break;
                case 2: // Arriba
                    heartClass = 'heart-lyric-top';
                    startPosition = {
                        left: `${20 + Math.random() * 60}%`,
                        top: '10%'
                    };
                    break;
                case 3: // Abajo
                    heartClass = 'heart-lyric-bottom';
                    startPosition = {
                        left: `${20 + Math.random() * 60}%`,
                        bottom: '10%'
                    };
                    break;
            }
            
            // Crear corazón
            const heart = document.createElement('div');
            heart.className = heartClass;
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Posicionar
            Object.keys(startPosition).forEach(key => {
                heart.style[key] = startPosition[key];
            });
            
            // Tamaño aleatorio moderado
            const size = 18 + Math.random() * 10;
            heart.style.fontSize = `${size}px`;
            
            // Sombra para brillo
            heart.style.textShadow = `0 0 6px currentColor`;
            
            // Agregar al contenedor
            heartsContainer.appendChild(heart);
            
            // Remover después de la animación
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
            
        }, i * 150);
    }
}

// ============================================
// SISTEMA OPTIMIZADO DE CORAZONES PARA FOTOS
// ============================================

function createPhotoHeartsOptimized() {
    const rect = photoDisplay.getBoundingClientRect();
    
    for (let i = 0; i < 4; i++) { // Menos corazones
        setTimeout(() => {
            // Elegir efecto
            const effects = ['heartbeat-effect', 'spin-effect-soft'];
            const effect = effects[Math.floor(Math.random() * effects.length)];
            
            // Crear corazón
            const heart = document.createElement('div');
            heart.className = `heart-effect ${effect}`;
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Posición aleatoria alrededor de la foto (no encima)
            const margin = 30;
            const startX = rect.left - margin + Math.random() * (rect.width + margin * 2);
            const startY = rect.top - margin + Math.random() * (rect.height + margin * 2);
            
            // Asegurar que no esté justo encima de la foto
            const isOverPhoto = startX > rect.left && startX < rect.left + rect.width &&
                              startY > rect.top && startY < rect.top + rect.height;
            
            if (isOverPhoto && Math.random() > 0.5) {
                // Si está sobre la foto, moverlo a un borde
                heart.style.left = `${rect.left - margin}px`;
                heart.style.top = `${rect.top + Math.random() * rect.height}px`;
            } else {
                heart.style.left = `${startX}px`;
                heart.style.top = `${startY}px`;
            }
            
            // Tamaño
            const size = 16 + Math.random() * 20;
            heart.style.fontSize = `${size}px`;
            
            // Color
            const colors = ['#ff4081', '#e91e63', '#c2185b'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.color = color;
            
            // Agregar al documento
            document.body.appendChild(heart);
            
            // Remover después
            setTimeout(() => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, 2000);
            
        }, i * 200);
    }
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

function initConfig() {
    songTitle.textContent = songConfig.title;
    songArtist.textContent = songConfig.artist;
    // createFloatingHeartsSystem(); // desactivado: sin corazones desde arriba
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            albumCircle.classList.add('playing');
            
            if (currentLyricIndex === -1) {
                lyricsPlaceholder.style.display = 'none';
                showNextLyric();
            }
        }).catch(error => {
            console.error("Error al reproducir:", error);
        });
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        albumCircle.classList.remove('playing');
    }
}

function showNextLyric() {
    const currentTime = audioPlayer.currentTime;
    
    let nextIndex = -1;
    for (let i = 0; i < songConfig.lyrics.length; i++) {
        if (songConfig.lyrics[i][0] <= currentTime && i > currentLyricIndex) {
            nextIndex = i;
        } else if (songConfig.lyrics[i][0] > currentTime) {
            break;
        }
    }
    
    if (nextIndex !== -1 && nextIndex !== currentLyricIndex) {
        currentLyricIndex = nextIndex;
        
        const lineElement = document.createElement('div');
        lineElement.className = 'lyrics-line';
        lineElement.textContent = songConfig.lyrics[nextIndex][1];
        
        lyricsContent.innerHTML = '';
        lyricsContent.appendChild(lineElement);
        
        setTimeout(() => {
            lineElement.classList.add('active');
        }, 50);
        
        updateIndicator();
        
        // USAR LA NUEVA FUNCIÓN OPTIMIZADA
        createLyricHeartsOptimized();
    }
}

function updateIndicator() {
    indicatorDots.forEach((dot, index) => {
        dot.classList.remove('active');
    });
    
    currentIndicator = (currentIndicator + 1) % indicatorDots.length;
    indicatorDots[currentIndicator].classList.add('active');
}

function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (duration && !isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration && !isNaN(duration)) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

function setVolume() {
    audioPlayer.volume = this.value;
}

function showGallery() {
    if (!galleryRevealed) {
        galleryRevealed = true;
        
        galleryBtn.innerHTML = `
            <div class="heart-pulse"></div>
            <i class="fas fa-heart"></i>
            <span>Nuestros Momentos Especiales</span>
        `;
        
        setTimeout(() => {
            photoViewer.classList.add('active');
            initGallery();
            
            setTimeout(() => {
                document.querySelector('.gallery-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
            
        }, 300);
    }
}

function initGallery() {
    totalPhotosEl.textContent = photos.length;
    createPhotoDots();
    showPhoto(0, 'fade-in');
}

function createPhotoDots() {
    photoDots.innerHTML = '';
    
    photos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'photo-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            const direction = index > currentPhotoIndex ? 'next' : 'prev';
            showPhoto(index, direction === 'next' ? 'slide-left' : 'slide-right');
        });
        
        photoDots.appendChild(dot);
    });
}

function showPhoto(index, animationClass = 'fade-in') {
    if (index < 0 || index >= photos.length) return;
    
    const photo = photos[index];
    const direction = index > currentPhotoIndex ? 'next' : 'prev';
    lastDirection = direction;
    
    // Actualizar índice actual
    currentPhotoIndex = index;
    
    // Actualizar contador
    currentPhotoEl.textContent = index + 1;
    
    // Actualizar puntos de navegación
    document.querySelectorAll('.photo-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Determinar clase de animación si no se especifica
    if (animationClass === 'fade-in') {
        animationClass = direction === 'next' ? 'slide-left' : 'slide-right';
    }
    
    // Crear elemento de imagen
    const img = new Image();
    img.src = photo.url;
    img.alt = photo.title;
    img.className = animationClass;
    
    // Manejar error de carga de imagen
    img.onerror = function() {
        console.error(`No se pudo cargar la imagen: ${photo.url}`);
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231a1a2e"/><text x="200" y="150" font-family="Arial" font-size="20" fill="%23ff4081" text-anchor="middle">Imagen no encontrada</text></svg>';
    };
    
    // Limpiar display y agregar nueva imagen
    const photoDisplay = document.getElementById('photoDisplay');
    photoDisplay.innerHTML = '';
    photoDisplay.appendChild(img);
    
    // Actualizar información (AHORA DEBAJO DE LA IMAGEN)
    document.getElementById('photoTitle').textContent = photo.title;
    document.getElementById('photoCaption').textContent = photo.caption;
    
    // Efecto de animación en la información
    const infoContainer = document.querySelector('.photo-info-container');
    infoContainer.style.animation = 'none';
    setTimeout(() => {
        infoContainer.style.animation = 'fadeInUp 0.5s ease forwards';
    }, 10);
    
    // Crear efecto de corazón MEJORADO (más corazones)
    createPhotoHeartsOptimized();
}

function prevPhoto() {
    if (currentPhotoIndex > 0) {
        showPhoto(currentPhotoIndex - 1, 'slide-right');
    } else {
        showPhoto(photos.length - 1, 'slide-right');
    }
}

function nextPhoto() {
    if (currentPhotoIndex < photos.length - 1) {
        showPhoto(currentPhotoIndex + 1, 'slide-left');
    } else {
        showPhoto(0, 'slide-left');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

playBtn.addEventListener('click', togglePlay);
audioPlayer.addEventListener('timeupdate', () => {
    updateProgress();
    showNextLyric();
});
audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
});
audioPlayer.addEventListener('error', (e) => {
    console.error("Error de audio:", e);
});
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
galleryBtn.addEventListener('click', showGallery);
prevPhotoBtn.addEventListener('click', prevPhoto);
nextPhotoBtn.addEventListener('click', nextPhoto);

// ============================================
// INICIALIZACIÓN
// ============================================

initConfig();

console.log(`
=== WEB DE SAN VALENTÍN OPTIMIZADA ===

Características mejoradas:
1. Corazones de fondo: Arriba → Abajo, diferentes transparencias
2. Corazones de letras: Explotan a los costados sin tapar texto
3. Sistema optimizado: Menos recursos, mejor rendimiento
4. z-index controlado: Contenido siempre visible

Configura tus archivos en:
- assets/audio/nuestra-cancion.mp3
- assets/images/foto1.jpg, foto2.jpg, etc.

¡Feliz San Valentín! ❤️
`);

/* ===============================
   CORAZONES SINCRONIZADOS CON MUSICA
   =============================== */
(function () {
    const heartsContainer = document.getElementById("heartsContainer");
    const audio = document.getElementById("audioPlayer");
    if (!heartsContainer || !audio) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const src = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    src.connect(analyser);
    analyser.connect(ctx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    let lastBeat = 0;

    function spawnHeart(strength = 1) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.innerHTML = "❤";

        const size = 14 + strength * 25;
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = size + "px";
        heart.style.opacity = 0.5 + strength * 0.5;
        heart.style.animationDuration = 14 - strength * 6 + "s";

        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 20000);
    }

    function analyze() {
        requestAnimationFrame(analyze);
        analyser.getByteFrequencyData(data);

        const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        const now = Date.now();

        if (bass > 190 && now - lastBeat > 300) {
            spawnHeart(bass / 255);
            lastBeat = now;
        }
    }

    audio.addEventListener("play", () => {
        if (ctx.state === "suspended") ctx.resume();
        analyze();
    });
})();


/* ===============================
   MEJORA SISTEMA DE FOTOS
   - Precarga de imágenes
   - Protección contra spam
   =============================== */
let photoLocked = false;

function preloadPhotos() {
    photos.forEach(p => {
        const img = new Image();
        img.src = p.url;
    });
}

// Llamar al precargado al iniciar galería
const _initGallery = initGallery;
initGallery = function () {
    preloadPhotos();
    _initGallery();
};

// Bloqueo corto para evitar clics rápidos
const _showPhoto = showPhoto;
showPhoto = function(index, animationClass) {
    if (photoLocked) return;
    photoLocked = true;
    _showPhoto(index, animationClass);
    setTimeout(()=> photoLocked = false, 600);
};
