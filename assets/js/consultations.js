/* ==========================================================================
   FLORACRAFT - CONSULTATION BOOKINGS ENGINE
   Stores only: Name, Phone Number, Address, Consultation Type, Date, Time
   Shows latest bookings first
   ========================================================================== */

const CONSULTATION_STORAGE_KEY = 'floracraft_consultations';

// HTML escaping helper to prevent XSS and rendering errors
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

// Default initial sample records (latest first)
const DEFAULT_CONSULTATIONS = [
  {
    id: 'CNS-9104',
    name: 'Eleanor Vance',
    phone: '+1 (503) 892-4410',
    address: '742 Evergreen Terrace, Portland, OR',
    type: 'Residential Landscape Design',
    date: '2026-08-20',
    time: '10:30 AM',
    createdAt: '2026-08-16T10:30:00.000Z'
  },
  {
    id: 'CNS-9103',
    name: 'Marcus Thorne',
    phone: '+1 (415) 330-8912',
    address: '1200 Pacific Heights Blvd, San Francisco, CA',
    type: 'Commercial & Office Biophilia',
    date: '2026-08-21',
    time: '02:00 PM',
    createdAt: '2026-08-16T09:15:00.000Z'
  },
  {
    id: 'CNS-9102',
    name: 'Sophia Chen',
    phone: '+1 (206) 554-1903',
    address: '880 Bellevue Way NE, Seattle, WA',
    type: 'Rooftop & Balcony Sanctuary',
    date: '2026-08-22',
    time: '11:00 AM',
    createdAt: '2026-08-15T16:45:00.000Z'
  },
  {
    id: 'CNS-9101',
    name: 'Julian Miller',
    phone: '+1 (312) 708-6621',
    address: '450 North Michigan Ave, Chicago, IL',
    type: 'Smart Irrigation & Drainage',
    date: '2026-08-23',
    time: '03:30 PM',
    createdAt: '2026-08-15T14:10:00.000Z'
  }
];

function getConsultationBookings() {
  try {
    const raw = localStorage.getItem(CONSULTATION_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify(DEFAULT_CONSULTATIONS));
      return DEFAULT_CONSULTATIONS;
    }
    const bookings = JSON.parse(raw);
    if (!Array.isArray(bookings)) {
      localStorage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify(DEFAULT_CONSULTATIONS));
      return DEFAULT_CONSULTATIONS;
    }
    // Sort latest bookings first by createdAt timestamp
    return bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (e) {
    console.error('Error reading consultations:', e);
    return DEFAULT_CONSULTATIONS;
  }
}

function saveConsultationBookings(bookings) {
  try {
    localStorage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('floracraft_consultations_updated', { detail: bookings }));
  } catch (e) {
    console.error('Error saving consultations:', e);
  }
}

function addConsultationBooking(data) {
  const current = getConsultationBookings();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: `CNS-${randomNum}`,
    name: (data.name || '').trim(),
    phone: (data.phone || '').trim(),
    address: (data.address || '').trim(),
    type: (data.type || '').trim(),
    date: (data.date || '').trim(),
    time: (data.time || '').trim(),
    createdAt: new Date().toISOString()
  };

  // Prepend to show latest first
  current.unshift(newBooking);
  saveConsultationBookings(current);
  return newBooking;
}

function deleteConsultationBooking(id) {
  const current = getConsultationBookings();
  const filtered = current.filter(item => item.id !== id);
  saveConsultationBookings(filtered);
  return filtered;
}

// Global Namespace & Root Exports
window.FloraConsultations = {
  getAll: getConsultationBookings,
  saveAll: saveConsultationBookings,
  add: addConsultationBooking,
  delete: deleteConsultationBooking
};

window.getConsultationBookings = getConsultationBookings;
window.saveConsultationBookings = saveConsultationBookings;
window.addConsultationBooking = addConsultationBooking;
window.deleteConsultationBooking = deleteConsultationBooking;

