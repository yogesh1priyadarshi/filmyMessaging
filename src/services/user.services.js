import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export const getUserById = async (userId) => {
  const res = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
  return res.data;
};
