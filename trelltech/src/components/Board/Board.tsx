import { useState } from "react";
import "./Board.css";
import useBoards from "../../Services/Boards/FetchBoard";
import useCards from "../../Services/Cards/FetchCards"; // Suppose you have a service to fetch tasks
import Lane from "../Lane/Lane";
import { LaneModel } from "../../models/LaneModel";
import { TaskModel } from "../../models/TaskModel"; // Suppose you have a model for tasks
import { useParams } from "react-router-dom";
import { Card, CardBody, Typography } from "@material-tailwind/react";

export default function Board() {
  const [Tasks, setTasks] = useState<TaskModel[]>([]);
  const [listInputValue, setlistInputValue] = useState<string>("");
  const { shortLink = "defaultShortLink" } = useParams<{ shortLink: string }>();
  const {
    data: lanes,
    status: lanesStatus,
    refetch: refetchboard,
  } = useBoards(shortLink);
  const {
    data: tasks,
    status: tasksStatus,
    refetch: refetchTasks,
  } = useCards(shortLink);
  console.log("shortLink:", shortLink); // Log the shortLink (board id
  console.log("Tasks:", tasks); // Log the tasks data
  const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
  const token: string = import.meta.env.VITE_APP_TOKEN ?? "";

  const updateTask = (id: string, laneId: string) => {
    const url = `https://api.trello.com/1/cards/${id}?key=${apiKey}&token=${token}`;
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idList: laneId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // This returns a promise
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handleOnDragStart(event: React.DragEvent, id: number) {
    console.log("dragging", id);
    event.dataTransfer.setData("id", id.toString());
  }

  function handleOnDragOver(event: React.DragEvent) {
    console.log("dragging over");
    event.preventDefault();
  }

  function handleOnDrop(event: React.DragEvent, laneId: string) {
    console.log("dropping on the lane n°", laneId);
    const id = event.dataTransfer.getData("id");
    const task = Tasks.find((task) => task.id.toString() === id);

    if (task) {
      console.log("Task found", task);
      const newTasks = Tasks.map((t) =>
        t.id === task.id ? { ...t, idList: laneId } : t
      );
      setTasks(newTasks);
    }

    updateTask(id, laneId).then((data) => {
      console.log("Success:", data);
      refetchTasks();
    });
  }

  if (lanesStatus === "loading" || tasksStatus === "loading") {
    return <div>Loading...</div>;
  }
  if (lanesStatus === "error" || tasksStatus === "error") {
    return <div>Error fetching</div>;
  }
  const lanesArray = Array.isArray(lanes) ? lanes : [lanes];

  const postList = async (listInputValue: string) => {
    if (lanes) {
      console.log("tables:", lanes);
      const tableId = shortLink;
      try {
        const res = await fetch(
          `https://api.trello.com/1/lists?name=${listInputValue}&idBoard=${tableId}&pos=bottom&key=${apiKey}&token=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: listInputValue,
            }),
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
    }
  };

  return (
    <div>
      <div className="Board">
        {lanesArray &&
          lanesArray.map((lane: LaneModel, i: number) => (
            <Lane
              key={i}
              id={lane.id}
              boardId={shortLink}
              LaneId={lane.id} // Ajoutez cette ligne
              title={lane.name}
              tasks={Tasks.filter((task) => task.idList === lane.id)} // Utilisez lane.id ici
              handleOnDragStart={handleOnDragStart}
              handleOnDragOver={handleOnDragOver}
              handleOnDrop={(event) => handleOnDrop(event, lane.id)} // Utilisez lane.id ici
            />
          ))}
        <Card
          className="text-gray h-40 mr-7"
          style={{ marginTop: "26px" }}
          placeholder={undefined}
        >
          <CardBody
            className="flex flex-col gap-4"
            placeholder={undefined}
          >
            <Typography
              variant="h4"
              color="blue-gray"
              placeholder={undefined}
            >
              Add a new list...
            </Typography>
            <div>
              <input
                type="text"
                value={listInputValue}
                className="border border-gray-300 rounded-md px-4 py-2 h-full bg-white"
                onChange={(e) => setlistInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    postList(listInputValue);
                    setlistInputValue('');
                  }
                }}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
