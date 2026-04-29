// Lógica de registro de clientes con reglas de la industria (localStorage demo)
const CLIENTS_KEY = 'biomasa_clients_v1';

function loadClients() {
  return JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]');
}
function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

function validateRutOrId(value) {
  // Validación simple: alfanumérico, 6-12 caracteres; para RUT chileno se puede mejorar
  const v = value.replace(/\./g,'').replace(/-/g,'').trim();
  return /^[0-9kK]{6,12}$/.test(v);
}

function validatePhone(value) {
  // Acepta +código o 9 dígitos locales; ejemplo +56912345678 o 912345678
  return /^(\+\d{1,3}\s?)?(\d{8,12})$/.test(value.replace(/\s+/g,''));
}

function renderClientsTable() {
  const tbody = document.querySelector('#clientsTable tbody');
  tbody.innerHTML = '';
  const clients = loadClients();
  clients.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.id}</td>
      <td>${c.phone}</td>
      <td>${c.address}</td>
      <td>${c.volume}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${c.id}">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function clearForm() {
  const form = document.getElementById('clientForm');
  form.reset();
  form.classList.remove('was-validated');
}

function deleteClient(id) {
  if (!confirm('Eliminar cliente?')) return;
  const clients = loadClients().filter(c => c.id !== id);
  saveClients(clients);
  renderClientsTable();
}

document.addEventListener('DOMContentLoaded', () => {
  renderClientsTable();

  document.getElementById('clearClient').addEventListener('click', clearForm);

  document.getElementById('clientsTable').addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('btn-delete')) deleteClient(id);
  });

  document.getElementById('clientForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const name = document.getElementById('clientName').value.trim();
    const id = document.getElementById('clientId').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const propertyType = document.getElementById('clientPropertyType').value;
    const volume = document.getElementById('clientVolume').value;
    const consent = document.getElementById('clientConsent').checked;

    // Validaciones de industria
    let valid = true;
    if (!name) valid = false;
    if (!validateRutOrId(id)) valid = false;
    if (!validatePhone(phone)) valid = false;
    if (!address) valid = false;
    if (!propertyType) valid = false;
    if (!volume) valid = false;
    if (!consent) valid = false;

    if (!valid) {
      form.classList.add('was-validated');
      return;
    }

    // Guardar cliente
    const clients = loadClients();
    // Evitar duplicados por ID
    if (clients.some(c => c.id === id)) {
      alert('Ya existe un cliente con ese documento.');
      return;
    }

    clients.push({
      name, id, phone, email, address, propertyType, volume, consent, createdAt: new Date().toISOString()
    });
    saveClients(clients);
    renderClientsTable();
    clearForm();
    alert('Cliente registrado correctamente.');
  });
});
