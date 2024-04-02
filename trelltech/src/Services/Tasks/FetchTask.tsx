import { useQuery } from "react-query";

const FetchList = async (id: string) => {
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";
  try {
    const res = await fetch(
      `https://api.trello.com/1/card/${id}/?key=${apiKey}&token=${token}`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function useCards(id: string) {
  return useQuery(["card", id], () => FetchList(id));
}

