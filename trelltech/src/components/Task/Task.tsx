/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { VscChromeClose, VscListFlat } from "react-icons/vsc";
import { VscQuote } from "react-icons/vsc";
import useCards from "../../Services/Cards/FetchCards";

import {
  Card,
  CardBody,
  Typography,
  CardFooter,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { TaskModel } from "../../models/TaskModel";
import Comments from "../Comments/Comment";

const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
const token: string = import.meta.env.VITE_APP_TOKEN ?? "";

export default function Task({
  id,
  name,
  idList,
  handleOnDragStart,
  handleOnDragOver,
}: TaskModel) {
  const { refetch } = useCards(idList);
  const [size, setSize] = React.useState(null);
  const [memberIDs, setMembers] = React.useState();
  const [idBoard, setidBoard] = React.useState("");
  const [fullNames, setFullNames] = useState<Record<string, string>>({});
  const [data, setData] = useState<TaskModel | null>(null);
  const handleOpen = (value: any) => setSize(value);
  const [open, setOpen] = React.useState(false);
  const handleOpend = () => setOpen((cur) => !cur);
  const [inputValue, setInputValue] = useState<string>(""); // Valeur initiale vide

  const getData = async () => {
    try {
      const res = await fetch(
        `https://api.trello.com/1/card/${id}/?key=${apiKey}&token=${token}`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setData(data);
      setInputValue(data.desc);
      const idBoard = data.idBoard;
      setidBoard(idBoard);
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const putData = async (description: string) => {
    try {
      const res = await fetch(
        `https://api.trello.com/1/card/${id}/?key=${apiKey}&token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            desc: description,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      getData();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    fetch(
      `https://api.trello.com/1/cards/${id}?&key=${apiKey}&token=${token}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la task");
        }
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (idBoard === "") return;
    try {
      fetch(
        `https://api.trello.com/1/boards/${idBoard}/memberships?key=${apiKey}&token=${token}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        res.json().then((data) => {
          const memberIds = data.map(
            (member: { idMember: any }) => member.idMember
          );
          setMembers(memberIds);
          getMembersFullName(memberIds);
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [idBoard]);

  const getMembersFullName = async (idMembers: string[]) => {
    try {
      const fullNameMap: Record<string, string> = {};

      await Promise.all(
        idMembers.map(async (id) => {
          const response = await fetch(
            `https://api.trello.com/1/members/${id}?key=${apiKey}&token=${token}`
          );

          if (!response.ok) {
            throw new Error(
              `Erreur lors de la récupération des informations pour l'ID ${id}`
            );
          }

          const data = await response.json();
          fullNameMap[id] = data.fullName;
        })
      );
      setFullNames(fullNameMap);
      return fullNameMap;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const putMembers = async (idmembers: string) => {
    try {
      const res = await fetch(
        `https://api.trello.com/1/card/${id}/?key=${apiKey}&token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idMembers: idmembers,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      getData();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div
      className="Task"
      draggable
      onDragStart={(event) => handleOnDragStart(event, id)}
      onDragOver={handleOnDragOver}
    >
      <Card
        className="mt-3 w-70 grid gap-y-0 grid-row-2 p-0 opacity-100 hover:border-2 hover:border-bleu border-2"
        placeholder={undefined}
      >
        <div className="flex flex-row-reverse pr-1 pt-1">
          <VscChromeClose
            className="cursor-pointer mr-2 text-bleu hover:bg-gray2 hover:rounded-md"
            onClick={() => deleteTask(String(id))}
          />
        </div>
        <CardBody placeholder={undefined}>
          <Typography
            variant="h5"
            color="gray"
            className="mt-1 text-gray pt-0"
            placeholder={undefined}
          >
            {name}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0" placeholder={undefined}>
          <Button
            onClick={async () => {
              await getData();
              handleOpen("lg");
            }}
            variant="gradient"
            className=" rounded-full hover:bg-gray2 text-gray items-center hover:border-gray2 flex gap-2 focus:outline-none"
            placeholder={undefined}
          >
            Read More
          </Button>
          <Dialog
            open={size === "lg"}
            handler={handleOpen}
            placeholder={undefined}
          >
            <DialogHeader
              placeholder={undefined}
              className="mt-1 text-gray pt-0 flex justify-between"
            >
              {name}
              {memberIDs !== null && ( // Vérifiez si memberIds est non null avant de rendre la liste
                <div>
                  <label htmlFor="memberSelect">Sélectionner un membre :</label>
                  <select
                    id="memberSelect"
                    onChange={(e) => putMembers(e.target.value)}
                  >
                    <option value="">Choisissez un membre</option>
                    {(memberIDs ?? []).map(
                      (memberID: string | number, index: number) => (
                        <option key={index} value={memberID}>
                          {fullNames[memberID]}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </DialogHeader>
            <DialogBody placeholder={undefined}>
              <Typography
                color="gray"
                className="mt-1 text-gray pt-0"
                placeholder={undefined}
              >
                {data ? (
                  <div>
                    <div className="grid grid-rows-3 grid-cols-2 gap-2 pb-2">
                      <Typography
                        variant="h5"
                        color="gray"
                        className="mb-2 flex gap-3"
                        placeholder={undefined}
                      >
                        <VscQuote /> Description
                      </Typography>
                      <div className="row-start-2 col-start-1 col-span-3 overflow-auto">
                        <p>{data.desc}</p>
                      </div>
                      <div className="grid justify-items-end row-start-2 row-span-2">
                        <Button
                          onClick={handleOpend}
                          placeholder={undefined}
                          className=" rounded-full h-10 hover:bg-gray2 text-gray items-center borde:none hover:border-gray2 flex gap-2 focus:outline-none"
                        >
                          change
                        </Button>
                        <Dialog
                          size="lg"
                          open={open}
                          handler={handleOpend}
                          className="bg-transparent shadow-none"
                          placeholder={undefined}
                        >
                          <Card
                            className="mx-auto w-full max-w-[24rem] text-gray"
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
                                Edit description
                              </Typography>
                              <div>
                                <input
                                  type="text"
                                  className="border border-gray-300 rounded-md px-4 py-2 w-full bg-white"
                                  value={inputValue}
                                  onChange={(e) =>
                                    setInputValue(e.target.value)
                                  }
                                />
                              </div>
                            </CardBody>
                            <CardFooter placeholder={undefined}>
                              <div className="grid justify-items-center">
                                <Button
                                  variant="gradient"
                                  className=" rounded-full h-10 hover:bg-gray2 text-gray items-center borde:none hover:border-gray2 flex gap-2 focus:outline-none"
                                  onClick={() => {
                                    putData(inputValue);
                                    handleOpend();
                                  }}
                                  placeholder={undefined}
                                >
                                  change
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        </Dialog>
                        <></>
                      </div>
                      <Typography
                        variant="h5"
                        color="gray"
                        className="mt-4 flex row-start-3 gap-3 col-start-1 col-span-1"
                        placeholder={undefined}
                      >
                        <VscListFlat /> Comments
                      </Typography>
                    </div>
                    <div className="">
                      <Comments id={id} />
                    </div>
                  </div>
                ) : (
                  <div>Loading... ",</div>
                )}
              </Typography>
            </DialogBody>
            <DialogFooter placeholder={undefined}>
              {/* ici */}
              <Button
                variant="gradient"
                className=" rounded-full hover:bg-gray2 text-gray items-center borde:none hover:border-gray2 flex gap-2 focus:outline-none"
                onClick={() => handleOpen(null)}
                placeholder={undefined}
              >
                <span>Return</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
