import React, { Dispatch } from "react";
import { ACCESS_TOKEN_STORAGE_KEY, ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants';

interface ClientFetchInfo {
  method?: string;
  body?: object;
  authenticated?: boolean;
  refresh?: boolean;
}

export class Client {
  _accessToken?: string
  _accessTokenExpiresAt?: Date
  _refreshToken?: string
  
  onLoggedInStatusChanged?: (status: {loggedIn: boolean}) => void

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
    if (typeof window !== 'undefined') {
      if (this._accessToken && this._accessTokenExpiresAt && this._refreshToken) {
        window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, this._accessToken);
        window.localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, this._accessTokenExpiresAt.valueOf().toString());
        window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, this._refreshToken);
      } else {
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
        window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      }
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
    { method, body, authenticated = true, refresh = false }: ClientFetchInfo = {}
  ): Promise<{ ok: boolean, status ?: number, body?: any, error?: Error }> {
    if (authenticated && !this.hasCurrentAccessToken) {
      if (this.hasRefreshToken) {
        const refreshed = await this.refresh();
        if (!refreshed) {
          return { ok: false, error: new Error('Error refreshing token') };
        }
      } else {
        return { ok: false, error: new Error('Not logged in') };
      }
    }

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${url}`, {
      method: method || (body ? "POST" : "GET"),
      headers: {
        ...(body ? { "Content-Type": "application/json" } : undefined),
        ...(authenticated ? { Authorization: `Bearer ${this._accessToken}` } : undefined),
        ...(refresh ? { Authorization: `Bearer ${this._refreshToken}` } : undefined),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    let respBody;
    if (resp.ok) {
      respBody = await resp.json();
    } else {
      try {
        respBody = await resp.text();
        respBody = JSON.parse(respBody);
      } catch (err) {
        // do nothing
      }
      if (resp.status === 401) {
        const refreshed = await this.refresh();
        if (refreshed) {
          return await this.fetch(url, {method, body, authenticated});
        } else {
          return { ok: false, error: new Error('Error refreshing token') };
        }
      }
    }
    return {
      ok: resp.ok,
      status: resp.status,
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

  async refresh() {
    const resp = await this.fetch('/tokens/refresh', {
      authenticated: false,
      refresh: true,
      body: {},
    });
    if (resp.ok) {
      this._accessToken = resp.body.accessToken;
      this._accessTokenExpiresAt = new Date(resp.body.accessTokenExpiresAt);
      this._refreshToken = resp.body.refreshToken;
      this.saveTokens();
      return true;
    } else if (resp.status === 401) {
      this.logout();
    }
    return false
  }

  logout() {
    this._accessToken = undefined
    this._accessTokenExpiresAt = undefined
    this._refreshToken = undefined
    this.saveTokens();
    if (this.onLoggedInStatusChanged) {
      this.onLoggedInStatusChanged({loggedIn: false});
    }
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
