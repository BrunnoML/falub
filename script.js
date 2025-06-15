function inicializarMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            // Para depuração, adicione um console.log aqui:
            console.log('Menu toggle clicado, navList classes:', navList.className);
        });
    } else {
        if (!menuToggle) {
            console.error('Elemento com ID "menu-toggle" não encontrado.');
        }
        if (!navList) {
            console.error('Elemento com ID "nav-list" não encontrado.');
        }
    }
}

// Outro código em script.js, se houver...
document.addEventListener('DOMContentLoaded', function() {
    // Código que precisa que o DOM básico esteja pronto, mas não necessariamente o header dinâmico
});