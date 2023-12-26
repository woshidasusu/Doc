/**
 * 顶部导航栏菜单配置
 */
export const navbar = [
  "/java速查/README.md",
  "/linux速查/README.md",
  "/nginx速查/README.md",
  "/psql速查/README.md",
  "/vim速查/README.md",
  "/云服务速查/README.md",
  {
    text: "docker",
    children: [
      "/docker速查/介绍.md",
      "/docker速查/docker命令.md",
      "/docker速查/Dockerfile.md",
    ],
  },
  {
    text: "docker-compose",
    children: [
      "/docker-compose速查/介绍.md",
      "/docker-compose速查/docker-compose命令.md",
      "/docker-compose速查/docker-compose模板.md",
    ],
  },
  {
    text: "面试题积累",
    link: "/面试题积累",
  },
];
