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

export function debounce(fn, ms) {
  let timer; //closure
  return function () {
    // console.log("debounce", fn, ms);
    console.warn("inner fn", this);
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      console.log("timeout", this);
      // fn(e); // callback
      // fn.call(this, e); /// doar cu arowfunction
      // fn.apply(this, arguments); /// doar cu arowfunction
      fn.apply(context, args);
    });
  };
}
