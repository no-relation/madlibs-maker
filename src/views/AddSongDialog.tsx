import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { Close } from "@material-ui/icons";
import deepcopy from "deepcopy";
import { isNil } from "lodash";

interface AddSongDialogProps {
  addSongDialogOpen: boolean;
  setAddSongDialogOpen: (open: boolean) => void;
}

const AddSongDialog = (props: AddSongDialogProps) => {
  const { addSongDialogOpen, setAddSongDialogOpen } = props;
  const handleClose = () => {
    setAddSongDialogOpen(false);
  };

  const SPOTIFY_CLIENT_ID_KEY = "spotifyClientId";
  const SPOTIFY_CLIENT_SECRET_KEY = "spotifyClientSecret";

  interface SpotifyClientId {
    id: string | undefined | null;
    secret: string | undefined | null;
    [x: string]: string | undefined | null;
  }
  const [clientId, setClientId] = useState<SpotifyClientId>({
    id: undefined,
    secret: undefined,
  });

  useEffect(() => {
    const clientId: SpotifyClientId = {
      id: process.env.REACT_APP_PERSONAL_SPOTIFY_CLIENT_ID,
      secret: process.env.REACT_APP_PERSONAL_SPOTIFY_CLIENT_SECRET,
    };
    if (clientId.id === undefined || clientId.secret === undefined) {
      clientId.id = localStorage.getItem(SPOTIFY_CLIENT_ID_KEY);
      clientId.secret = localStorage.getItem(SPOTIFY_CLIENT_SECRET_KEY);
    }
    if (!isNil(clientId.id) || !isNil(clientId.secret)) {
      updateClientLocalStorage("id", clientId.id!);
      updateClientLocalStorage("secret", clientId.secret!);
      setShowIdInput(false);
      setClientId(clientId);
    }
  }, [setClientId]);

  const isMissingClientId = useCallback(() => {
    return clientId.id === undefined || clientId.secret === undefined;
  }, [clientId.id, clientId.secret]);

  const [showIdInput, setShowIdInput] = useState(isMissingClientId());

  const [missingId, setMissingId] = useState(isMissingClientId());

  useEffect(() => {
    setMissingId(isMissingClientId());
  }, [clientId, isMissingClientId, setMissingId]);

  const handleClientIdUpdate = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const newClientId = deepcopy(clientId);
    newClientId[name] = value;
    setClientId(newClientId);
    updateClientLocalStorage(name, value);
  };

  const updateClientLocalStorage = (field: string, value: string) => {
    switch (field) {
      case "id":
        localStorage.setItem(SPOTIFY_CLIENT_ID_KEY, value);
        break;
      case "secret":
        localStorage.setItem(SPOTIFY_CLIENT_SECRET_KEY, value);
        break;
    }
  };

  const handleAddMissingId = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMissingId(false);
    setShowIdInput(false);
  };

  const InputClientIdContent = (): JSX.Element => {
    return (
      <DialogContent>
        <TextField
          id="client-id"
          name="id"
          value={clientId.id}
          onChange={handleClientIdUpdate}
          variant="outlined"
          label="Client ID"
        />
        <TextField
          id="client-secret"
          name="secret"
          value={clientId.secret}
          onChange={handleClientIdUpdate}
          variant="outlined"
          label="Client Secret"
        />
        <Button
          color="success"
          variant="contained"
          onClick={handleAddMissingId}
          disabled={missingId}
        >
          Search Spotify
        </Button>
        <DialogContentText>
          You can get your own client ID and secret by registering with{" "}
          <Link href="https://developer.spotify.com/">
            Spotify's developer program.
          </Link>{" "}
          Or you can ask Eddie. (If Eddie doesn't know you, there will be many
          questions.)
        </DialogContentText>
      </DialogContent>
    );
  };

  return (
    <Dialog open={addSongDialogOpen}>
      <DialogTitle>Add A Song from Spotify</DialogTitle>
      <IconButton
        onClick={handleClose}
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      {showIdInput ? (
        <InputClientIdContent />
      ) : (
        <DialogContent>
          <Button variant="contained" onClick={() => setShowIdInput(true)}>
            Re-enter Client ID
          </Button>
          This is the interface for adding a song from Spotify
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddSongDialog;
