import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

import { useState } from "react";

interface ApiProps {
  baseUrl: string;
}

interface ApiState {
  loading: boolean;
  error: boolean;
  data: any[];
}

const Api = (props: ApiProps) => {
  const instance = axios.create({ baseURL: props.baseUrl });

  const [state, setState] = useState<ApiState>({
    loading: true,
    error: false,
    data: [],
  });

  const get = async (url: string, headers: AxiosHeaders) => {
    const config: AxiosRequestConfig = { headers };
    try {
      // setState({loading: true, error: false, data: []})
      const response = await instance.get(url, config);
      setState({ loading: false, error: false, data: response.data });
    } catch (err) {
      setState({ loading: false, error: true, data: [] });
      console.error(err);
    }
  };

  return state;
};

export default Api;
