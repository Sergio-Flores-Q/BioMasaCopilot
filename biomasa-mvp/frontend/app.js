// BioMasa MVP - app.js (localStorage demo)
// Maneja UI, almacenamiento local y mapa Leaflet

const STORAGE_KEY = 'biomasa_points_v1';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function saveToStorage(points){ localStorage.setItem(STORAGE_KEY, JSON.stringify(points)); }
function loadFromStorage(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }

let points = loadFromStorage();
let map, markersLayer;

function initMap(){
  map = L.map('map').setView([-33.45, -70.6667], 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  map.on('click', (e) => {
    const {lat, lng} = e.latlng;
    document.getElementById('lat').value = lat.toFixed(6);
    document.getElementById('lng').value = lng.toFixed(6);
  });

  renderMarkers();
}

function renderMarkers(filterType = ''){
  markersLayer.clearLayers();
  points.filter(p => !filterType || p.wasteType === filterType)
        .forEach(p => {
          if (p.lat && p.lng) {
            const m = L.marker([p.lat, p.lng]).bindPopup(`<b>${p.name}</b><br>${p.address || ''}<br><small>${p.wasteType} - ${p.status}</small>`);
            markersLayer.addLayer(m);
          }
        });
}

function renderTable(filterType = ''){
  const tbody = document.querySelector('#pointsTable tbody');
  tbody.innerHTML = '';
  points.filter(p => !filterType || p.wasteType === filterType)
        .forEach(p => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${p.name}</td>
            <td>${p.address || ''}</td>
            <td>${p.wasteType}</td>
            <td>${p.status}</td>
            <td>${p.lat ?? ''}</td>
            <td>${p.lng ?? ''}</td>
            <td>
              <button class="btn btn-sm btn-outline-success btn-edit" data-id="${p.id}">Editar</button>
              <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${p.id}">Eliminar</button>
            </td>`;
          tbody.appendChild(tr);
        });
}

function savePoint(e){
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

  const id = form.dataset.editId || uid();
  const point = {
    id,
    name: document.getElementById('name').value.trim(),
    address: document.getElementById('address').value.trim(),
    wasteType: document.getElementById('wasteType').value,
    status: document.getElementById('status').value,
    lat: parseFloat(document.getElementById('lat').value) || null,
    lng: parseFloat(document.getElementById('lng').value) || null,
    createdAt: new Date().toISOString()
  };

  const idx = points.findIndex(p => p.id === id);
  if (idx >= 0) points[idx] = point; else points.push(point);

  saveToStorage(points);
  form.reset();
  delete form.dataset.editId;
  form.classList.remove('was-validated');
  renderTable(document.getElementById('filterType').value);
  renderMarkers(document.getElementById('filterType').value);
}

function startEdit(id){
  const p = points.find(x => x.id === id);
  if (!p) return;
  const form = document.getElementById('pointForm');
  form.dataset.editId = id;
  document.getElementById('name').value = p.name;
  document.getElementById('address').value = p.address;
  document.getElementById('wasteType').value = p.wasteType;
  document.getElementById('status').value = p.status;
  document.getElementById('lat').value = p.lat ?? '';
  document.getElementById('lng').value = p.lng ?? '';
  window.scrollTo({top:0, behavior:'smooth'});
}

function deletePoint(id){
  if (!confirm('Eliminar este punto?')) return;
  points = points.filter(p => p.id !== id);
  saveToStorage(points);
  renderTable(document.getElementById('filterType').value);
  renderMarkers(document.getElementById('filterType').value);
}

function exportCSV(){
  if (!points.length) { alert('No hay datos para exportar'); return; }
  const headers = ['id','name','address','wasteType','status','lat','lng','createdAt'];
  const rows = points.map(p => headers.map(h => `"${(p[h] ?? '').toString().replace(/"/g,'""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'biomasa_points.csv'; a.click();
  URL.revokeObjectURL(url);
}

function useGeolocation(){
  if (!navigator.geolocation) { alert('Geolocalización no soportada'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const {latitude, longitude} = pos.coords;
    document.getElementById('lat').value = latitude.toFixed(6);
    document.getElementById('lng').value = longitude.toFixed(6);
    map.setView([latitude, longitude], 14);
  }, err => {
    alert('No se pudo obtener ubicación: ' + err.message);
  });
}

function tableClickHandler(e){
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('btn-edit')) startEdit(id);
  if (e.target.classList.contains('btn-delete')) deletePoint(id);
}

function initUI(){
  document.getElementById('pointForm').addEventListener('submit', savePoint);
  document.getElementById('locateBtn').addEventListener('click', useGeolocation);
  document.getElementById('clearBtn').addEventListener('click', () => {
    const form = document.getElementById('pointForm');
    form.reset();
    delete form.dataset.editId;
    form.classList.remove('was-validated');
    document.getElementById('lat').value = '';
    document.getElementById('lng').value = '';
  });
  document.getElementById('pointsTable').addEventListener('click', tableClickHandler);
  document.getElementById('exportCsv').addEventListener('click', exportCSV);
  document.getElementById('clearAll').addEventListener('click', () => {
    if (!confirm('Eliminar todos los puntos?')) return;
    points = []; saveToStorage(points); renderTable(); renderMarkers();
  });
  document.getElementById('filterType').addEventListener('change', (e) => {
    renderTable(e.target.value); renderMarkers(e.target.value);
  });

  renderTable();
}

window.addEventListener('DOMContentLoaded', () => {
  initMap();
  initUI();
});
