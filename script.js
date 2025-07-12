const izakayaData = [
    {
        id: 1,
        name: "やきとり大吉 京橋店",
        lat: 34.6952,
        lng: 135.5267,
        address: "大阪府大阪市都島区東野田町2-9-7",
        rating: 4.2,
        priceRange: "1000円〜",
        description: "昭和レトロな雰囲気の焼鳥屋。1000円で生ビール3杯＋焼鳥5本のセットが人気！",
        menu: [
            {
                name: "ベロベロセット",
                price: "1000円",
                description: "生ビール3杯＋焼鳥5本（もも、ねぎま、つくね、レバー、皮）"
            },
            {
                name: "酎ハイ飲み放題",
                price: "980円",
                description: "60分間酎ハイ飲み放題（レモン、ウメ、カルピス）"
            }
        ]
    },
    {
        id: 2,
        name: "立ち飲み 京橋酒場",
        lat: 34.6948,
        lng: 135.5275,
        address: "大阪府大阪市都島区片町1-5-13",
        rating: 4.0,
        priceRange: "800円〜",
        description: "立ち飲みスタイルの気軽な酒場。ハイボール5杯1000円が名物！",
        menu: [
            {
                name: "ハイボール5杯セット",
                price: "1000円",
                description: "角ハイボール5杯＋お通し付き"
            },
            {
                name: "日本酒3合セット",
                price: "950円",
                description: "地酒3合＋おつまみ盛り合わせ"
            }
        ]
    },
    {
        id: 3,
        name: "大衆酒場 京橋横丁",
        lat: 34.6945,
        lng: 135.5280,
        address: "大阪府大阪市都島区片町2-3-8",
        rating: 4.3,
        priceRange: "900円〜",
        description: "昔ながらの大衆酒場。焼酎ボトル1本1000円で飲み放題！",
        menu: [
            {
                name: "焼酎ボトル飲み放題",
                price: "1000円",
                description: "芋焼酎または麦焼酎1本＋氷・水・お湯付き"
            },
            {
                name: "生ビール＋餃子セット",
                price: "980円",
                description: "生ビール中ジョッキ3杯＋餃子1人前"
            }
        ]
    },
    {
        id: 4,
        name: "ホルモン酒場 京橋本店",
        lat: 34.6955,
        lng: 135.5285,
        address: "大阪府大阪市都島区東野田町1-8-15",
        rating: 4.1,
        priceRange: "1000円〜",
        description: "新鮮なホルモンが自慢の酒場。1000円でホルモン＋ビールのセットが楽しめる！",
        menu: [
            {
                name: "ホルモン＋ビールセット",
                price: "1000円",
                description: "新鮮ホルモン盛り合わせ＋生ビール2杯"
            },
            {
                name: "レモンサワー飲み放題",
                price: "990円",
                description: "90分間レモンサワー飲み放題"
            }
        ]
    },
    {
        id: 5,
        name: "串カツ居酒屋 だるま",
        lat: 34.6940,
        lng: 135.5270,
        address: "大阪府大阪市都島区片町1-2-20",
        rating: 4.4,
        priceRange: "950円〜",
        description: "大阪名物串カツの老舗。1000円で串カツ10本＋ビールのセットが人気！",
        menu: [
            {
                name: "串カツ10本＋ビールセット",
                price: "1000円",
                description: "串カツ10本（豚、牛、エビ、野菜など）＋生ビール中1杯"
            },
            {
                name: "ハイボール飲み放題",
                price: "950円",
                description: "60分間ハイボール飲み放題＋お通し"
            }
        ]
    }
];

let map;
let markers = [];
let selectedIzakaya = null;

function initMap() {
    const kyobashi = [34.6950, 135.5275];
    
    map = L.map('map').setView(kyobashi, 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

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
