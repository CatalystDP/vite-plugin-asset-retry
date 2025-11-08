import * as net from "net";

export const getFreePort = async (): Promise<{
  port: number;
}> => {
  const s = net.createServer();
  return new Promise(resolve => {
    s.listen(0, () => {
      const { port } = s.address() as net.AddressInfo;
      s.close(() => {
        resolve({ port });
      });
    });
  });
};
