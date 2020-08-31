import { EventBus } from "./event-bus";

export interface IPlugin {
  eventBus: EventBus;

  initialize(): void;
}
