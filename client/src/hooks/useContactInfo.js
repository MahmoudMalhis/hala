import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useContactInfo = () => {
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`
      );
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
};
