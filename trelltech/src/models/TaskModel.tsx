export interface TaskModel {
  id: number;
  name: string;
  idList: string;

  desc: string;
  handleOnDragStart: (event: React.DragEvent, id: number) => void;
  handleOnDragOver: (event: React.DragEvent) => void;
  handleOnDrop: (event: React.DragEvent, laneId: number) => void;
}
