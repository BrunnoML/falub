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
// URL da planilha publicada (CSV ou JSON gerado por um Apps Script)
const TRABALHOS_URL = 'PASTE_PUBLISHED_SHEET_URL_HERE';

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const cols = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = (cols[i] || '').trim();
        });
        return obj;
    });
}

function carregarTrabalhos() {
    const container = document.getElementById('lista-trabalhos');
    if (!container) return;

    fetch(TRABALHOS_URL)
        .then(r => r.text())
        .then(text => {
            let rows;
            try {
                rows = JSON.parse(text);
            } catch (e) {
                rows = parseCSV(text);
            }

            if (rows.data) rows = rows.data;

            const publicados = rows.filter(r => r.Status === 'Publicado');

            const porCurso = publicados.reduce((acc, row) => {
                const curso = row.Curso || 'Outro';
                if (!acc[curso]) acc[curso] = [];
                acc[curso].push({
                    Ano: row.Ano,
                    TituloTrabalho: row.TituloTrabalho,
                    NomeAluno: row.NomeAluno,
                    LinkTrabalhoDrive: row.LinkTrabalhoDrive
                });
                return acc;
            }, {});

            container.innerHTML = '';
            Object.keys(porCurso).sort().forEach(curso => {
                const group = document.createElement('div');
                group.classList.add('curso-group');
                const title = document.createElement('h3');
                title.textContent = curso;
                group.appendChild(title);

                porCurso[curso]
                    .sort((a, b) => Number(b.Ano) - Number(a.Ano))
                    .forEach(item => {
                        const div = document.createElement('div');
                        div.classList.add('trabalho-item');
                        div.innerHTML = `
                            <h4>${item.TituloTrabalho}</h4>
                            <p><strong>Ano:</strong> ${item.Ano}</p>
                            <p><strong>Aluno:</strong> ${item.NomeAluno}</p>
                            <p><a href="${item.LinkTrabalhoDrive}" target="_blank" rel="noopener noreferrer">Visualizar Trabalho</a></p>`;
                        group.appendChild(div);
                    });

                container.appendChild(group);
            });
        })
        .catch(err => {
            console.error('Erro ao buscar trabalhos:', err);
            container.innerHTML = '<p>Não foi possível carregar os trabalhos.</p>';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Código que precisa que o DOM básico esteja pronto, mas não necessariamente o header dinâmico
    if (document.getElementById('lista-trabalhos')) {
        carregarTrabalhos();
    }
});