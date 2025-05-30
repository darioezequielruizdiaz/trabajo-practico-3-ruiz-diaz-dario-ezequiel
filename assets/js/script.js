const API = "https://dragonball-api.com/api/characters?name="

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';

    if (!query) {
        showMessage('Por favor ingresa un nombre para buscar.', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API}${query}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const characters = await response.json();

        if (!Array.isArray(characters) || characters.length === 0) {
            showMessage(`No se encontraron personajes con el nombre "${query}"`, 'info');
            return;
        }

    } catch (error) {
        showMessage('Ocurrió un error al consultar la API. Intenta nuevamente', 'danger');
        console.error(error);
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

