import { IEventChain } from "./event-chain";

export interface IPlugin {
  initialize(): void;
}

export abstract class ChainPluginBase {
  public eventChain: IEventChain;

  public abstract initialize(): Promise<void>;

  constructor(chain: IEventChain) {
    this.eventChain = chain;
  }
}
