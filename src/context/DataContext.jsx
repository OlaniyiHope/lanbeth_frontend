
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

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5001/api";


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

  const loadLiveData = async () => {

    if (!user) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const [
        clientsResponse,
        staffResponse,
      ] = await Promise.all([
        apiRequest("/clients", token),
        apiRequest("/staff", token),
      ]);


      const clients = extractArray(
        clientsResponse,
        ["clients", "results"]
      );


      const staff = extractArray(
        staffResponse,
        ["staff", "staffList", "results"]
      );


      setDataState((previous) => ({
        ...previous,
        clients,
        staff,
      }));


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

        getClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}