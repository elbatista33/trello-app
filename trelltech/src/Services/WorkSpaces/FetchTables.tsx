import { useQuery } from "react-query";

const getTables = async () => {
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  const username: string = import.meta.env.VITE_APP_USERNAME ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";
  try {
    const res = await fetch(
      `https://api.trello.com/1/members/${username}/boards?key=${apiKey}&token=${token}`
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

export default function useTable() {
  return useQuery("tables", getTables);
}
