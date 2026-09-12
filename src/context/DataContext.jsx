
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
  reportCount: 0,
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
// const loadLiveData = async () => {
//   if (!user) return;

//   const token = getToken();

//   if (!token) {
//     setError("Authentication token is missing.");
//     return;
//   }

//   setLoading(true);
//   setError("");

//   try {
//     const clientsResponse = await apiRequest("/clients", token);

//     const clients = extractArray(clientsResponse, [
//       "clients",
//       "results",
//     ]);

//     let staff = [];

//     if (user.role === "admin") {
//       const staffResponse = await apiRequest("/staff", token);

//       staff = extractArray(staffResponse, [
//         "staff",
//         "staffList",
//         "results",
//       ]);
//     }

//     // const reportsResponse = await apiRequest("/reports", token);
// const reportCountResponse = await apiRequest(
//   "/reports/count",
//   token
// );
// console.log("REPORT COUNT RESPONSE:", reportCountResponse);

// const reportCount = Number(
//   reportCountResponse?.total || 0
// );
// console.log("REPORT COUNT:", reportCount);
//     setDataState((previous) => ({
//       ...previous,
//       clients,
//       staff,
//   reportCount,
//     }));
//   } catch (err) {
//     console.error("Failed to load dashboard data:", err);
//     setError(err.message || "Unable to load dashboard data.");
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
    // =====================================================
    // POLICY USER
    // =====================================================
    if (user.role === "policy") {
      const policiesResponse = await apiRequest(
        "/policies",
        token
      );

      const policies = extractArray(
        policiesResponse,
        ["policies", "results"]
      );

      setDataState((previous) => ({
        ...previous,
        clients: [],
        staff: [],
        reports: [],
        reportCount: 0,
        policies,
      }));

      return;
    }

    // =====================================================
    // ADMIN
    // =====================================================
    if (user.role === "admin") {
      const [
        clientsResponse,
        staffResponse,
        reportCountResponse,
      ] = await Promise.all([
        apiRequest("/clients", token),
        apiRequest("/staff", token),
        apiRequest("/reports/count", token),
      ]);

      const clients = extractArray(
        clientsResponse,
        ["clients", "results"]
      );

      const staff = extractArray(
        staffResponse,
        ["staff", "staffList", "results"]
      );

      const reportCount = Number(
        reportCountResponse?.total || 0
      );

      setDataState((previous) => ({
        ...previous,
        clients,
        staff,
        reports: [],
        reportCount,
      }));

      return;
    }

    // =====================================================
    // STAFF
    // =====================================================
    if (user.role === "staff") {
      let clients = [];
      let reports = [];

      // -----------------------------------------------
      // LOAD ASSIGNED CLIENTS
      // -----------------------------------------------
      try {
        const clientsResponse = await apiRequest(
          "/clients",
          token
        );

        clients = extractArray(
          clientsResponse,
          ["clients", "results"]
        );

        console.log("STAFF ASSIGNED CLIENTS:", clients);
      } catch (clientError) {
        console.error(
          "Failed to load staff assigned clients:",
          clientError
        );
      }

      // -----------------------------------------------
      // LOAD STAFF REPORTS
      // -----------------------------------------------
      try {
        const reportsResponse = await apiRequest(
          "/reports/my-report",
          token
        );

        reports = extractArray(
          reportsResponse,
          ["reports", "results"]
        );

        console.log("STAFF MY REPORTS:", reports);
      } catch (reportError) {
        console.error(
          "Failed to load staff reports:",
          reportError
        );
      }

      // -----------------------------------------------
      // UPDATE STATE
      // -----------------------------------------------
      setDataState((previous) => ({
        ...previous,
        clients,
        staff: [],
        reports,
        reportCount: 0,
      }));

      return;
    }

    console.warn(
      "Unknown user role:",
      user.role
    );

  } catch (err) {
    console.error(
      "Failed to load dashboard data:",
      err
    );

    setError(
      err.message ||
      "Unable to load dashboard data."
    );
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
const markPolicyAsRead = async (id) => {
  const token = getToken();

  const response = await apiRequest(
    `/policies/${id}/mark-as-read`,
    token,
    {
      method: "POST",
    }
  );

  setDataState((previous) => ({
    ...previous,
    policies: (
      Array.isArray(previous.policies)
        ? previous.policies
        : []
    ).map((policy) =>
      policy._id === id
        ? {
            ...policy,
            status: "Read",
          }
        : policy
    ),
  }));

  return response;
};
const getPolicies = async () => {
  const token = getToken();

  const response = await apiRequest("/policies", token);

  const policies = extractArray(response, [
    "policies",
    "results",
  ]);

  setDataState((previous) => ({
    ...previous,
    policies,
  }));

  return policies;
};

const getPolicy = async (id) => {
  const token = getToken();

  const response = await apiRequest(
    `/policies/${id}`,
    token
  );

  return response?.policy ||
    response?.data ||
    response;
};

const uploadPolicy = async ({
  title,
  policyType,
  description,
  file,
}) => {
  const token = getToken();

  if (!file) {
    throw new Error("Policy document is required.");
  }

  const formData = new FormData();

  formData.append("title", title.trim());
  formData.append("policyType", policyType);
  formData.append(
    "description",
    description?.trim() || ""
  );
  formData.append("file", file);

  const response = await apiRequest(
    "/policies",
    token,
    {
      method: "POST",
      body: formData,
    }
  );

  const createdPolicy =
    response?.policy ||
    response?.data ||
    response;

  setDataState((previous) => ({
    ...previous,
    policies: [
      createdPolicy,
      ...(Array.isArray(previous.policies)
        ? previous.policies
        : []),
    ],
  }));

  return createdPolicy;
};

const updatePolicy = async (id, payload) => {
  const token = getToken();

  const response = await apiRequest(
    `/policies/${id}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  const updatedPolicy =
    response?.policy ||
    response?.data ||
    response;

  setDataState((previous) => ({
    ...previous,
    policies: (
      Array.isArray(previous.policies)
        ? previous.policies
        : []
    ).map((policy) =>
      policy._id === id
        ? updatedPolicy
        : policy
    ),
  }));

  return updatedPolicy;
};

const deletePolicy = async (id) => {
  const token = getToken();

  await apiRequest(
    `/policies/${id}`,
    token,
    {
      method: "DELETE",
    }
  );

  setDataState((previous) => ({
    ...previous,
    policies: (
      Array.isArray(previous.policies)
        ? previous.policies
        : []
    ).filter(
      (policy) =>
        policy._id !== id &&
        policy.id !== id
    ),
  }));
};
const getAllReports = async () => {
  const token = getToken();

  // const response = await apiRequest("/reports", token);
const getAllReports = async () => {
  const token = getToken();

  const response = await apiRequest(
    "/reports/my-report",
    token
  );

  return response?.reports || [];
};
  return response?.reports || [];
};
// const submitReport = async (clientId, payload) => {
//   const token = getToken();

//   const response = await apiRequest(`/clients/${clientId}/reports`, token, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });

//   return response?.report || response;
// };


const submitReport = async (clientId, payload) => {
  const token = getToken();

  const response = await apiRequest(`/clients/${clientId}/reports`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const report = response?.report || response;

  // Refresh reports so "My Reports" reflects the new submission immediately.
  await loadLiveData();

  return report;
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
    getPolicies,
  getPolicy,
  uploadPolicy,
  updatePolicy,
  deletePolicy,
    markPolicyAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}