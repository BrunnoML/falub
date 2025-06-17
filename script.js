function inicializarMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
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

// Link da planilha pública, aba RepositorioFalub (gid=0)
const TRABALHOS_URL = 'https://docs.google.com/spreadsheets/d/1D5DVJlqB3xXgKT9eN1uun5yG3LurOGqc48bmvWnVOc4/export?format=csv&gid=0';

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
        const curso = t.Curso || 'Curso Não Especificado';
        (acc[curso] = acc[curso] || []).push(t);
        return acc;
    }, {});
    Object.keys(porCurso).forEach(curso => {
        const divCurso = document.createElement('div');
        divCurso.innerHTML = `<h3>${curso}</h3>`;
        porCurso[curso].forEach(trab => {
            if (trab.Status !== 'Publicado') return;
            // Divide os nomes dos alunos por vírgula ou quebra de linha
            const nomes = (trab.NomeAluno || '')
                .split(/,|\n/)
                .map(n => n.trim())
                .filter(n => n);
            const nomesHtml = nomes.length
                ? `<ul style="margin: 0 0 8px 0; padding-left: 20px;">${nomes.map(n => `<li>${n}</li>`).join('')}</ul>`
                : 'Autor(es) não informado(s)';
            const item = document.createElement('div');
            item.classList.add('trabalho-item');
            item.innerHTML = `
                <h4>${trab.TituloTrabalho || 'Título não disponível'}</h4>
                <p><strong>Autores:</strong></p>
                ${nomesHtml}
                <p><strong>Orientador(a):</strong> ${trab.NomeOrientador || 'Não informado'}</p>
                <p><strong>Publicado em:</strong> ${trab.DataPublicacao || 'Data não informada'}</p>
                <p><a href="${trab.LinkTrabalhoDrive}" target="_blank" rel="noopener noreferrer">Visualizar Trabalho (PDF)</a></p>
            `;
            divCurso.appendChild(item);
        });
        container.appendChild(divCurso);
    });
}

function carregarTrabalhos() {
    fetch(TRABALHOS_URL)
        .then(r => r.text())
        .then(csv => {
            const dados = parseCSV(csv);
            const filtrados = dados.filter(t => t.Status === 'Publicado' && t.LinkTrabalhoDrive);
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