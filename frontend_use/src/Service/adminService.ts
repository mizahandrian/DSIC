import axios from "axios";
import type { Admin } from "../types/Admin";

const API_URL = "http://localhost:8000/api/admins";

export const getAdmins = () => axios.get(API_URL);

export const createAdmin = (data: Admin) =>
  axios.post(API_URL, data);

export const updateAdmin = (id: number, data: Admin) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteAdmin = (id: number) =>
  axios.delete(`${API_URL}/${id}`);