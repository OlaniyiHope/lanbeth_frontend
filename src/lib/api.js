// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// async function request(path, options = {}) {
//   const token = localStorage.getItem('lanbeth-auth-token');

//   const res = await fetch(`${API_URL}${path}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
//   }

//   return data;
// }

// export function login(identifier, password) {
//   return request('/api/auth/login', {
//     method: 'POST',
//     body: JSON.stringify({ identifier, password }),
//   });
// }

// export function register(payload) {
//   return request('/api/auth/register', {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   });
// }
// export async function getCurrentUser(token) {
//   const res = await fetch(`${API_BASE}/api/auth/me`, {
//     method: 'GET',
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) {
//     const err = new Error('Session invalid');
//     err.status = res.status;
//     throw err;
//   }
//   return res.json(); // { user }
// }
// export function fetchMe() {
//   return request('/api/auth/me');
// }
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

async function request(path, options = {}) {
  const token = localStorage.getItem('lanbeth-auth-token');

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

export function login(identifier, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export function register(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchMe() {
  return request('/api/auth/me');
}