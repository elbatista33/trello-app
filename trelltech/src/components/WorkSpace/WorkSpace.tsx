import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { BoardModel } from "../../models/BoardModel";
import useCreateBoard from "../../Services/Boards/CreateBoard";
import useDeleteBoard from "../../Services/Boards/DeleteBoard";
import useBoardFromWorkSpace from "../../Services/WorkSpaces/fetchBoardFromWorkSpace";
import {
  Button,
  Card,
  CardBody,
  List,
  ListItem,
  // List,
  // ListItem,
  Typography,
} from "@material-tailwind/react";
import { VscChromeClose } from "react-icons/vsc";

export default function WorkSpace() {
  const { id } = useParams<{ id: string }>();
  const { data: boards, refetch: refetchBoards } = useBoardFromWorkSpace(
    id || "default-id"
  );
  const [boardName, setBoardName] = useState("");
  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();

  const handleCreateBoard = () => {
    if (boardName) {
      createBoardMutation.mutate(boardName, {
        onSuccess: () => {
          setBoardName("");
          refetchBoards();
        },
      });
    }
  };

  return (
    <div className="flex items-center px-4 py-3">
      <div className="menu-list-boards w-1/2">
        <div className="bg-gray-800 min-h-screen">
          <Card className=" h-screen w-96" placeholder={undefined}>
            <CardBody placeholder={undefined}>
              <Typography variant="h5" placeholder={undefined} color="blue-gray" className="mb-2 text-gray">
                Your boards
              </Typography>
              {boards &&
                boards.map((board: BoardModel, index: number) => (
                  <div key={index} className="mb-2 flex justify-between items-stretch">
                    <Link
                      to={`/board/${board.id}`}
                      className="text-gray hover:text-bleu "
                    >
                      <List placeholder={undefined} className="flex justify-between">
                        <ListItem placeholder={undefined} className="hover:bg-gray2">{board.name}</ListItem>
                      </List>
                    </Link>
                    <VscChromeClose
                      className="cursor-pointer mr-2 text-bleu hover:bg-gray2 hover:rounded-md self-center"
                      onClick={() => {
                        deleteBoardMutation.mutate(board.id, {
                          onSuccess: () => {
                            refetchBoards();
                          },
                        });
                      }}
                    />
                  </div>
                ))}{" "}
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex">
        {" "}
      </div>
      <div className="w-1/2 ml-4">
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
              Create a new board
            </Typography>
            <div>
              <input
                type="text"
                className="border border-gray-300 rounded-md mb-5 px-4 py-2 w-full bg-white"
                placeholder="Board Name..."
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateBoard();
                  }
                }}
              />
              <Button
                variant="gradient"
                className=" rounded-full h-10 hover:bg-gray2 text-gray items-center borde:none hover:border-gray2 flex gap-2 focus:outline-none"
                onClick={() => {
                  { handleCreateBoard() }
                }}
                placeholder={undefined}
              >
                Create
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
