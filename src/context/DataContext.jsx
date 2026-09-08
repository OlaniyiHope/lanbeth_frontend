
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { loadState, saveState } from "../lib/state.js";
import { useAuth } from "./AuthContext.jsx";

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

// const API_BASE_URL =
//   import.meta.env.VITE_BASE_URL || "http://localhost:5001/api";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/$/, "") + "/api";

async function apiRequest(endpoint, token, options = {}) {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    }
  );

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return result;
}



function extractArray(result, keys = []) {
  if (Array.isArray(result)) {
    return result;
  }

  for (const key of keys) {
    if (Array.isArray(result?.[key])) {
      return result[key];
    }
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
}


export function DataProvider({ children }) {

  const { user } = useAuth();

  const [data, setDataState] = useState(() => {
    const localData = loadState();

    return {
      ...localData,
      clients: [],
      staff: [],
        reports: [],
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const getToken = () => {
    return localStorage.getItem("lanbeth-auth-token");
  };


  // ==============================
  // LOAD CLIENTS + STAFF
  // ==============================

  // const loadLiveData = async () => {

  //   if (!user) {
  //     return;
  //   }

  //   const token = getToken();

  //   if (!token) {
  //     setError("Authentication token is missing.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {

  //     const [
  //       clientsResponse,
  //       staffResponse,
  //     ] = await Promise.all([
  //       apiRequest("/clients", token),
  //       apiRequest("/staff", token),
  //     ]);


  //     const clients = extractArray(
  //       clientsResponse,
  //       ["clients", "results"]
  //     );


  //     const staff = extractArray(
  //       staffResponse,
  //       ["staff", "staffList", "results"]
  //     );


  //     setDataState((previous) => ({
  //       ...previous,
  //       clients,
  //       staff,
  //     }));


  //   } catch (err) {

  //     console.error(
  //       "Failed to load dashboard data:",
  //       err
  //     );

  //     setError(
  //       err.message ||
  //       "Unable to load dashboard data."
  //     );

  //   } finally {

  //     setLoading(false);

  //   }
  // };
// const loadLiveData = async () => {
//   if (!user) {
//     return;
//   }

//   const token = getToken();

//   if (!token) {
//     setError("Authentication token is missing.");
//     return;
//   }

//   setLoading(true);
//   setError("");

//   try {
//     // Everyone who is authorized can load their clients
//     const clientsResponse = await apiRequest("/clients", token);

//     const clients = extractArray(
//       clientsResponse,
//       ["clients", "results"]
//     );

//     let staff = [];

//     // Only admins should load the staff directory
//     if (user.role === "admin") {
//       const staffResponse = await apiRequest("/staff", token);

//       staff = extractArray(
//         staffResponse,
//         ["staff", "staffList", "results"]
//       );
//     }

//     setDataState((previous) => ({
//       ...previous,
//       clients,
//       staff,
//     }));

//   } catch (err) {
//     console.error(
//       "Failed to load dashboard data:",
//       err
//     );

//     setError(
//       err.message ||
//       "Unable to load dashboard data."
//     );

//   } finally {
//     setLoading(false);
//   }
// };
const loadLiveData = async () => {
  if (!user) return;

  const token = getToken();

  if (!token) {
    setError("Authentication token is missing.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const clientsResponse = await apiRequest("/clients", token);

    const clients = extractArray(clientsResponse, [
      "clients",
      "results",
    ]);

    let staff = [];

    if (user.role === "admin") {
      const staffResponse = await apiRequest("/staff", token);

      staff = extractArray(staffResponse, [
        "staff",
        "staffList",
        "results",
      ]);
    }

    // const reportsResponse = await apiRequest("/reports", token);
const reportsResponse = await apiRequest("/report/my-report", token);
    const reports = extractArray(reportsResponse, [
      "reports",
      "results",
    ]);

    setDataState((previous) => ({
      ...previous,
      clients,
      staff,
      reports,
    }));
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
    setError(err.message || "Unable to load dashboard data.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {

    if (user) {
      loadLiveData();
    }

  }, [user]);


  // ==============================
  // GET SINGLE CLIENT
  // ==============================

  const getClient = async (id) => {

    const token = getToken();

    const response = await apiRequest(
      `/clients/${id}`,
      token
    );

    return response?.client || response?.data || response;

  };


  // ==============================
  // UPDATE CLIENT
  // ==============================

  const updateClient = async (id, clientData) => {

    const token = getToken();

    const response = await apiRequest(
      `/clients/${id}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(clientData),
      }
    );

    const updatedClient =
      response?.client ||
      response?.data ||
      response;


    setDataState((previous) => ({
      ...previous,

      clients: previous.clients.map((client) =>
        client.id === id ||
        client._id === id
          ? updatedClient
          : client
      ),
    }));


    return updatedClient;
  };


  // ==============================
  // DELETE CLIENT
  // ==============================
// ==============================
// REPORTS
// ==============================


const getAllReports = async () => {
  const token = getToken();

  // const response = await apiRequest("/reports", token);
const response = await apiRequest("/report/my-report", token);
  return response?.reports || [];
};
const submitReport = async (clientId, payload) => {
  const token = getToken();

  const response = await apiRequest(`/clients/${clientId}/reports`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response?.report || response;
};

const getReportsForClient = async (clientId, filters = {}) => {
  const token = getToken();

  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : "";

  const response = await apiRequest(`/clients/${clientId}/reports${query}`, token);

  return response?.reports || [];
};
  const deleteClient = async (id) => {

    const token = getToken();

    await apiRequest(
      `/clients/${id}`,
      token,
      {
        method: "DELETE",
      }
    );


    setDataState((previous) => ({
      ...previous,

      clients: previous.clients.filter(
        (client) =>
          client.id !== id &&
          client._id !== id
      ),
    }));
  };
const createClient = async (payload) => {
  const token = getToken();

  const response = await apiRequest("/clients", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const created = response?.client || response?.data || response;

  setDataState((previous) => ({
    ...previous,
    clients: [...previous.clients, created],
  }));

  return created;
};

const createStaff = async (payload) => {
  const token = getToken();

  const response = await apiRequest("/auth/register", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Adjust these depending on your backend response.
  const createdStaff =
    response?.staff ||
    response?.user ||
    response?.data ||
    response;

  // Immediately update the global staff list.
  setDataState((previous) => ({
    ...previous,
    staff: [
      ...(Array.isArray(previous.staff) ? previous.staff : []),
      createdStaff,
    ],
  }));

  return createdStaff;
};


  // ==============================
  // LOCAL DATA SETTER
  // ==============================

  const setData = (next) => {

    setDataState(next);

    saveState(next);

  };


  return (
    <DataContext.Provider
      value={{
        data,
        setData,

        loading,
        error,

        refreshData: loadLiveData,
 createClient,
 createStaff,
        getClient,
        updateClient,
        deleteClient,
          submitReport,          // add
  getReportsForClient, 

    getAllReports,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}