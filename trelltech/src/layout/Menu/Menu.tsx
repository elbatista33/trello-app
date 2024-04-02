import { Link } from "react-router-dom";
import { useState } from "react";
import useTable from "../../Services/WorkSpaces/FetchTables";
import { BoardModel } from "../../models/BoardModel";
import useWorkSpaces from "../../Services/WorkSpaces/FetchWorkSpaces";
import "./Menu.css";
import { WorkSpaceModel } from "../../models/WorkSpaceModel";
import { useCreateWorkSpace } from "../../Services/WorkSpaces/CreateWorkSpace";
import { useDeleteWorkSpace } from "../../Services/WorkSpaces/DeleteWorkSpace";
import {
  Button,
  Card,
  CardBody,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { VscChromeClose } from "react-icons/vsc";


export default function Menu() {
  const { data: tables } = useTable();
  const { data: workspaces, refetch: refetchWorkSpaces } = useWorkSpaces();
  const createWorkSpaceMutation = useCreateWorkSpace();
  const deleteWorkSpaceMutation = useDeleteWorkSpace();
  const [workspaceName, setWorkspaceName] = useState("");

  const handleCreateWorkSpace = () => {
    if (workspaceName) {
      createWorkSpaceMutation.mutate(workspaceName, {
        onSuccess: () => {
          setWorkspaceName("");
          refetchWorkSpaces();
        },
      });
    }
  };

  const handleDeleteWorkSpace = (id: string) => {
    deleteWorkSpaceMutation.mutate(id, {
      onSuccess: () => {
        refetchWorkSpaces();
      },
    });
  };

  console.log("Tables:", tables);
  tables &&
    tables.forEach((table: BoardModel) =>
      console.log("Rendering link with shortLink:", table.shortLink)
    );

  return (

    <div className="flex items-center px-4 py-3">
      <div className="menu-list-boards w-1/2">
        <div className="bg-gray-800 min-h-screen">
          <Card className=" h-screen w-96" placeholder={undefined}>
            <CardBody placeholder={undefined}>
              <Typography variant="h5" placeholder={undefined} color="blue-gray" className="mb-2 text-gray">
                Your Workspaces
              </Typography>
              {workspaces &&
                workspaces.map((workspace: WorkSpaceModel) => (
                  <div key={workspace.id} className="mb-2 flex justify-between">
                    <Link
                      to={`/workspace/${workspace.id}`}
                      className="text-gray hover:text-bleu"
                    >
                      <List placeholder={undefined} className="flex justify-between">
                        <ListItem placeholder={undefined} className="hover:bg-gray2">{workspace.displayName}</ListItem>
                      </List>
                    </Link>
                    <VscChromeClose
                      className="cursor-pointer mr-2 text-bleu hover:bg-gray2 hover:rounded-md self-center"
                      onClick={() => {
                        console.log("Delete workspace:", workspace.id);
                        handleDeleteWorkSpace(workspace.id);
                      }}
                    />
                  </div>
                ))}
            </CardBody>
          </Card>
        </div>
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
              Create a Workspace
            </Typography>
            <div>
              <input
                type="text"
                className="border border-gray-300 rounded-md mb-5 px-4 py-2 w-full bg-white"
                placeholder="Workspace Name..."
                value={workspaceName}
                onChange={(e) =>
                  setWorkspaceName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateWorkSpace();
                  }
                }}
              />
              <Button
                variant="gradient"
                className=" rounded-full h-10 hover:bg-gray2 text-gray items-center borde:none hover:border-gray2 flex gap-2 focus:outline-none"
                onClick={() => {
                  { handleCreateWorkSpace() }
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
