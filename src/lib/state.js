const KEY = 'lanbeth-care-state-v3';
const ACCOUNTS_KEY = 'lanbeth-accounts-v3';

export const demoAccount = { email: 'admin@lanbethcare.com', password: 'Admin@123', name: 'Portal Admin' };

export const seed = {
  clients: [
    { id:'CL-012-2024-001', initials:'JD', name:'John Doe', email:'john.doe@gmail.com', phone:'+1 (555) 123-4567', clinician:'Dr. Sarah Johnson', status:'Active', dob:'15 March 1952', address:'24 Resolution Road, London' },
    { id:'CL-024-2024-002', initials:'ES', name:'Emily Smith', email:'emily.smith@gmail.com', phone:'+1 (555) 234-5678', clinician:'Dr. Michael Chen', status:'Active', dob:'21 July 1958', address:'12 Green Lane, London' },
    { id:'CL-031-2024-003', initials:'MB', name:'Michael Brown', email:'michael.brown@gmail.com', phone:'+1 (555) 345-6789', clinician:'Nurse Emma Wilson', status:'Inactive', dob:'03 February 1949', address:'8 Care Street, London' },
    { id:'CL-044-2024-004', initials:'SJ', name:'Sarah Johnson', email:'sarah.johnson@gmail.com', phone:'+1 (555) 456-7890', clinician:'Dr. James Anderson', status:'Active', dob:'10 October 1960', address:'40 Homecare Avenue, London' },
    { id:'CL-052-2024-005', initials:'DW', name:'David Wilson', email:'david.wilson@gmail.com', phone:'+1 (555) 567-8901', clinician:'Dr. Lisa Taylor', status:'Active', dob:'17 May 1955', address:'7 Resolution Road, London' },
    { id:'CL-067-2024-006', initials:'LM', name:'Lisa Martinez', email:'lisa.martinez@gmail.com', phone:'+1 (555) 678-9012', clinician:'Dr. Michael Chen', status:'Active', dob:'29 November 1963', address:'91 Green Road, London' }
  ],
  staff: [
    { id:'ST-001', initials:'JS', name:'John Smith', role:'Care Worker', email:'john.smith@gmail.com', status:'Active', phone:'+1 (555) 345-6789', employment:'Full Time', startDate:'12 January 2024' },
    { id:'ST-002', initials:'EW', name:'Emma Wilson', role:'Senior Carer', email:'emma.wilson@gmail.com', status:'Active', phone:'+1 (555) 222-1020', employment:'Full Time', startDate:'08 March 2025' },
    { id:'ST-003', initials:'MC', name:'Michael Chen', role:'Nurse', email:'michael.chen@gmail.com', status:'Active', phone:'+1 (555) 220-1190', employment:'Part Time', startDate:'11 April 2025' },
    { id:'ST-004', initials:'SW', name:'Sarah Williams', role:'Care Worker', email:'sarah.williams@gmail.com', status:'Active', phone:'+1 (555) 120-9000', employment:'Full Time', startDate:'14 June 2026' }
  ],
  reports: [
    { id:'RP-001', date:'18 Aug 2026', by:'John Smith', type:'Daily Care Report', status:'Submitted' },
    { id:'RP-002', date:'15 Aug 2026', by:'Emma Wilson', type:'Care Review', status:'Submitted' },
    { id:'RP-003', date:'10 Aug 2026', by:'Sarah Williams', type:'Weekly Report', status:'Submitted' }
  ],
  documents: [
    { id:'DOC-001', name:'Care Plan.pdf', type:'Care Plan', uploaded:'12 Aug 2026', expiry:'12 Nov 2026', status:'Valid' },
    { id:'DOC-002', name:'Medication List.pdf', type:'Medical', uploaded:'10 Aug 2026', expiry:'10 Nov 2026', status:'Valid' },
    { id:'DOC-003', name:'Identity Document.pdf', type:'Identity', uploaded:'04 Jan 2025', expiry:'04 Jan 2026', status:'Expired' }
  ],
  audit: [
    ['18 Aug 2026 09:40','Admin','Viewed client','Clients','192.168.1.10'],
    ['18 Aug 2026 09:12','Admin','Uploaded document','Documents','192.168.1.10'],
    ['17 Aug 2026 16:30','Admin','Edited staff','Staff','192.168.1.10'],
    ['17 Aug 2026 14:22','Admin','Generated report','Reports','192.168.1.10']
  ]
};

export function loadState() {
  try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; }
}
export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
export function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [demoAccount]; } catch { return [demoAccount]; }
}
export function saveAccounts(a) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
}