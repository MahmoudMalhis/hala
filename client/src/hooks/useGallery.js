import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGallery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/gallery`
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
