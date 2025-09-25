// import("./async1").then(mod => {
//   console.log("in index ", mod);
// });

const modules = import.meta.glob("./glob-async/*");
for (const key in modules) {
  const mod = modules[key];
  mod().then(mod => {
    console.dir("in index glob sync ", mod);
  });
}
