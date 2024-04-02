import { useMutation } from "react-query";

export const CreateWorkSpace = async (name: string) => {
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";

  try {
    const res = await fetch(
      `https://api.trello.com/1/organizations/?displayName=${name}&key=${apiKey}&token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
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

export const useCreateWorkSpace = () => {
  return useMutation(CreateWorkSpace);
};
