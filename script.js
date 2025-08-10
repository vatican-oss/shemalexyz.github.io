const searchInput = document.getElementById('search');
const empty = document.getElementById('empty');
const container = document.getElementById('videos-container');

let allVideos = [];
let filteredVideos = [];
let currentPage = 1;
const itemsPerPage = 60;

function normalize(s) {
  return s.trim().toLowerCase();
}

function renderVideosPage(page = 1) {
  container.innerHTML = '';

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const videosToShow = filteredVideos.slice(start, end);

  if (videosToShow.length === 0) {
    empty.style.display = '';
    container.innerHTML = '';
    renderPagination(0);
    return;
  } else {
    empty.style.display = 'none';
  }

  videosToShow.forEach(video => {
    const div = document.createElement('div');
    div.className = 'th';
    div.setAttribute('data-title', video.title);

    div.innerHTML = `
      <a href="#" class="thumb-link" onclick="openLinks(event, '${video.link}')">
        <div class="thumb">
          <img alt="Miniatura ${video.title}" src="${video.thumb}" loading="lazy">
          <span class="time-badge">${video.duration || "5:00"}</span>
        </div>
        <h3 class="title">${video.title}</h3>
      </a>
    `;
    container.appendChild(div);
  });

  renderPagination(Math.ceil(filteredVideos.length / itemsPerPage));
}

function renderPagination(totalPages) {
  // Borra paginación vieja si existe
  let pagination = document.querySelector('.pagination');
  if (pagination) pagination.remove();

  if (totalPages <= 1) return; // No paginación si solo hay 1 página o menos

  pagination = document.createElement('nav');
  pagination.className = 'pagination';
  pagination.setAttribute('aria-label', 'Paginación de vídeos');

  const ul = document.createElement('ul');

  // Botón "Anterior"
  const prevLi = document.createElement('li');
  if (currentPage > 1) {
    const prevA = document.createElement('a');
    prevA.href = '#';
    prevA.innerHTML = '&laquo;';
    prevA.setAttribute('aria-label', 'Página anterior');
    prevA.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage--;
      renderVideosPage(currentPage);
    });
    prevLi.appendChild(prevA);
  } else {
    const prevSpan = document.createElement('strong');
    prevSpan.innerHTML = '&laquo;';
    prevLi.appendChild(prevSpan);
  }
  ul.appendChild(prevLi);

  // Botones números páginas
  for (let p = 1; p <= totalPages; p++) {
    const li = document.createElement('li');
    if (p === currentPage) {
      const strong = document.createElement('strong');
      strong.textContent = p;
      strong.setAttribute('aria-current', 'page');
      li.appendChild(strong);
    } else {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = p;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = p;
        renderVideosPage(currentPage);
      });
      li.appendChild(a);
    }
    ul.appendChild(li);
  }

  // Botón "Siguiente"
  const nextLi = document.createElement('li');
  if (currentPage < totalPages) {
    const nextA = document.createElement('a');
    nextA.href = '#';
    nextA.innerHTML = '&raquo;';
    nextA.setAttribute('aria-label', 'Página siguiente');
    nextA.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage++;
      renderVideosPage(currentPage);
    });
    nextLi.appendChild(nextA);
  } else {
    const nextSpan = document.createElement('strong');
    nextSpan.innerHTML = '&raquo;';
    nextLi.appendChild(nextSpan);
  }
  ul.appendChild(nextLi);

  pagination.appendChild(ul);
  container.parentNode.insertBefore(pagination, container.nextSibling);
}

function filterCards() {
  const q = normalize(searchInput.value);
  filteredVideos = allVideos.filter(video =>
    normalize(video.title).includes(q)
  );
  currentPage = 1; // reset pag a 1 al filtrar
  renderVideosPage(currentPage);
}

searchInput.addEventListener('input', filterCards);

function openLinks(event, originalUrl) {
  event.preventDefault();
  const monetizationUrl = "https://www.profitableratecpm.com/vbrhcw5y59?key=92490da6868c4cec66fa4cc5ee40f1df";
  window.open(monetizationUrl, '_blank', 'noopener,noreferrer');
  window.location.href = originalUrl;
}

// Cargar JSON
fetch('videos.json')
  .then(res => res.json())
  .then(data => {
    allVideos = data;
    filteredVideos = allVideos;
    renderVideosPage(currentPage);
  })
  .catch(err => {
    console.error("Error cargando videos.json:", err);
  });
