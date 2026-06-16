const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 1. 모바일 나가기 버튼을 조장용/목사님용과 같은 줄에 나오게 변경 */
s = s.replaceAll(
  `className="col-span-2 rounded-2xl"`,
  `className="rounded-2xl"`
);

/* 2. 모바일 메뉴 영역을 2칸으로 유지 */
s = s.replaceAll(
  `className="md:hidden px-4 pb-4 grid grid-cols-2 gap-2 bg-white"`,
  `className="md:hidden px-4 pb-4 grid grid-cols-2 gap-2 bg-white"`
);

/* 3. 메인 큰 제목 모바일 글씨 크기 줄이기 */
s = s.replace(
  `className="text-3xl md:text-5xl font-black leading-tight"`,
  `className="text-2xl md:text-5xl font-black leading-snug"`
);

fs.writeFileSync(file, s, "utf8");

console.log("모바일 메뉴/제목 레이아웃 수정 완료");
console.log("나가기 col-span 제거:", !s.includes("col-span-2 rounded-2xl"));
console.log("모바일 제목 text-2xl 적용:", s.includes("text-2xl md:text-5xl"));