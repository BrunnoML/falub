// filepath: script.js
function inicializarHeader() {
    const menuToggle = document.getElementById('menu-toggle'); // Exemplo
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Lógica do menu toggle
            console.log('Menu toggle clicado');
        });
    }
    // Outras inicializações do header
}

// Se houver código que não depende do header, pode ficar fora ou dentro de DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Código que não depende de elementos carregados dinamicamente pelo fetch
});