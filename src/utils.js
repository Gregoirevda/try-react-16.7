export const delay = (ms, cb) => {
  let timer;
  return value => {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => cb(value), ms);
  }
};
