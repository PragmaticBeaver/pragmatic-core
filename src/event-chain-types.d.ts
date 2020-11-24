export interface IChain {
  add(placeInOrder: number, cb: ChainCallback): ChainToken;
  remove(token: ChainToken): void;
  call(...args: unknown[]): Promise<unknown>;
  isEmpty(): boolean;
}

export interface ChainToken {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChainCallback = (...args: any[]) => Promise<any>;
