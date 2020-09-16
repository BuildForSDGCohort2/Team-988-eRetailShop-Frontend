import { apiUrl } from "../config.json";
import auth from "../services/authService";
const axios = require("axios");

const apiEndpoint = apiUrl + "user";
const profileApiEndpoint = apiUrl + "profile";

export async function getUser(userId) {
  const config = {
    headers: {
      "x-auth-token": auth.getJwt(),
    },
  };
  return await axios.get(apiEndpoint + "/" + userId, config);
}

export async function getUsersProfiles() {
  const config = {
    headers: {
      "x-auth-token": auth.getJwt(),
    },
  };
  const { data: users } = await axios.get(apiEndpoint, config);
  const { data: profiles } = await axios.get(profileApiEndpoint, config);
  const profilesTransformed = profiles.data.map(({ id, ...rest }) => ({
    ...rest,
    pid: id,
  }));

  return users.data.map((t1) => ({
    ...t1,
    ...profilesTransformed.find((t2) => t2.pid === t1.profileid),
  }));
}

export async function createUser(user) {
  return await axios.post(apiEndpoint, user);
}

export async function updateUser(userId, user) {
  const config = {
    headers: {
      "x-auth-token": auth.getJwt(),
    },
  };
  return await axios.put(apiEndpoint + "/" + userId, user, config);
}

export async function deleteUser(userId) {
  const config = {
    headers: {
      "x-auth-token": auth.getJwt(),
    },
  };
  return await axios.delete(apiEndpoint + "/" + userId, config);
}
