const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /return Object\.values\(map\)\.sort\(\(a, b\) => parseInt\(a\.dept\) - parseInt\(b\.dept\)\);/,
  `return Object.values(map).sort((a, b) => {
      if (a.dept === "미지정조") return 1;
      if (b.dept === "미지정조") return -1;
      return parseInt(a.dept) - parseInt(b.dept);
    });`
);

fs.writeFileSync(file, s, "utf8");

console.log("조별 전도현황 정렬 수정 완료");
console.log("미지정조 맨 아래 정렬:", s.includes('a.dept === "미지정조"'));