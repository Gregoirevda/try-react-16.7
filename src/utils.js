export const delay = (ms) => {
  let timer;
  return (cb, value) => {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => cb(value), ms);
  }
};
