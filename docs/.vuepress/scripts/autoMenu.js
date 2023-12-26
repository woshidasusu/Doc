const path = require("path");
const fs = require("fs-extra");

const out = path.resolve(__dirname, "../configs/navbar/");
const docs = path.resolve(__dirname, "../../");
const fileTree = [];

function traverseDirectory(dir, callback) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      callback(err, null);
      return;
    }

    const promises = files.map((file) => {
      const filePath = path.join(dir, file);

      return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stat) => {
          if (err) {
            console.error("Error getting file/folder stats:", err);
            reject(err);
            return;
          }

          if (stat.isFile()) {
            // 判断文件扩展名是否为 .md
            if (path.extname(file) === ".md") {
              // 提取文件名并打印
              const pathStr = path
                .relative(docs, filePath)
                .replace("README.md", "");
              const pathArr = pathStr.split(path.sep).filter((v) => !!v);
              if (pathArr.length) {
                const level1 = pathArr.shift();
                let p = fileTree.find((v) => v.text === level1);
                if (!p) {
                  p = {
                    text: level1,
                    children: [],
                  };
                  fileTree.push(p);
                }

                const level3 = pathArr.pop().replace(".md", "");

                if (pathArr.length) {
                  const level2 = pathArr.join("-");
                  const children = p.children;
                  p = children.find((v) => v.text === level2);
                  if (!p) {
                    p = {
                      text: level2,
                      children: [],
                    };
                    children.push(p);
                  }
                  if (!p.children) {
                    p.children = [];
                  }
                }
                p.children.push({
                  text: level3,
                  link:
                    "/" + path.relative(docs, filePath).replaceAll("\\", "/"),
                });
              }
            }
          } else if (stat.isDirectory()) {
            resolve(traverseDirectory(filePath, callback));
          }
          resolve();
        });
      });
    });

    Promise.all(promises)
      .then(() => {
        callback(null, fileTree);
      })
      .catch((error) => {
        callback(error, null);
      });
  });
}

traverseDirectory(docs, (err, result) => {
  if (err) {
    console.error("遍历目录出错:", err);
    return;
  }

  result.forEach((item) => {
    const fileName = `${item.text}.js`;
    const filePath = path.join(out, fileName);
    item.children.sort((a, b) => {
      const l = (a.children || {}).length || 0;
      const r = (b.children || {}).length || 0;
      return l - r;
    });
    const fileContent = JSON.stringify(item, null, 2);

    fs.writeFile(filePath, `export default ${fileContent}`, (err) => {
      if (err) {
        console.error(`写入文件 ${fileName} 出错:`, err);
        return;
      }

      console.log(`文件 ${fileName} 已成功写入到目录:`, out);
    });
  });
});
