export const LoadingStatus = {
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
  SUCCESS: "success",
} as const;

export type TLoadingStatus = (typeof LoadingStatus)[keyof typeof LoadingStatus];

export type TError = string | null;

export interface IBaseState {
  error: TError;
  status: TLoadingStatus;
}
