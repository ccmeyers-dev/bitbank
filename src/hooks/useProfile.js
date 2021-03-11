import useSWR from "swr";
import storage from "local-storage-fallback";

import axiosInstance from "../utils/axios";

export const useProfile = () => {
  const { data: profile, mutate, error } = useSWR("/profile");

  const loading = !profile && !error;

  const logout = async () => {
    storage.removeItem("access_token");
    storage.removeItem("refresh_token");
    axiosInstance.defaults.headers["Authorization"] = null;

    await mutate();
    window.location.href = "/account/login";
  };

  return { profile, loading, error, mutate, logout };
};
