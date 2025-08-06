// script.js

// REMOVA toda a lógica de pegar 'authToken' do localStorage.
// REMOVA o redirecionamento `window.location.href = '/login.html'`. Django faz isso por nós.
// REMOVA o cabeçalho `Authorization: Bearer ...`.

// Adicione esta função para pegar o token CSRF do cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// --- Exemplo de como suas chamadas FETCH devem ficar ---

// Carregar Eventos
async function loadEventsFromDB() {
    // Não precisa de cabeçalho de autorização!
    const response = await fetch('/api/events/');
    state.events = await response.json();
    render();
}

// Criar Evento
// ...
response = await fetch('/api/events/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken // ADICIONE ESTE CABEÇALHO
    },
    body: JSON.stringify(eventData)
});
// ...

// Deletar Evento
// ...
const response = await fetch(`/api/events/${state.eventIdToDelete}/`, {
    method: 'DELETE',
    headers: {
        'X-CSRFToken': csrftoken // ADICIONE ESTE CABEÇALHO
    }
});
// ...