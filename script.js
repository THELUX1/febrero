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
        [43, "Y estoy bastante seguro de que tú eres ese amor mío."],
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
        [103, "Cuando me miras"]
        
    ]
};

// 2. Galería de fotos (rutas relativas a la carpeta assets/images/)
const photos = [
    {
        title: "Nuestro Primer Día",
        caption: "El día que todo comenzó, cuando nuestros caminos se cruzaron y supe que eras especial.",
        url: "assets/images/foto1.jpg"
    },
    {
        title: "Risas Compartidas",
        caption: "Esos momentos donde la risa fluye naturalmente y el tiempo parece detenerse.",
        url: "assets/images/foto2.jpg"
    },
    {
        title: "Atardeceres Juntos",
        caption: "Contemplando el ocaso, compartiendo sueños y construyendo recuerdos.",
        url: "assets/images/foto3.jpg"
    },
    {
        title: "Pequeños Detalles",
        caption: "Esas miradas que dicen más que mil palabras, esos gestos que lo significan todo.",
        url: "assets/images/foto4.jpg"
    }
    // Agrega más fotos según necesites:
    // {
    //     title: "Título de la foto",
    //     caption: "Descripción personal",
    //     url: "assets/images/foto5.jpg"
    // }
];

// Variables de estado
let currentLyricIndex = -1;
let currentPhotoIndex = 0;
let galleryRevealed = false;
let currentIndicator = 0;
let lastDirection = 'next';

// FUNCIONES PRINCIPALES
// =====================

// Inicializar la configuración
function initConfig() {
    // Configurar título y artista
    songTitle.textContent = songConfig.title;
    songArtist.textContent = songConfig.artist;
}

// Generar corazones de fondo
function createHearts() {
    const container = document.getElementById('heartsContainer');
    
    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = 15 + Math.random() * 15;
        const size = 12 + Math.random() * 20;
        
        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.fontSize = `${size}px`;
        
        // Color aleatorio suave
        const opacity = 0.08 + Math.random() * 0.12;
        heart.style.color = `rgba(255, 64, 129, ${opacity})`;
        
        container.appendChild(heart);
    }
}

// Reproducir o pausar música
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            albumCircle.classList.add('playing');
            
            // Mostrar letras si es la primera vez
            if (currentLyricIndex === -1) {
                lyricsPlaceholder.style.display = 'none';
                showNextLyric();
            }
        }).catch(error => {
            console.error("Error al reproducir:", error);
            alert("No se pudo reproducir la canción. Verifica que el archivo de audio esté en la carpeta correcta.");
        });
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        albumCircle.classList.remove('playing');
    }
}

// Actualizar progreso de la canción
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (duration && !isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

// Formatear tiempo (mm:ss)
function formatTime(time) {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Click en barra de progreso
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration && !isNaN(duration)) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

// Controlar volumen
function setVolume() {
    audioPlayer.volume = this.value;
}

// Mostrar siguiente línea de letra
function showNextLyric() {
    const currentTime = audioPlayer.currentTime;
    
    // Encontrar la línea actual
    let nextIndex = -1;
    for (let i = 0; i < songConfig.lyrics.length; i++) {
        if (songConfig.lyrics[i][0] <= currentTime && i > currentLyricIndex) {
            nextIndex = i;
        } else if (songConfig.lyrics[i][0] > currentTime) {
            break;
        }
    }
    
    // Mostrar nueva línea si hay una
    if (nextIndex !== -1 && nextIndex !== currentLyricIndex) {
        currentLyricIndex = nextIndex;
        
        // Crear elemento para la línea
        const lineElement = document.createElement('div');
        lineElement.className = 'lyrics-line';
        lineElement.textContent = songConfig.lyrics[nextIndex][1];
        
        // Limpiar contenido anterior
        lyricsContent.innerHTML = '';
        
        // Agregar nueva línea
        lyricsContent.appendChild(lineElement);
        
        // Activar animación
        setTimeout(() => {
            lineElement.classList.add('active');
        }, 50);
        
        // Actualizar indicador
        updateIndicator();
        
        // Crear efecto de corazón
        createLyricHeartEffect();
    }
}

// Actualizar indicador de puntos
function updateIndicator() {
    indicatorDots.forEach((dot, index) => {
        dot.classList.remove('active');
    });
    
    currentIndicator = (currentIndicator + 1) % indicatorDots.length;
    indicatorDots[currentIndicator].classList.add('active');
}

// Efecto de corazón para letras
function createLyricHeartEffect() {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart" style="color:#ff4081;"></i>';
    heart.style.position = 'absolute';
    heart.style.fontSize = '20px';
    heart.style.zIndex = '1000';
    heart.style.pointerEvents = 'none';
    heart.style.opacity = '0';
    
    const lyricsDisplay = document.querySelector('.lyrics-display');
    const rect = lyricsDisplay.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width/2}px`;
    heart.style.top = `${rect.top + rect.height/2}px`;
    
    document.body.appendChild(heart);
    
    const animation = heart.animate([
        { 
            transform: 'translateY(0) scale(1)', 
            opacity: 1 
        },
        { 
            transform: 'translateY(-30px) scale(1.3)', 
            opacity: 0 
        }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
    };
}

// Mostrar galería de fotos
function showGallery() {
    if (!galleryRevealed) {
        galleryRevealed = true;
        
        // Cambiar texto del botón
        galleryBtn.innerHTML = `
            <div class="heart-pulse"></div>
            <i class="fas fa-heart"></i>
            <span>Nuestros Momentos Especiales</span>
        `;
        
        // Mostrar visor de fotos con animación
        setTimeout(() => {
            photoViewer.classList.add('active');
            
            // Inicializar galería
            initGallery();
            
            // Hacer scroll suave a la galería
            setTimeout(() => {
                document.querySelector('.gallery-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
            
            // Crear efecto de confeti de corazones
            createHeartConfetti();
        }, 300);
    }
}

// Inicializar galería
function initGallery() {
    // Mostrar total de fotos
    totalPhotosEl.textContent = photos.length;
    
    // Crear puntos de navegación
    createPhotoDots();
    
    // Mostrar primera foto
    showPhoto(0, 'fade-in');
}

// Crear puntos de navegación
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

// Mostrar foto específica con animación
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
        // Mostrar placeholder de error
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231a1a2e"/><text x="200" y="150" font-family="Arial" font-size="20" fill="%23ff4081" text-anchor="middle">Imagen no encontrada</text></svg>';
    };
    
    // Limpiar display y agregar nueva imagen
    photoDisplay.innerHTML = '';
    photoDisplay.appendChild(img);
    
    // Actualizar información
    photoTitle.textContent = photo.title;
    photoCaption.textContent = photo.caption;
    
    // Crear efecto de corazón
    createPhotoHeartEffect();
    
    // Crear efecto de corazones flotantes
    createFloatingHearts();
}

// Navegar a foto anterior
function prevPhoto() {
    if (currentPhotoIndex > 0) {
        showPhoto(currentPhotoIndex - 1, 'slide-right');
    } else {
        // Si es la primera, ir a la última (loop)
        showPhoto(photos.length - 1, 'slide-right');
    }
}

// Navegar a siguiente foto
function nextPhoto() {
    if (currentPhotoIndex < photos.length - 1) {
        showPhoto(currentPhotoIndex + 1, 'slide-left');
    } else {
        // Si es la última, ir a la primera (loop)
        showPhoto(0, 'slide-left');
    }
}

// Efecto de corazón para fotos
function createPhotoHeartEffect() {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart" style="color:#ff4081;"></i>';
    heart.style.position = 'absolute';
    heart.style.fontSize = '24px';
    heart.style.zIndex = '1000';
    heart.style.pointerEvents = 'none';
    heart.style.opacity = '0';
    
    const rect = photoDisplay.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width/2}px`;
    heart.style.top = `${rect.top + rect.height/2}px`;
    
    document.body.appendChild(heart);
    
    const animation = heart.animate([
        { 
            transform: 'translateY(0) scale(1)', 
            opacity: 1 
        },
        { 
            transform: 'translateY(-40px) scale(1.4)', 
            opacity: 0 
        }
    ], {
        duration: 1200,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
    };
}

// Crear corazones flotantes alrededor de la foto
function createFloatingHearts() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart" style="color:#ff4081;"></i>';
            heart.style.position = 'absolute';
            heart.style.fontSize = '16px';
            heart.style.zIndex = '999';
            heart.style.pointerEvents = 'none';
            heart.style.opacity = '0';
            
            const rect = photoDisplay.getBoundingClientRect();
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;
            
            heart.style.left = `${startX}px`;
            heart.style.top = `${startY}px`;
            
            document.body.appendChild(heart);
            
            const animation = heart.animate([
                { 
                    transform: 'translate(0, 0) scale(1) rotate(0deg)', 
                    opacity: 0.8 
                },
                { 
                    transform: `translate(${Math.random() * 60 - 30}px, ${-40 - Math.random() * 30}px) scale(1.3) rotate(${180 + Math.random() * 180}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 1500,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            };
        }, i * 200);
    }
}

// Crear confeti de corazones al mostrar la galería
function createHeartConfetti() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            heart.style.position = 'fixed';
            heart.style.fontSize = '20px';
            heart.style.zIndex = '1000';
            heart.style.pointerEvents = 'none';
            heart.style.opacity = '0';
            
            // Posición aleatoria en la parte superior
            const startX = Math.random() * window.innerWidth;
            
            heart.style.left = `${startX}px`;
            heart.style.top = '0px';
            
            // Color aleatorio rosa/rojo
            const colors = ['#ff4081', '#e91e63', '#c2185b', '#ff80ab'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.color = color;
            
            document.body.appendChild(heart);
            
            const animation = heart.animate([
                { 
                    transform: 'translateY(0) scale(1) rotate(0deg)', 
                    opacity: 0.8 
                },
                { 
                    transform: `translateY(${window.innerHeight}px) translateX(${Math.random() * 100 - 50}px) scale(1.2) rotate(${360 + Math.random() * 360}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            animation.onfinish = () => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            };
        }, i * 100);
    }
}

// Event Listeners
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
    alert("Error al cargar el archivo de audio. Verifica que el archivo MP3 esté en la carpeta assets/audio/");
});
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
galleryBtn.addEventListener('click', showGallery);
prevPhotoBtn.addEventListener('click', prevPhoto);
nextPhotoBtn.addEventListener('click', nextPhoto);

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (galleryRevealed) {
        if (e.key === 'ArrowLeft') {
            prevPhoto();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        }
    }
});

// Inicializar
initConfig();
createHearts();

// Instrucciones para el usuario
console.log(`
=== INSTRUCCIONES PARA USAR RECURSOS LOCALES ===

1. ESTRUCTURA DE CARPETAS NECESARIA:
   tu-web/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── assets/
   │   ├── audio/
   │   │   └── nuestra-cancion.mp3
   │   └── images/
   │       ├── album-cover.jpg
   │       ├── foto1.jpg
   │       ├── foto2.jpg
   │       └── foto3.jpg

2. PASOS A SEGUIR:
   a) Crea las carpetas 'assets/audio/' y 'assets/images/'
   b) Coloca tu archivo MP3 en assets/audio/
   c) Coloca tus fotos en assets/images/
   d) Cambia los nombres en las configuraciones si es necesario

3. CONFIGURAR LA CANCIÓN (en script.js):
   - Modifica 'songConfig.title' con el nombre de tu canción
   - Modifica 'songConfig.artist' con el nombre del artista
   - Ajusta los tiempos en 'songConfig.lyrics' según tu canción

4. CONFIGURAR LAS FOTOS (en script.js):
   - Modifica el array 'photos' con tus imágenes
   - Usa rutas relativas: 'assets/images/nombre-foto.jpg'
   - Agrega títulos y descripciones personales

5. FORMATOS RECOMENDADOS:
   - Audio: MP3 (compatible con todos los navegadores)
   - Imágenes: JPG o PNG (600-800px de ancho)
   - Peso: Optimiza archivos para carga rápida

6. PRUEBAS:
   - Abre index.html en tu navegador
   - Verifica que la canción se reproduzca
   - Comprueba que las imágenes se carguen
   - Ajusta tiempos de letras si es necesario
`);