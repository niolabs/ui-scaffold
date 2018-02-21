export const get = (key, jsonParse) => (jsonParse ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key));

export const set = (key, value, jsonStringify) => (jsonStringify ? localStorage.setItem(key, JSON.stringify(value)) : localStorage.setItem(key, value));

export const remove = key => localStorage.removeItem(key);
