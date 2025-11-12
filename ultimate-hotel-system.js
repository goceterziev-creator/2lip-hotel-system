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
            },
            {
                id: 2,
                name: "Transylvanian Castle Experience", 
                location: "Трансилвания, Румъния",
                rating: 4.9,
                description: "Уникален преживяване в истински замък"
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
                amenities: ["WiFi", "TV", "Климатик", "Баня", "Безплатен паркинг"],
                capacity: 2,
                hotelId: 1
            },
            { 
                id: 2, 
                name: "Луксозна стая", 
                price: 200, 
                available: true, 
                amenities: ["WiFi", "TV", "Климатик", "Джакузи", "Минибар", "Спа"],
                capacity: 2,
                hotelId: 1
            },
            { 
                id: 3, 
                name: "Семейна стая", 
                price: 150, 
                available: true, 
                amenities: ["WiFi", "TV", "Климатик", "2 спални", "Балкон", "Кухненски бокс"],
                capacity: 4,
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
        
        // Намираме цената на стаята
        const room = this.availableRooms.find(r => 
            r.name.toLowerCase().includes(roomType.toLowerCase())
        );
        const price = room ? room.price : 100;
        
        const reservation = {
            guest: { name: guestName },
            dates: { checkIn, checkOut },
            room: roomType,
            price: price,
            timestamp: new Date().toISOString()
        };
        
        const success = this.makeReservation(reservation);
        
        if (success) {
            alert(`✅ Резервацията за ${guestName} е успешна!\n💰 Цена: ${price} лв/нощ\n📅 Период: ${checkIn} до ${checkOut}`);
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
                <div class="capacity">👥 За ${room.capacity} души</div>
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
        reservation.status = 'confirmed';
        this.bookings.push(reservation);
        console.log('✅ Резервация добавена:', reservation);
        return true;
    }
    
    getBookings() {
        return this.bookings;
    }
    
    getBookingStats() {
        const totalBookings = this.bookings.length;
        const totalRevenue = this.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);
        
        return {
            totalBookings,
            totalRevenue,
            averageRevenue: totalBookings > 0 ? totalRevenue / totalBookings : 0
        };
    }
}

// 🚀 Инициализация на системата
const ultimateSystem = new UltimateBookingSystem();

// 🎯 РАБОТЕЩИ ФУНКЦИИ ЗА БУТОНИТЕ
function showAllBookings() {
    const bookings = ultimateSystem.getBookings();
    
    if (bookings.length === 0) {
        alert('📭 Все още няма направени резервации');
        return;
    }
    
    let message = '📋 ВСИЧКИ РЕЗЕРВАЦИИ:\n\n';
    bookings.forEach((booking, index) => {
        message += `${index + 1}. 👤 ${booking.guest.name}\n`;
        message += `   🏨 ${booking.room}\n`;
        message += `   💰 ${booking.price} лв/нощ\n`;
        message += `   📅 ${booking.dates.checkIn} до ${booking.dates.checkOut}\n`;
        message += `   ⏰ ${new Date(booking.timestamp).toLocaleString('bg-BG')}\n\n`;
    });
    
    alert(message);
}

function showAdminStats() {
    const stats = ultimateSystem.getBookingStats();
    
    const message = `📊 АДМИН СТАТИСТИКИ:\n
🏨 Общо резервации: ${stats.totalBookings}
💰 Общ приход: ${stats.totalRevenue} лв
📈 Средна стойност: ${stats.averageRevenue.toFixed(2)} лв/резервация
🌟 Рейтинг на системата: ⭐⭐⭐⭐⭐

🎪 2L1P Hotel System - Работи перфектно!`;

    alert(message);
}

function searchByBudget() {
    const budget = prompt('🎯 Въведете максимален бюджет (в лева):');
    
    if (!budget || isNaN(budget)) {
        alert('❌ Моля, въведете валидна сума');
        return;
    }
    
    const affordableRooms = ultimateSystem.availableRooms.filter(
        room => room.price <= parseInt(budget)
    );
    
    if (affordableRooms.length === 0) {
        alert(`❌ Няма налични стаи до ${budget} лв`);
        return;
    }
    
    let message = `🏨 СТАИ ДО ${budget} ЛЕВА:\n\n`;
    affordableRooms.forEach(room => {
        message += `• ${room.name} - ${room.price} лв/нощ\n`;
        message += `  🛏️ ${room.amenities.join(', ')}\n\n`;
    });
    
    message += '🎯 Изберете стая от формата горе!';
    alert(message);
}

// 🎪 Добавяме тестови резервации при зареждане
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 2L1P Hotel System зареден успешно!');
    
    // Добавяме тестови резервации ако няма
    if (ultimateSystem.getBookings().length === 0) {
        ultimateSystem.makeReservation({
            guest: { name: "Иван Петров" },
            dates: { checkIn: "2024-01-15", checkOut: "2024-01-20" },
            room: "Стандарт стая",
            price: 100,
            timestamp: new Date().toISOString()
        });
        
        ultimateSystem.makeReservation({
            guest: { name: "Мария Иванова" },
            dates: { checkIn: "2024-02-01", checkOut: "2024-02-05" },
            room: "Луксозна стая", 
            price: 200,
            timestamp: new Date().toISOString()
        });
    }
});
