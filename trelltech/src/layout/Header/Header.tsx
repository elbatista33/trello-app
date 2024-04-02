import { Disclosure } from "@headlessui/react";
import useWorkSpaces from "../../Services/WorkSpaces/FetchWorkSpaces";
import { WorkSpaceModel } from "../../models/WorkSpaceModel";
import { Link } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { Button } from "@material-tailwind/react";

export default function Header() {
  const { data: workspaces, status: workspacesStatus } = useWorkSpaces();

  if (workspacesStatus === "success") {
    console.log(workspaces);

    return (
      <Disclosure as="nav" className="bg-white">
        {() => (
          <>
            <div className="mx-auto px-2 sm:px-6 lg:px-8 justify-center">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-16 w-auto"
                    src="../../public/logo.png"
                    alt="Your Company"
                  />
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {workspaces &&
                        workspaces.map(
                          (workspace: WorkSpaceModel, index: number) => (
                            <div key={index}>
                              <Link
                                style={{
                                color: "#16697A",
                                textDecoration: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.25rem",
                                fontSize: "1rem",
                                fontWeight: "500",
                                backgroundColor: "transparent",
                                transition: "background-color 0.3s",
                              }}
                                to={`/workspace/${workspace.id}`}
                                aria-current={
                                  workspace.current ? "page" : undefined
                                }
                                 onMouseEnter={(e: { target: { style: { backgroundColor: string; }; }; }) => e.target.style.backgroundColor = "#EDE7E3"}
                                 onMouseLeave={(e: { target: { style: { backgroundColor: string; }; }; }) => e.target.style.backgroundColor = "transparent"}
                              >
                                {workspace.displayName}
                              </Link>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
                <Link to="/">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Button
                      variant="outlined"
                      className="text-bleu relative flex rounded-full hover:border-bleu text-sm focus:outline-none"
                      placeholder={undefined}
                    >
                      <CiMenuBurger />
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    );
  }
}
