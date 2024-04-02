import "./Lane.css";
import useCards from "../../Services/Cards/FetchCards";
import useBoards from "../../Services/Boards/FetchBoard";
import Task from "../Task/Task";
import { TaskModel } from "../../models/TaskModel";
import { Card } from "@material-tailwind/react";
import { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useParams } from "react-router-dom";

interface LaneProps {
  id: string;
  key: number;
  title: string;
  boardId: string;
  LaneId: string;
  tasks: TaskModel[];
  handleOnDragStart: (event: React.DragEvent, id: number) => void;
  handleOnDragOver: (event: React.DragEvent) => void;
  handleOnDrop: (event: React.DragEvent, laneId: string) => void;
}

const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
const token: string = import.meta.env.VITE_APP_TOKEN ?? "";

export default function Lane({
  title,
  boardId,
  LaneId,
  handleOnDragOver,
  handleOnDrop,
  handleOnDragStart,
}: LaneProps) {
  const { data, status, refetch } = useCards(boardId);
  const [taskInputValue, settaskInputValue] = useState<string>("");
  const { shortLink = "defaultShortLink" } = useParams<{ shortLink: string }>();
  const { refetch: refetchboard } = useBoards(shortLink);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error fetching data</div>;
  }
  const postTask = async (taskInputValue: string) => {
    try {
      const res = await fetch(
        `https://api.trello.com/1/cards?name=${taskInputValue}&idList=${LaneId}&key=${apiKey}&token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskInputValue,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      refetch();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const putLane = async () => {
    try {
      const res = await fetch(
        `https://api.trello.com/1/lists/${LaneId}/closed?value=true&key=${apiKey}&token=${token}`,
        {
          method: "PUT",
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      refetchboard();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div
      className="Lane"
      onDragOver={handleOnDragOver}
      onDrop={(event) => handleOnDrop(event, LaneId)}
    >
      <Card
        className="p-4 grid gap-y-0 bg-gray text-gray2"
        placeholder={undefined}
      >
        <div className="flex justify-between">
          <div></div>
          <h2>{title}</h2>
          <VscChromeClose
            className="cursor-pointer text-gray2 hover:bg-gray2 hover:rounded-md"
            onClick={() => putLane()}
          />
        </div>

        <input
          type="text"
          className="hover:bg-gray2 border border-gray2 rounded-md px-4 py-2 w-full bg-white mt-2 text-gray focus:outline-none focus:ring-2 focus:ring-gray2 focus:border-transparent"
          placeholder="Add a task..."
          value={taskInputValue}
          onChange={(e) => settaskInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              postTask(taskInputValue);
              settaskInputValue("");
            }
          }}
        />
        {data ? (
          (console.log("data :" + data.length),
            data
              .filter((card: TaskModel) => card.idList === LaneId)

              .map((card: TaskModel, i: number) => {
                return (
                  <Task
                    key={i}
                    id={card.id}
                    name={card.name}
                    idList={boardId}
                    desc={card.desc}
                    handleOnDragStart={handleOnDragStart}
                    handleOnDragOver={handleOnDragOver}
                    handleOnDrop={(event, laneId) =>
                      handleOnDrop(event, laneId.toString())
                    }
                  />
                );
              }))
        ) : (
          <div>Loading... ",</div>
        )}
      </Card>
    </div>
  );
}
