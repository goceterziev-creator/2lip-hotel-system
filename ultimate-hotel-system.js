// 🎪 2L1P ULTIMATE HOTEL SYSTEM
class UltimateBookingSystem {
    constructor() {
        this.availableRooms = [];
        this.bookings = [];
        this.hotels = [];
        this.currentHotel = null;
        this.loadInitialData();
        this.initializeBookingForm();
    }
    
    loadInitialData() {
        this.hotels = [
            {
                id: 1,
                name: "Hotel Central Bucharest",
                location: "Букурещ, Румъния", 
                rating: 4.8,
                description: "Луксозен хотел в центъра на Букурещ"
            }
        ];
        this.loadRooms();
        this.displayHotels();
        this.displayRooms();
    }
    
    loadRooms() {
        this.availableRooms = [
            { 
                id: 1, 
                name: "Стандарт стая", 
                price: 100, 
                available: true, 
                amenities: ["WiFi", "TV", "Климатик", "Баня"],
                capacity: 2,
                hotelId: 1
            }
        ];
    }
    
    initializeBookingForm() {
        const form = document.getElementById('reservationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }
    
    handleFormSubmission() {
        const guestName = document.getElementById('guestName').value;
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const roomType = document.getElementById('roomType').value;
        
        const reservation = {
            guest: { name: guestName },
            dates: { checkIn, checkOut },
            room: roomType,
            timestamp: new Date().toISOString()
        };
        
        const success = this.makeReservation(reservation);
        
        if (success) {
            alert(`✅ Резервацията за ${guestName} е успешна!`);
            document.getElementById('reservationForm').reset();
        }
    }
    
    displayHotels() {
        const container = document.getElementById('hotelsContainer');
        if (!container) return;
        
        container.innerHTML = '<h2>🏨 Наши хотели в Румъния</h2>';
        
        this.hotels.forEach(hotel => {
            const hotelCard = document.createElement('div');
            hotelCard.className = 'hotel-card';
            hotelCard.innerHTML = `
                <h3>${hotel.name} ⭐${hotel.rating}</h3>
                <p>📍 ${hotel.location}</p>
                <p>${hotel.description}</p>
            `;
            container.appendChild(hotelCard);
        });
    }
    
    displayRooms() {
        const container = document.getElementById('roomsContainer');
        if (!container) return;
        
        container.innerHTML = '<h2>🎯 Налични стаи</h2>';
        
        this.availableRooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <h3>${room.name}</h3>
                <div class="price">${room.price} лв/нощ</div>
                <div class="amenities">${room.amenities.join(' • ')}</div>
            `;
            container.appendChild(roomCard);
        });
    }
    
    makeReservation(reservation) {
        if (!reservation.guest || !reservation.guest.name) {
            alert('❌ Моля, въведете име на гост');
            return false;
        }
        
        reservation.id = 'BK_' + Date.now();
        this.bookings.push(reservation);
        console.log('✅ Резервация добавена:', reservation);
        return true;
    }
}

// 🚀 Инициализация
const ultimateSystem = new UltimateBookingSystem();

// 🎯 Глобални функции
function showAllBookings() {
    alert('📊 Функцията за резервации ще бъде добавена скоро!');
}

function showAdminStats() {
    alert('📈 Админ панелът ще бъде добавен скоро!');
}

function searchByBudget() {
    alert('💰 Търсенето по бюджет ще бъде добавено скоро!');
}