import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useHomeSettings = () => {
  return useQuery({
    queryKey: ["homeSettings"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`
      );
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
};
