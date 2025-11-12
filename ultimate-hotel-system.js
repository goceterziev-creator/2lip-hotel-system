// 🎪 2L1P ULTIMATE HOTEL SYSTEM - FIXED VERSION
class UltimateBookingSystem {
    constructor() {
        this.availableRooms = [];
        this.bookings = [];
        this.hotels = [];
        this.currentHotel = null;
        this.loadInitialData();
        this.initializeEventListeners();
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
        
        // Добавяме тестови резервации
        this.addSampleBookings();
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
    
    initializeEventListeners() {
        // Форма за резервации
        const form = document.getElementById('reservationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
        
        // Автоматично изчисление
        const calculationInputs = ['checkIn', 'checkOut', 'roomType'];
        calculationInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateReservationSummary();
                });
            }
        });
        
        // Административни бутони
        this.setupAdminButtons();
        
        // Инициализиране на summary
        setTimeout(() => this.updateReservationSummary(), 100);
    }
    
    setupAdminButtons() {
        // 📊 Всички резервации
        const allBookingsBtn = document.querySelector('.btn-admin:nth-child(1)');
        if (allBookingsBtn) {
            allBookingsBtn.addEventListener('click', showAllBookings);
        }
        
        // 📈 Статистики
        const statsBtn = document.querySelector('.btn-admin:nth-child(2)');
        if (statsBtn) {
            statsBtn.addEventListener('click', showAdminStats);
        }
        
        // 💰 Търсене по бюджет
        const budgetBtn = document.querySelector('.btn-admin:nth-child(3)');
        if (budgetBtn) {
            budgetBtn.addEventListener('click', searchByBudget);
        }
    }
    
    calculateNights(checkIn, checkOut) {
        if (!checkIn || !checkOut) return 0;
        
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const timeDiff = end.getTime() - start.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return nights > 0 ? nights : 0;
    }
    
    updateReservationSummary() {
        try {
            const checkIn = document.getElementById('checkIn')?.value || '';
            const checkOut = document.getElementById('checkOut')?.value || '';
            const roomElement = document.getElementById('roomType');
            const selectedOption = roomElement?.options[roomElement.selectedIndex];
            
            const nights = this.calculateNights(checkIn, checkOut);
            const pricePerNight = selectedOption ? parseInt(selectedOption.getAttribute('data-price') || 0) : 0;
            const totalPrice = nights * pricePerNight;
            
            if (document.getElementById('nightsCount')) {
                document.getElementById('nightsCount').textContent = nights;
                document.getElementById('pricePerNight').textContent = pricePerNight + ' лв';
                document.getElementById('totalPrice').textContent = totalPrice + ' лв';
            }
        } catch (error) {
            console.log('❌ Грешка при изчисление:', error);
        }
    }
    
    handleFormSubmission() {
        try {
            const guestName = document.getElementById('guestName').value;
            const guestEmail = document.getElementById('guestEmail').value;
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const adults = parseInt(document.getElementById('adults').value);
            const children2 = parseInt(document.getElementById('children2').value);
            const children12 = parseInt(document.getElementById('children12').value);
            const roomType = document.getElementById('roomType').value;
            
            // Валидация
            if (!guestName || !guestEmail || !checkIn || !checkOut || !roomType) {
                alert('❌ Моля, попълнете всички задължителни полета!');
                return;
            }
            
            // Проверка за валидни дати
            const nights = this.calculateNights(checkIn, checkOut);
            if (nights <= 0) {
                alert('❌ Моля, изберете валиден период за настаняване!');
                return;
            }
            
            const roomElement = document.getElementById('roomType');
            const selectedOption = roomElement.options[roomElement.selectedIndex];
            const pricePerNight = parseInt(selectedOption.getAttribute('data-price'));
            const totalPrice = nights * pricePerNight;
            
            const reservation = {
                guest: { 
                    name: guestName,
                    email: guestEmail 
                },
                dates: { checkIn, checkOut },
                guests: {
                    adults: adults,
                    childrenUnder2: children2,
                    children2to12: children12
                },
                room: roomType,
                roomName: selectedOption.text,
                pricePerNight: pricePerNight,
                totalPrice: totalPrice,
                nights: nights,
                timestamp: new Date().toISOString()
            };
            
            const success = this.makeReservation(reservation);
            
            if (success) {
                const message = `✅ РЕЗЕРВАЦИЯТА Е ПОТВЪРДЕНА!\n\n👤 Гост: ${guestName}\n📧 Имейл: ${guestEmail}\n🏨 Стая: ${selectedOption.text}\n📅 Период: ${checkIn} до ${checkOut}\n⏰ Нощувки: ${nights} нощи\n👨‍👩‍👧‍👦 Гости: ${adults} възрастни, ${children2} деца (0-2г.), ${children12} деца (2-12г.)\n💰 Цена за нощ: ${pricePerNight} лв\n🧮 ОБЩА СТОЙНОСТ: ${totalPrice} лв`;
                
                alert(message);
                this.resetForm();
            }
        } catch (error) {
            alert('❌ Възникна грешка при резервацията. Моля, опитайте отново.');
            console.error('Грешка при резервация:', error);
        }
    }
    
    resetForm() {
        const form = document.getElementById('reservationForm');
        if (form) {
            form.reset();
            // Ръчно нулираме селектите до default стойности
            document.getElementById('adults').value = '2';
            document.getElementById('children2').value = '0';
            document.getElementById('children12').value = '0';
            document.getElementById('roomType').value = '';
            
            // Нулираме summary
            setTimeout(() => this.updateReservationSummary(), 100);
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
        
        reservation.id = 'BK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        reservation.status = 'confirmed';
        this.bookings.push(reservation);
        console.log('✅ Резервация добавена:', reservation);
        return true;
    }
    
    addSampleBookings() {
        if (this.bookings.length === 0) {
            this.makeReservation({
                guest: { name: "Иван Петров", email: "ivan@example.com" },
                dates: { checkIn: "2024-01-15", checkOut: "2024-01-20" },
                guests: { adults: 2, childrenUnder2: 0, children2to12: 1 },
                room: "standard",
                roomName: "Стандарт стая - 100лв/нощ",
                pricePerNight: 100,
                totalPrice: 500,
                nights: 5,
                timestamp: new Date().toISOString()
            });
            
            this.makeReservation({
                guest: { name: "Мария Иванова", email: "maria@example.com" },
                dates: { checkIn: "2024-02-01", checkOut: "2024-02-03" },
                guests: { adults: 2, childrenUnder2: 1, children2to12: 0 },
                room: "luxury", 
                roomName: "Луксозна стая - 200лв/нощ",
                pricePerNight: 200,
                totalPrice: 400,
                nights: 2,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    getBookings() {
        return this.bookings;
    }
    
    getBookingStats() {
        const totalBookings = this.bookings.length;
        const totalRevenue = this.bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const confirmedBookings = this.bookings.filter(b => b.status === 'confirmed').length;
        
        return {
            totalBookings,
            totalRevenue,
            confirmedBookings,
            averageRevenue: totalBookings > 0 ? totalRevenue / totalBookings : 0
        };
    }
}

// 🚀 Глобални функции
function showAllBookings() {
    try {
        const bookings = ultimateSystem.getBookings();
        
        if (bookings.length === 0) {
            alert('📭 Все още няма направени резервации');
            return;
        }
        
        let message = '📋 ВСИЧКИ РЕЗЕРВАЦИИ:\n\n';
        bookings.forEach((booking, index) => {
            message += `${index + 1}. 👤 ${booking.guest.name}\n`;
            message += `   📧 ${booking.guest.email || 'Няма имейл'}\n`;
            message += `   🏨 ${booking.roomName}\n`;
            message += `   💰 ОБЩО: ${booking.totalPrice} лв (${booking.nights} нощи)\n`;
            message += `   📅 ${booking.dates.checkIn} до ${booking.dates.checkOut}\n`;
            message += `   👥 ${booking.guests.adults} възрастни, ${booking.guests.childrenUnder2} деца (0-2), ${booking.guests.children2to12} деца (2-12)\n`;
            message += `   ⏰ ${new Date(booking.timestamp).toLocaleString('bg-BG')}\n\n`;
        });
        
        message += `💰 ОБЩ ПРИХОД: ${bookings.reduce((sum, b) => sum + b.totalPrice, 0)} лв`;
        alert(message);
    } catch (error) {
        alert('❌ Грешка при показване на резервациите');
        console.error('Грешка:', error);
    }
}

function showAdminStats() {
    try {
        const stats = ultimateSystem.getBookingStats();
        
        const message = `📊 АДМИН СТАТИСТИКИ:\n
🏨 Общо резервации: ${stats.totalBookings}
💰 Общ приход: ${stats.totalRevenue} лв
✅ Потвърдени: ${stats.confirmedBookings}
📈 Средна стойност: ${stats.averageRevenue.toFixed(2)} лв/резервация

🌟 2L1P Hotel System - Стабилна и надеждна!`;

        alert(message);
    } catch (error) {
        alert('❌ Грешка при показване на статистиките');
    }
}

function searchByBudget() {
    try {
        const budget = prompt('🎯 Въведете максимален бюджет (в лева):');
        
        if (!budget || isNaN(budget)) {
            alert('❌ Моля, въведете валидна сума');
            return;
        }
        
        const budgetNum = parseInt(budget);
        const affordableRooms = ultimateSystem.availableRooms.filter(
            room => room.price <= budgetNum
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
    } catch (error) {
        alert('❌ Грешка при търсене по бюджет');
    }
}

// 🎪 Инициализация
let ultimateSystem;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 2L1P Hotel System зарежда се...');
    ultimateSystem = new UltimateBookingSystem();
    console.log('✅ 2L1P Hotel System зареден успешно!');
});
