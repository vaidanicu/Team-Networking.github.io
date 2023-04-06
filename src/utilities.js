export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function $(selector) {
  return document.querySelector(selector);
}
