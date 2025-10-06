import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRoomTypes = () => {
  return useQuery({
    queryKey: ["roomTypes"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/room-types`
      );
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
