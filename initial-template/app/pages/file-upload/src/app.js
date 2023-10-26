import Clock from "./deps/clock.js";
import View from "./deps/view.js";
const view = new View();
const clock = new Clock();
let took = "";

const worker = new Worker("./src/worker/worker.js", {
  type: "module",
});

worker.onmessage = ({ data }) => {
  if (data.status !== "done") return;
  clock.stop();
  view.updateElapsedTIme(`Process took ${took.replace("ago", "")}`);
};

worker.postMessage("enviado do pai");

view.configureOnFIleChange((file) => {
  worker.postMessage({
    file,
  });

  clock.start((time) => {
    took = time;
    view.updateElapsedTIme(`Process started ${time}`);
  });
});

async function fakeFetch() {
  const filePath = "/videos/frag_bunny.mp4";
  const response = await fetch(filePath, {
    method: "HEAD",
  });
  const file = new File([await response.blob()], filePath, {
    type: "video/mp4",
    lastModified: Date.now(),
  });
  const event = new Event("change");
  Reflect.defineProperty(event, "target", { value: { files: [file] } });

  document.getElementById("fileUpload").dispatchEvent(event);
}

fakeFetch();
