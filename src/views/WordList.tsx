import React, { useEffect, useState } from "react";
import { FillInType, resetStyle } from "../interfaces";
import {
  List,
  ListItem,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { isNaN, startCase, toLower } from "lodash";
import deepcopy from "deepcopy";
import { Button } from "@material-ui/core";

interface WordListProps {
  fillIns?: FillInType;
  setFillIns: (newFillIns: FillInType) => void;
  resetFillIns: () => void;
}
const WordList = (props: WordListProps) => {
  const { fillIns, setFillIns, resetFillIns } = props;
  const [fillInState, setFillInState] = useState(fillIns);

  useEffect(() => {
    setFillInState(fillIns);
  }, [fillIns]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name: key, value } = event.target;
    const newFillInState = deepcopy(fillInState);
    const idx = parseInt(id);
    if (newFillInState && !isNaN(idx)) {
      newFillInState[key][idx] = value;
      setFillInState(newFillInState);
    }
  };

  const handleBlur = (_: React.FocusEvent<HTMLTextAreaElement>) => {
    if (fillInState) {
      setFillIns(fillInState);
    }
  };

  const handleReset = () => {
    resetFillIns();
  };

  const renderWordType = (wordType: string) => {
    const dashesRemoved = wordType.replace("-", " ").replace("_", " ");
    const capitalized = startCase(toLower(dashesRemoved));
    return capitalized;
  };

  return (
    <Paper elevation={2}>
      <Typography>
        Add whatever words you like to match the word type prompted
      </Typography>
      <Button style={resetStyle} onClick={handleReset}>
        Reset
      </Button>
      {fillInState &&
        Object.keys(fillInState).map((key) => (
          <List
            key={`${key}-list`}
            subheader={<ListSubheader>{renderWordType(key)}</ListSubheader>}
          >
            {fillInState[key].map((fillInKey, idx) => (
              <ListItem key={`${key}-${idx}`}>
                <TextField
                  id={idx.toString()}
                  onChange={handleTextChange}
                  onBlur={handleBlur}
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
