import axios from "axios";

const API = "http://localhost:3001/api";

export const getStatus = async () => {
  const res = await axios.get(`${API}/status`);
  return res.data;
};

export const startBot = async () => {
  const res = await axios.post(`${API}/start`);
  return res.data;
};

export const stopBot = async () => {
  const res = await axios.post(`${API}/stop`);
  return res.data;
};

export const getSignals = async () => {
  const res = await axios.get(`${API}/signals`);
  return res.data;
};

export const exportSignals = async () => {
  const res = await axios.get(`${API}/export`, {
    responseType: 'blob', // ensures CSV is handled correctly
  });

  // Trigger a download in the browser
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'signals.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

