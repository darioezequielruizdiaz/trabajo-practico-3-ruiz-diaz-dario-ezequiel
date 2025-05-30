const API = "https://dragonball-api.com/api/characters?name="
const API_BASE = 'https://dragonball-api.com/api/characters';

const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const container = document.getElementById('charactersContainer');
const loader = document.getElementById('loader');

let currentPage = 1;
let isLoading = false;
let isLastPage = false;


resetBtn.addEventListener('click', async () => {
  container.innerHTML = ''; // Limpia resultados

  currentPage = 1;
  isLoading = false;
  isLastPage = false;

  await getAllCharacters();
});

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim().toLowerCase();
  container.innerHTML = ''; // Limpia resultados

  if (!query) {
    showMessage('Por favor ingresa un nombre para buscar.', 'warning');
    return;
  }

  isLoading = true;
  loader.classList.remove('d-none');
  loader.classList.add('d-block');

  try {
    const response = await fetch(`${API}${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const characters = await response.json();

    console.log(characters)

    if (!Array.isArray(characters) || characters.length === 0) {
      showMessage(`No se encontraron personajes con el nombre "${query}"`, 'info');
      return;
    }

    // Renderizar personajes encontrados
    renderCharacters(characters);

  } catch (error) {
    showMessage('Ocurrió un error al consultar la API. Intenta nuevamente', 'danger');
    console.error(error);
  } finally {
    isLoading = false;
    loader.classList.remove('d-block');
    loader.classList.add('d-none');
  }

});


const showMessage = (message, type = 'info', duration = 2000) => {
  const alertContainer = document.getElementById('alertContainer');

  // Alerta base
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} shadow-sm border-0 rounded-3 py-2 px-3 main-alert text-center`;
  alert.role = 'alert';
  alert.innerText = message;


  alertContainer.innerHTML = '';
  alertContainer.appendChild(alert);

  // Forzar reflow para el cambio
  void alert.offsetWidth;

  // Agregar clase para mostrar el fade
  alert.classList.add('show');

  // Coloco el fade y remuevo despues del tiempo definido
  setTimeout(() => {
    alert.classList.remove('show');
    alert.classList.add('hide');
    setTimeout(() => {
      alert.remove();
    }, 500);
  }, duration);
}


const getAllCharacters = async (page = 1) => {
  if (isLoading || isLastPage) return;

  isLoading = true;
  loader.classList.remove('d-none');
  loader.classList.add('d-block');
  try {
    const response = await fetch(`${API_BASE}?page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.items) || data.items.length === 0) {
      isLastPage = true;
      return;
    }

    renderCharacters(data.items, page > 1); // El segundo parámetro indica si se debe agregar o reemplazar
    currentPage++;
  } catch (error) {
    showMessage('Ocurrió un error al obtener los personajes.', 'danger');
    console.error(error);
  } finally {
    isLoading = false;
    loader.classList.remove('d-block');
    loader.classList.add('d-none');
  }
};


const renderCharacters = (characters, append = false) => {
  if (!append) container.innerHTML = '';

  characters.forEach(character => {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3';

    const raceClass = character.race ? character.race.toLowerCase().replace(/\s+/g, '-') : 'unknown';

    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 ${raceClass}">
        <img src="${character.image}" class="card-img-top" alt="${character.name}">
        <div class="card-gradient"></div>
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
          <p class="card-text">${character.race} • ${character.gender}</p>
        </div>
        <button type="button" class="border-0 rounded-0 py-2 ${raceClass} text-white" data-id=${character.id}>
          Mas información
        </button>
      </div>
    `;

    container.appendChild(col);
  });
};



window.addEventListener('DOMContentLoaded', getAllCharacters);
window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

  if (nearBottom) {
    getAllCharacters(currentPage);
  }
});

