import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDesignTypes = () => {
  return useQuery({
    queryKey: ["designTypes"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/design-types`
      );
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
