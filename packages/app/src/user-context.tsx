import React, { Dispatch } from "react";
import { ACCESS_TOKEN_STORAGE_KEY, ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants';

interface ClientFetchInfo {
  method?: string;
  body?: object;
  authenticated?: boolean;
}

export class Client {
  _accessToken?: string
  _accessTokenExpiresAt?: Date
  _refreshToken?: string
  
  onLoggedInStatusChanged?: (status: {loggedIn: boolean}) => void

  constructor() {
    
  }

  loadTokens() {
    if (typeof window !== 'undefined') {
      const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      const accessTokenExpiresAt = window.localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
      const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      if (typeof accessToken === 'string' && typeof refreshToken === 'string' && typeof accessTokenExpiresAt === 'string') {
        this._accessToken = accessToken
        this._accessTokenExpiresAt = new Date(Number(accessTokenExpiresAt))
        this._refreshToken = refreshToken
      }
    }
  }

  saveTokens() {
    if (typeof window !== 'undefined' && this._accessToken && this._accessTokenExpiresAt && this._refreshToken) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, this._accessToken);
      window.localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, this._accessTokenExpiresAt.valueOf().toString());
      window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, this._refreshToken);
    }
  }

  get hasCurrentAccessToken() {
    return !!(this._accessTokenExpiresAt && new Date() < this._accessTokenExpiresAt)
  }

  get hasRefreshToken() {
    return !!(this._refreshToken)
  }

  get loggedIn() {
    return this.hasCurrentAccessToken || this.hasRefreshToken;
  }

  async fetch(
    url: string,
    { method, body, authenticated = true }: ClientFetchInfo = {}
  ) {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${url}`, {
      method: method || (body ? "POST" : "GET"),
      headers: {
        ...(body ? { "Content-Type": "application/json" } : undefined),
        ...(authenticated ? { Authorization: `Bearer ${this._accessToken}` } : undefined),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    // TODO: if token is expired, refresh token and retry
    const respBody = await resp.json();
    return {
      ...resp,
      ok: resp.ok,
      body: respBody,
    };
  }

  async login({ token }: { token: string }) {
    const resp = await this.fetch('/sessions', {
      authenticated: false,
      body: { token },
    });
    if (resp.ok) {
      this._accessToken = resp.body.accessToken;
      this._accessTokenExpiresAt = new Date(resp.body.accessTokenExpiresAt);
      this._refreshToken = resp.body.refreshToken;
      this.saveTokens();
      if (this.onLoggedInStatusChanged) {
        this.onLoggedInStatusChanged({loggedIn: true});
      }
    }
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
