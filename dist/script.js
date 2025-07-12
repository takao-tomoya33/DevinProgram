const API_BASE_URL = 'https://app-quvmpjvy.fly.dev';

let izakayaData = [];
let isLoading = false;

let map;
let markers = [];
let selectedIzakaya = null;

async function fetchIzakayaData() {
    try {
        isLoading = true;
        showLoadingState();
        
        const response = await fetch(`${API_BASE_URL}/api/izakayas`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        izakayaData = data.izakayas || [];
        
        isLoading = false;
        hideLoadingState();
        
        return izakayaData;
    } catch (error) {
        console.error('Failed to fetch izakaya data:', error);
        isLoading = false;
        hideLoadingState();
        showErrorState();
        return [];
    }
}

function showLoadingState() {
    const container = document.getElementById('izakaya-cards');
    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">🍻 居酒屋データを読み込み中...</div>';
}

function hideLoadingState() {
}

function showErrorState() {
    const container = document.getElementById('izakaya-cards');
    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff6b6b;">❌ データの読み込みに失敗しました。しばらくしてから再度お試しください。</div>';
}

function addMarkersToMap() {
    markers.forEach(({ marker }) => {
        map.removeLayer(marker);
    });
    markers = [];

    izakayaData.forEach(izakaya => {
        const customIcon = L.divIcon({
            html: `<div style="background: #ff6b6b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🍻</div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker([izakaya.lat, izakaya.lng], { icon: customIcon })
            .addTo(map)
            .bindTooltip(izakaya.name, { permanent: false, direction: 'top' });

        marker.on('click', () => {
            selectIzakaya(izakaya.id);
        });

        markers.push({ marker, izakaya });
    });
}

async function initMap() {
    const kyobashi = [34.6950, 135.5275];
    
    map = L.map('map').setView(kyobashi, 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    await fetchIzakayaData();
    addMarkersToMap();
    displayIzakayaList();
}

function displayIzakayaList(filteredData = izakayaData) {
    const container = document.getElementById('izakaya-cards');
    container.innerHTML = '';

    filteredData.forEach(izakaya => {
        const card = document.createElement('div');
        card.className = 'izakaya-card';
        card.onclick = () => selectIzakaya(izakaya.id);
        
        card.innerHTML = `
            <h3>${izakaya.name}</h3>
            <div class="price">${izakaya.priceRange}</div>
            <div class="address">${izakaya.address}</div>
            <div class="rating">⭐ ${izakaya.rating}</div>
        `;
        
        container.appendChild(card);
    });
}

function selectIzakaya(id) {
    selectedIzakaya = izakayaData.find(izakaya => izakaya.id === id);
    
    markers.forEach(({ marker, izakaya }) => {
        if (izakaya.id === id) {
            const selectedIcon = L.divIcon({
                html: `<div style="background: #667eea; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);">🍻</div>`,
                className: 'custom-marker selected',
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            });
            marker.setIcon(selectedIcon);
        } else {
            const normalIcon = L.divIcon({
                html: `<div style="background: #ff6b6b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🍻</div>`,
                className: 'custom-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            marker.setIcon(normalIcon);
        }
    });

    document.querySelectorAll('.izakaya-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const cards = document.querySelectorAll('.izakaya-card');
    const selectedCard = cards[izakayaData.findIndex(izakaya => izakaya.id === id)];
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    map.setView([selectedIzakaya.lat, selectedIzakaya.lng], 18);

    showIzakayaDetail();
}

function showIzakayaDetail() {
    const listSection = document.getElementById('izakaya-list');
    const detailSection = document.getElementById('izakaya-detail');
    const detailContent = document.getElementById('detail-content');

    listSection.style.display = 'none';
    detailSection.style.display = 'block';

    const menuHtml = selectedIzakaya.menu.map(item => `
        <div class="menu-item">
            <h4>${item.name}</h4>
            <span class="price">${item.price}</span>
            <div class="description">${item.description}</div>
        </div>
    `).join('');

    detailContent.innerHTML = `
        <div class="detail-header">
            <h2>${selectedIzakaya.name}</h2>
        </div>
        <div class="detail-info">
            <p><strong>📍 住所:</strong> ${selectedIzakaya.address}</p>
            <p><strong>⭐ 評価:</strong> ${selectedIzakaya.rating}</p>
            <p><strong>💰 価格帯:</strong> ${selectedIzakaya.priceRange}</p>
            <p><strong>📝 説明:</strong> ${selectedIzakaya.description}</p>
        </div>
        <div class="menu-section">
            <h3>🍻 1000円ベロベロメニュー</h3>
            ${menuHtml}
        </div>
    `;
}

function showIzakayaList() {
    const listSection = document.getElementById('izakaya-list');
    const detailSection = document.getElementById('izakaya-detail');

    listSection.style.display = 'block';
    detailSection.style.display = 'none';

    markers.forEach(({ marker }) => {
        const normalIcon = L.divIcon({
            html: `<div style="background: #ff6b6b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🍻</div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        marker.setIcon(normalIcon);
    });

    document.querySelectorAll('.izakaya-card').forEach(card => {
        card.classList.remove('selected');
    });

    map.setView([34.6950, 135.5275], 16);

    selectedIzakaya = null;
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredData = izakayaData.filter(izakaya => 
            izakaya.name.toLowerCase().includes(query) ||
            izakaya.address.toLowerCase().includes(query) ||
            izakaya.description.toLowerCase().includes(query)
        );
        displayIzakayaList(filteredData);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    initMap();
    
    document.getElementById('back-btn').addEventListener('click', showIzakayaList);
});
