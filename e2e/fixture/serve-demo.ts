import { getFreePort } from "../../test/utils/get-free-port";
import * as cp from "child_process";
import * as path from "path";

export const serveDemo = async () => {
  const { port } = await getFreePort();
  let child: cp.ChildProcess | undefined;
  await new Promise(resolve => {
    child = cp.spawn(
      `npx`,
      ["vite", "preview", "--outDir", "./demo-dist", "--port", `${port}`],
      {
        cwd: path.join(__dirname, "../../"),
        stdio: "inherit",
      }
    );
    setTimeout(resolve, 5000);
  });
  const testUrl = `http://localhost:${port}`;
  return {
    demoUrl: testUrl,
    port,
    close: () => {
      child?.kill();
    },
  };
};
