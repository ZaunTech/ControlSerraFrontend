import { Button, Icon, IconButton, TableCell, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IActions {
  id: number;
  showDeleteButton?: boolean;
  handleDelete?: (id: number) => void;
  showEditButton?: boolean;
  handleEdit?: () => void;
  showListButton?: boolean;
  handleShowList?: (id: number) => void;
  showSelectButton?: boolean;
  handleSelectButton?: () => void;
  showPersoButton?: boolean;
  persoButtonText?: string;
  persoButtonIcon?: string;
  handlePersoButton?: () => void;
}

export const Actions: React.FC<IActions> = ({
  id,
  showDeleteButton = true,
  handleDelete,
  showEditButton = true,
  handleEdit,
  showListButton = false,
  handleShowList,
  showSelectButton = false,
  handleSelectButton,
  showPersoButton = false,
  persoButtonIcon,
  handlePersoButton,
  persoButtonText
}) => {
  const navigate = useNavigate();

  return (
    <TableCell>
      {showPersoButton && (
        persoButtonText ? (
          <Button startIcon={<Icon>{persoButtonIcon}</Icon>} variant="text" onClick={() => {
            if (handlePersoButton) handlePersoButton();
          }}>
            <Typography>{persoButtonText}</Typography>
          </Button>
        ) : <IconButton
          onClick={() => {
            if (handlePersoButton) handlePersoButton();
          }}
        >
          <Icon>{persoButtonIcon}</Icon>
          <Typography>{persoButtonText}</Typography>
        </IconButton>
      )}
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
      {showSelectButton && (
        <IconButton
          onClick={() => {
            if (handleSelectButton) handleSelectButton();
          }}
        >
          <Icon>check_box</Icon>
        </IconButton>
      )}
      {showSelectButton && (
        <IconButton
          onClick={() => {
            if (handleSelectButton) handleSelectButton();
          }}
        >
          <Icon>check_box</Icon>
        </IconButton>
      )}
    </TableCell>
  );
};
