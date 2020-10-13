import React, { Dispatch } from "react";

interface ClientFetchInfo {
  method?: string;
  body?: object;
  authenticated: boolean;
}

export class Client {
  constructor() {
    
  }

  async fetch(
    url: string,
    { method, body, authenticated = true }: ClientFetchInfo
  ) {
    const token = ''; // TODO: get token
    const resp = await fetch(url, {
      method: method || (body ? "POST" : "GET"),
      headers: {
        ...(body ? { "Content-Type": "application/json" } : undefined),
        ...(authenticated ? { Authorization: `Bearer ${token}` } : undefined),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    const respBody = await resp.json();
    return {
      ...resp,
      ok: resp.ok,
      body: respBody,
    };
  }
  // TODO: verify state before logging in
  async login({ token }: { token: string }) {
    const resp = await this.fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
      authenticated: false,
      body: { token },
    });
    return resp;
  }
}

interface UserState {
  loggedIn: boolean;
}

interface PlainUserAction {
  type: "loggedIn" | "loggedOut";
}

type UserAction = PlainUserAction;

export const initialState = { loggedIn: false };

export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "loggedIn":
      return { ...state, loggedIn: true };
    case "loggedOut":
      return { ...state, loggedIn: false };
  }
}

interface UserContextType {
  client: Client,
  state: UserState,
  dispatch: Dispatch<UserAction>
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export default UserContext;
