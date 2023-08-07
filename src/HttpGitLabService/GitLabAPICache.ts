import localforage from 'localforage';

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'lego',
  version: 1, // 数据库版本
  storeName: 'gitlab-api', // 存储对象的名称
});