export interface OapiConfig {
  [key: string]: {
    domain: string;
  };
}

export interface DomainConfig {
  top: string;
  sub: string;
  main: string;
}

export interface AppConfig {
  domain?: DomainConfig;
  adminCookieKey?: string;
  localLogin?: {
    loginUrl: string;
    username: string;
    password: string;
  };
  oapis?: OapiConfig;
}

export type ConfigFunction = () => AppConfig;