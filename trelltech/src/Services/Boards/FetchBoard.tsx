import { useQuery } from "react-query";

const getBoards = async (shortLink: string) => {
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";
  try {
    const res = await fetch(
      `https://api.trello.com/1/boards/${shortLink}/lists?key=${apiKey}&token=${token}`
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

export default function useBoards(shortLink: string) {
  return useQuery(["Lanes", shortLink], () => getBoards(shortLink));
}
