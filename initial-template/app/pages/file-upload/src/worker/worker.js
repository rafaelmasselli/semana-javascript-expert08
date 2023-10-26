onmessage = ({ data }) => {
  debugger
  setTimeout(() => {
    self.postMessage({ status: "done" });
  }, 2000);
  self.postMessage({
    status: "done",
  });
};
