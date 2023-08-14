const 文件模块 = require("fs"); //导入node文件读写模块
let 小程序可用Dom列表 = [
  "view",
  // "scroll-view",
  "text",
  "button",
  "input",
  "checkbox",
  "radio",
  "navigator",
  "image",
  "span",
  "swiper",
  // "swiper-item",
  "icon",
  "picker",
];
const 单层通配符替换 = (通配符样式 = "*::before") => {
  let outPut数组 = [];
  小程序可用Dom列表.forEach((小程序Dom) => {
    outPut数组.push(通配符样式.replace("*", 小程序Dom));
  });
  return outPut数组;
};
const 两层通配符替换 = (多层通配符 = ".table> view:not(caption)>*>*") => {
  let outPut数组 = [];
  小程序可用Dom列表.forEach((小程序Dom) => {
    outPut数组.push(多层通配符.replace(">*>", `>${小程序Dom}>`));
  });
  return outPut数组;
};
const 子元素省略通配符的伪类替换 = (子元素伪类样式 = "> :last-chlid") => {
  let outPut数组 = [];
  小程序可用Dom列表.forEach((小程序Dom) => {
    outPut数组.push(子元素伪类样式.replace("> :", `> ${小程序Dom}:`));
  });
  return outPut数组;
};
const 括号修正 = (arr) => {
  return arr.map((line, index) => {
    let 是否为通配符替换导致的括号重复 = false;
    for (let 小程序Dom of 小程序可用Dom列表) {
      if (line.includes(小程序Dom)) {
        是否为通配符替换导致的括号重复 = true;
        break;
      }
    }
    if (
      line.includes("{") &&
      arr[index + 1].includes("{") &&
      是否为通配符替换导致的括号重复
    )
      return line.replace("{", ",");
    else return line;
  });
};
const $ = (读取文件) => {
  let css = 文件模块.readFileSync(读取文件).toString("UTF8").split("\n"); //同步读取,阻碍后续进行,获得文件每一行文本组成的数组
  for (let i = 0; i < 3; i += 1) {
    let 备份 = [];
    css.forEach((line) => {
      if (line.includes(":root")) {
        备份.push(line.replace(":root", "page,tab-bar"));
      } else if (line.search(/:not\({1}\.{1}[\w|-]*:{1}[\w|-]*\){1}/) != -1) {
        // 小程序中,:not排除选择器中,只能填入1层(1级堆叠),而bootstrap中有 :not(.className::last-child)的选择器,不符合要求
      } else if (
        line.includes(`*,`) ||
        line.includes(`* ,`) ||
        line.includes(`*::`) ||
        (line.includes(`* {`) && !line.includes("*>*"))
      ) {
        备份.push(...单层通配符替换(line));
      } else if (line.includes("*>*")) {
        备份.push(...两层通配符替换(line));
      } else if (line.includes("> :")) {
        备份.push(...子元素省略通配符的伪类替换(line));
      } else if (line.includes("~")) {
        备份.push(line.replace("~", "+")); //小程序完全不支持~兄弟选择器,只能退而求其次选择+相邻兄弟选择器
      }
      // 如果没有符合条件的行，则直接写入wxss中
      else 备份.push(line);
    });
    css = 备份;
  }
  文件模块.writeFileSync("bootstrap.wxss", 括号修正(css).join("\n"));
};
$("./bootstrap.css");
