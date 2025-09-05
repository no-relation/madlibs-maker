import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

import { isNil } from "lodash";

interface BearerToken {
  access_token: string;
  expires_in: number;
  expireTime: Date;
}

interface SpotifyArtistSearchReturn {
  id: string;
  name: string;
}

interface SpotifyAlbumSearchReturn {
  album_type: string;
  artists: SpotifyArtistSearchReturn[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  is_playable: boolean;
  images: Array<{
    height: number;
    width: number;
    url: number;
  }>;
}
interface SpotifyTrackSearchReturn {
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  href: string;
  artists: SpotifyArtistSearchReturn[];
  album: SpotifyAlbumSearchReturn;
}

export interface SpotifyClientId {
  id: string | undefined | null;
  secret: string | undefined | null;
  [x: string]: string | undefined | null;
}

interface SpotifyApiProps {
  clientId?: SpotifyClientId;
}

const SpotifyApi = (props: SpotifyApiProps) => {
  const SPOTIFY_BASE_URL = "https://api.spotify.com/v1/";
  const instance = axios.create();

  const [token, setToken] = useState<BearerToken | undefined>(undefined);

  const setBearerToken = async () => {
    if (props.clientId !== undefined) {
      const { id, secret } = props.clientId;
      if (!isNil(id) && !isNil(secret)) {
        const body = {
          grant_type: "client_credentials",
          client_id: id,
          client_secret: secret,
        };
        const headers = new AxiosHeaders();
        headers.setContentType("application/x-www-form-urlencoded");

        try {
          const response: AxiosResponse<BearerToken> = await instance.post(
            "https://accounts.spotify.com/api/token",
            body,
            { headers }
          );

          const token = response.data;
          const expireTime = new Date();
          expireTime.setTime(expireTime.getTime() + token.expires_in * 1000);
          token.expireTime = expireTime;
          setToken(token);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const tokenIsExpired = (): boolean => {
    const now = new Date();
    return token === undefined || now >= token.expireTime;
  };

  useEffect(() => {
    setBearerToken();
    return () => {
      setToken(undefined);
    };
  }, []);

  const search = async (searchTerms: string) => {
    if (tokenIsExpired()) {
      setBearerToken();
    }

    try {
      const response: AxiosResponse<SpotifyTrackSearchReturn> =
        await instance.get(
          `${SPOTIFY_BASE_URL}search?q=${searchTerms}&type=track&market=US&include_external=audio`
        );

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };
};

export default SpotifyApi;
// check if valid spotify auth token
//  if not:
//   get spotify auth token
//      https://developer.spotify.com/documentation/web-api/tutorials/getting-started

// search:
//  https://api.spotify.com/v1/search?q=karaoke don't go breakin my heart&type=track&market=US&include_external=audio
