/* ==========================================================================
   FLORACRAFT - DIAGNOSIS REQUEST & ADMIN DASHBOARD ENGINE
   Full client-side storage, real-time status management, search & filters
   ========================================================================== */

const DIAGNOSIS_STORAGE_KEY = 'FLORACRAFT_DIAGNOSIS_REQUESTS';

// Initial seed requests if empty
const DEFAULT_DIAGNOSIS_REQUESTS = [
  {
    id: 'DIAG-7821',
    userName: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (503) 892-4410',
    plantName: 'Monstera Deliciosa',
    requestType: 'Yellowing Leaves',
    severity: 'Medium',
    description: 'Lower leaves are turning pale yellow with brown crispy margins. Soil feels wet 4 days after watering.',
    status: 'In Progress',
    adminNotes: 'Advised owner to check for root-bound pot and reduce watering frequency to once every 10 days.',
    createdAt: '2026-08-14 10:15 AM'
  },
  {
    id: 'DIAG-7822',
    userName: 'Marcus Thorne',
    email: 'marcus.t@example.com',
    phone: '+1 (415) 330-8912',
    plantName: 'Fiddle Leaf Fig (Ficus Lyrata)',
    requestType: 'Dropping Foliage',
    severity: 'High',
    description: 'Sudden leaf drop on upper stems after moving plant to a new living room corner with AC draft.',
    status: 'Pending',
    adminNotes: '',
    createdAt: '2026-08-14 11:42 AM'
  },
  {
    id: 'DIAG-7823',
    userName: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    phone: '+1 (206) 554-1903',
    plantName: 'Peace Lily (Spathiphyllum)',
    requestType: 'White Pests & Mites',
    severity: 'High',
    description: 'Fine webbing visible under leaf nodes with tiny white moving specks. Blooms are wilting rapidly.',
    status: 'Completed',
    adminNotes: 'Prescribed organic cold-pressed Neem Oil spray solution and weekly leaf wiping regimen. Resolved.',
    createdAt: '2026-08-13 03:20 PM'
  },
  {
    id: 'DIAG-7824',
    userName: 'Julian Miller',
    email: 'julian.m@example.com',
    phone: '+1 (312) 708-6621',
    plantName: 'Snake Plant Laurentii',
    requestType: 'Root Rot & Soil Smell',
    severity: 'Medium',
    description: 'Base of outer leaf feels mushy and smells damp. Plant has been in low light corner with dense potting soil.',
    status: 'Pending',
    adminNotes: '',
    createdAt: '2026-08-14 01:05 PM'
  }
];

// Initialize storage
function getDiagnosisRequests() {
  try {
    const raw = localStorage.getItem(DIAGNOSIS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(DEFAULT_DIAGNOSIS_REQUESTS));
      return DEFAULT_DIAGNOSIS_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading diagnosis requests:', e);
    return DEFAULT_DIAGNOSIS_REQUESTS;
  }
}

function saveDiagnosisRequests(requests) {
  try {
    localStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving diagnosis requests:', e);
  }
}

// Add New Request
function addDiagnosisRequest(formData) {
  const requests = getDiagnosisRequests();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + 
                  now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `DIAG-${randomNum}`;

  const newRequest = {
    id: newId,
    userName: formData.userName.trim(),
    email: formData.email.trim(),
    phone: formData.phone ? formData.phone.trim() : 'Not provided',
    plantName: formData.plantName.trim(),
    requestType: formData.requestType,
    severity: formData.severity || 'Medium',
    description: formData.description.trim(),
    status: 'Pending',
    adminNotes: '',
    createdAt: dateStr
  };

  requests.unshift(newRequest);
  saveDiagnosisRequests(requests);
  return newRequest;
}

// Update Request Status & Notes
function updateDiagnosisStatus(id, newStatus, adminNotes = null) {
  const requests = getDiagnosisRequests();
  const item = requests.find(r => r.id === id);
  if (item) {
    item.status = newStatus;
    if (adminNotes !== null) {
      item.adminNotes = adminNotes;
    }
    saveDiagnosisRequests(requests);
    return true;
  }
  return false;
}

// Delete Request
function deleteDiagnosisRequest(id) {
  let requests = getDiagnosisRequests();
  requests = requests.filter(r => r.id !== id);
  saveDiagnosisRequests(requests);
}

// Status Badge Helper
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending': return 'bg-warning text-dark';
    case 'In Progress': return 'bg-info text-dark';
    case 'Completed': return 'bg-success text-white';
    case 'Cancelled': return 'bg-secondary text-white';
    default: return 'bg-light text-dark';
  }
}

// Global Exports
window.FloraDiagnosis = {
  getAll: getDiagnosisRequests,
  add: addDiagnosisRequest,
  updateStatus: updateDiagnosisStatus,
  delete: deleteDiagnosisRequest,
  getStatusBadgeClass: getStatusBadgeClass
};
