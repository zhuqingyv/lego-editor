/**
 * @description 一个事件的发布与订阅工具
 * @feature TODO: 支持留言(先发消息，后监听)
 * @feature TODO: 支持Promise类型的emit结果反馈
 * @feature TODO: add 通过双Map结构保存，提高remove性能(空间换时间)
 */
import {
  AddHandleType,
  AddParams,
  AnyHandle,
  EventsType,
  RemoveHandleType,
} from './types';

class EventsCore {
  _events: EventsType = {};

  _add: AddHandleType = ({ name, callback, once = false, context }) => {
    const eventHub = this._initEvent(name);
    eventHub.push({
      name,
      callback,
      once,
      context,
    });
  };

  _remove: RemoveHandleType = ({ name, callback }) => {
    const eventHub = this._initEvent(name);
    if (!eventHub.length || name === undefined || name === null) return;

    // Remove all events instance
    if (!callback) {
      return delete this._events[name];
    }

    // Remove events by name & callback
    const newHub = eventHub.filter((eventInstance) => {
      return eventInstance.callback !== callback;
    });

    const hasChange = newHub.length !== eventHub.length;
    if (hasChange) this._events[name] = newHub;

    return hasChange;
  };

  _get = ({ name }: { name: string }) => {
    const eventHub = this._events[name];
    if (!eventHub?.length) return [];
    return eventHub;
  };

  _run = (eventInstance: AddParams, ...rest: any[]) => {
    if (!eventInstance) return;
    const { callback, context, once, name } = eventInstance;

    if (context) {
      callback.call(context, ...rest);
    } else {
      callback(...rest);
    }

    if (once) this._remove({ name, callback });
  };

  _initEvent = (name: string) => {
    const eventHub = this._events[name];
    if (eventHub?.length) return eventHub;
    return (this._events[name] = []);
  };

  get length() {
    const eventTypeList = Object.keys(this._events);
    return eventTypeList.reduce((length, eventType) => {
      const eventHubLength = this._events[eventType].length;
      return length + eventHubLength;
    }, 0);
  }
}

class Events extends EventsCore {
  on = (name: string, callback: AnyHandle, context?: any) => {
    this._add({ name, callback, context });
  };

  once = (name: string, callback: AnyHandle, context?: any) => {
    this._add({ name, callback, context, once: true });
  };

  off = (name: string, callback?: AnyHandle) => {
    return this._remove({ name, callback });
  };

  emit = (name: string, ...arg: any[]) => {
    const eventHub = this._get({ name });
    eventHub.forEach((eventInstance) => this._run(eventInstance, ...arg));
  };

  destroy = () => {
    this._events = {};
  };
}

export default Events;

export const events = new Events();
