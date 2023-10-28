import { Icon, IconButton, TableCell, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IActions {
  id: number;
  showDeleteButton?: boolean;
  handleDelete?: (id: number) => void;
  showEditButton?: boolean;
  handleEdit?: () => void;
  showListButton?: boolean;
  handleShowList?: (id: number) => void;
}

export const Actions: React.FC<IActions> = ({
  id,
  showDeleteButton = true,
  handleDelete,
  showEditButton = true,
  handleEdit,
  showListButton = false,
  handleShowList,
}) => {
  const navigate = useNavigate();

  return (
    <TableCell>
      {showListButton && (
        <IconButton
          onClick={() => {
            if (handleShowList) handleShowList(id);
          }}
        >
          <Icon>list</Icon>
        </IconButton>
      )}
      {showEditButton && (
        <IconButton
          onClick={
            handleEdit
              ? () => handleEdit()
              : () => navigate(`${location.pathname}/${id}`)
          }
        >
          <Icon>edit</Icon>
        </IconButton>
      )}
      {showDeleteButton && (
        <IconButton
          onClick={() => {
            if (handleDelete) handleDelete(id);
          }}
        >
          <Icon>delete</Icon>
        </IconButton>
      )}
    </TableCell>
  );
};
