
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

// A constante abaixo pode receber o link de compartilhamento da planilha do Google Sheets
const TRABALHOS_URL = 'https://docs.google.com/spreadsheets/d/1D5DVJlqB3xXgKT9eN1uun5yG3LurOGqc48bmvWnVOc4/edit?usp=sharing';

function converterSheetParaCsv(url) {
    const idMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!idMatch) return url;
    const id = idMatch[1];
    let gid = '0';
    const gidMatch = url.match(/[?&#]gid=([0-9]+)/);
    if (gidMatch) gid = gidMatch[1];
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = (values[i] || '').trim();
        });
        return obj;
    });
}

function renderTrabalhos(trabalhos) {
    const container = document.getElementById('lista-trabalhos');
    if (!container) return;
    if (!trabalhos.length) {
        container.innerHTML = '<p>Nenhum trabalho publicado no momento.</p>';
        return;
    }
    container.innerHTML = '';
    const porCurso = trabalhos.reduce((acc, t) => {
        const curso = t.curso || 'Curso Não Especificado';
        (acc[curso] = acc[curso] || []).push(t);
        return acc;
    }, {});
    Object.keys(porCurso).forEach(curso => {
        const divCurso = document.createElement('div');
        divCurso.innerHTML = `<h3>${curso}</h3>`;
        porCurso[curso].forEach(trab => {
            const item = document.createElement('div');
            item.classList.add('trabalho-item');
            item.innerHTML = `
                <h4>${trab.tituloTrabalho || 'Título não disponível'}</h4>
                <p><strong>Autor:</strong> ${trab.nomeAluno || 'Autor não informado'}</p>
                <p><strong>Publicado em:</strong> ${trab.dataPublicacao || 'Data não informada'}</p>
                <p><a href="${trab.linkTrabalhoDrive}" target="_blank" rel="noopener noreferrer">Visualizar Trabalho (PDF)</a></p>
            `;
            divCurso.appendChild(item);
        });
        container.appendChild(divCurso);
    });
}

function carregarTrabalhos() {
    fetch(converterSheetParaCsv(TRABALHOS_URL))
        .then(r => r.text())
        .then(csv => {
            const dados = parseCSV(csv);
            const filtrados = dados.filter(t => t.linkTrabalhoDrive);
            renderTrabalhos(filtrados);
        })
        .catch(err => {
            console.error('Erro ao buscar trabalhos:', err);
            const container = document.getElementById('lista-trabalhos');
            if (container) {
                container.innerHTML = '<p>Não foi possível carregar os trabalhos.</p>';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarTrabalhos();
});


