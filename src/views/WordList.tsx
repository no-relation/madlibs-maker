import {
  Button,
  List,
  ListItem,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FillInType, isAtWordRepeated } from "../interfaces";
import React, { useEffect, useState } from "react";
import { isNaN, startCase, toLower } from "lodash";

import deepcopy from "deepcopy";
import { resetStyle } from "./ShowStyles";

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
    let capitalized = startCase(toLower(dashesRemoved));
    if (isAtWordRepeated(wordType)) {
      const wordArray = capitalized.split(" ");
      wordArray.splice(wordArray.length - 1, 1, "(multiple)");
      capitalized = wordArray.join(" ");
    }

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
