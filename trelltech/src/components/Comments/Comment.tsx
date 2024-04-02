/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    List,
    ListItem,
    ListItemPrefix,
    Card,
    Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from 'react';
import { VscChromeClose } from "react-icons/vsc";

const apiKey: string = import.meta.env.VITE_APP_TRELLO_API_KEY ?? "";
const token: string = import.meta.env.VITE_APP_TOKEN ?? ""

interface CommentsComponentProps {
    id: number;
}

const CommentsComponent: React.FC<CommentsComponentProps> = ({ id }) => {

    const [comments, setComments] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [ids, setId] = useState<string[]>([]);
    const [commentInputValue, setCommentInputValue] = useState<string>("");



    const getComment = async () => {
        fetch(
            `https://api.trello.com/1/cards/${id}/actions?filter=commentCard&key=${apiKey}&token=${token}`
        )
            .then(response => {
                // Vérifiez si la réponse est réussie (statut 200)
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commentaires');
                }
                return response.json();
            })
            .then(data => {
                // Une fois les données récupérées, extrayez les commentaires et mettez-les à jour dans l'état local
                const extractedComments = data.map((comment: any) => comment.data.text);
                setComments(extractedComments);
                const usernames = getUsernames(data);
                setUsernames(usernames);
                const extractedId = data.map((comment: any) => comment.id);
                setId(extractedId);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getUsernames = (data: any[]): string[] => {
        return data.map((item: any) => item.memberCreator.username);
    };

    const deleteComment = (actionId: string) => {
        fetch(`https://api.trello.com/1/actions/${actionId}?key=${apiKey}&token=${token}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du commentaire');
                }
                getComment();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const postComment = async (comment: string) => {
        try {
            const res = await fetch(
                `https://api.trello.com/1/cards/${id}/actions/comments?key=${apiKey}&token=${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: comment
                    }),
                }
            );
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            getComment();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    useEffect(() => {
        getComment();
    }, []);
    return (
        <div>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}><Card className="bg-gray2 mb-2 p-0 grid grid-cols-2" placeholder={undefined}>
                        <div className="col-start-1 col-span-5">
                            <List placeholder={undefined}>
                                <ListItem placeholder={undefined}>
                                    <VscChromeClose className="cursor-pointer mr-2" onClick={() => deleteComment(ids[index])} />

                                    <ListItemPrefix placeholder={undefined}>
                                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-bleu2 rounded-full dark:bg-gray-600">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">
                                                {usernames[index].substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>

                                    </ListItemPrefix>
                                    <div>
                                        <Typography placeholder={undefined} variant="h6" color="blue-gray">
                                            {usernames[index]}

                                        </Typography>
                                        <Typography placeholder={undefined} variant="small" color="gray" className="font-normal">
                                            {comment}

                                        </Typography>
                                    </div>
                                </ListItem>

                            </List>
                        </div>

                    </Card></li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    className="border border-gray2 rounded-md px-4 py-2 w-full bg-white mt-2"
                    placeholder="Add a comment..."
                    value={commentInputValue}
                    onChange={(e) => setCommentInputValue(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            postComment(commentInputValue);
                            setCommentInputValue('');

                        }
                    }}
                />
            </div>
        </div>
    );
};

export default CommentsComponent;
