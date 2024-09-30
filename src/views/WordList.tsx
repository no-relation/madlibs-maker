import React from "react";
import { FillInType } from "../interfaces";
import {
  List,
  ListItem,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface WordListProps {
  fillIns?: FillInType;
  setFillIns: (newFillIns: FillInType) => void;
}
const WordList = (props: WordListProps) => {
  const { fillIns, setFillIns } = props;

  return (
    <Paper elevation={2}>
      <Typography>Instructions for use</Typography>
      {fillIns &&
        Object.keys(fillIns).map((key) => (
          <List
            key={`${key}-list`}
            subheader={<ListSubheader>{key}</ListSubheader>}
          >
            {fillIns[key].map((fillInKey, idx) => (
              <ListItem key={`${key}-${idx}`}>
                <TextField
                  variant="outlined"
                  size="small"
                  name={key}
                  value={fillInKey}
                />
              </ListItem>
            ))}
          </List>
        ))}
    </Paper>
  );
};

export default WordList;
