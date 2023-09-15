const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};
const isObjectEqual = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    // console.log("键数量不一,后面不用看了");
    return false;
  }
  for (let key of obj1Keys) {
    if (obj1[key] == obj2[key]) {
      // console.log(key, "值相等", obj1[key], obj2[key]);
    }
    if (obj1[key] !== obj2[key]) {
      // console.log(key, "值不相等", obj1[key], obj2[key]);
      return false;
    }
  }
  // console.log("送检对象相等", obj1, obj2);
  return true;
};
module.exports = {
  formatTime,
  isObjectEqual,
};
