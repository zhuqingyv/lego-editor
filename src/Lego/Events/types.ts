export type AnyHandle = (...arg: any[]) => any;

// Add
export interface AddParams {
  name: string;
  callback: AnyHandle;
  once?: boolean;
  context?: any;
}

export type AddHandleType = (params: AddParams) => any;

// Remove { name, callback }
export interface RemoveParams {
  name: string;
  callback?: (params: any) => any;
}
export type RemoveHandleType = (params: RemoveParams) => any;

// Events
export type EventsType = {
  [key: string]: AddParams[];
};
