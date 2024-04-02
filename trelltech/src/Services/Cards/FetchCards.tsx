import { useQuery } from "react-query";

const FetchCards = async (BoardId: string) => {
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  // const id: string = import.meta.env.VITE_APP_TRELLO_ID ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";

  try {
    const res = await fetch(
      `https://api.trello.com/1/boards/${BoardId}/cards?key=${apiKey}&token=${token}`
    );
    if (!res.ok) {
      console.log(BoardId);
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

export default function useCards(BoardId: string) {
  return useQuery(["cards", BoardId], () => FetchCards(BoardId));
}
