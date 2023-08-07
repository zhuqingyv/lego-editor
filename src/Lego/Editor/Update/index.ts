const update = {
  _map: new Map(),
  create(id: string, updater: any) {
    this._map.set(id, updater);
  },
  delete(id: string) {
    this._map.delete(id);
  },
  find(id: string) {
    return this._map.get(id);
  }
};

export default update;