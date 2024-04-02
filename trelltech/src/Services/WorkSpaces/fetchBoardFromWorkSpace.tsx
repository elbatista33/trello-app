import { useQuery } from "react-query";

export const fetchBoardFromWorkSpace = async (workspaceId: string) => {
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";
  try {
    const res = await fetch(
      `https://api.trello.com/1/organizations/${workspaceId}/boards?key=${apiKey}&token=${token}`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function useBoardFromWorkSpace(workspaceId: string) {
  return useQuery(["board", workspaceId], () =>
    fetchBoardFromWorkSpace(workspaceId)
  );
}
