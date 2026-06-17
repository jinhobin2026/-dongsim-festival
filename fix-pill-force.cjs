const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* Pill 컴포넌트를 한 줄 고정 + 크기 축소로 변경 */
s = s.replace(
  /function Pill\(\{ children[\s\S]*?\n\}/,
`function Pill({ children, className = "" }) {
  return (
    <span
      className={\`inline-flex items-center gap-1 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 \${className}\`}
    >
      {children}
    </span>
  );
}`
);

/* 상태 배지만 더 작게 보이도록 적용 */
s = s.replaceAll(
  `<Pill>{statusEmoji[target.status]} {target.status}</Pill>`,
  `<Pill className="text-[11px] px-2 min-w-fit">{statusEmoji[target.status]} {target.status}</Pill>`
);

fs.writeFileSync(file, s, "utf8");

console.log("Pill 한 줄 강제 수정 완료");
console.log("whitespace-nowrap 있음:", s.includes("whitespace-nowrap"));
console.log("상태 배지 축소 적용:", s.includes("text-[11px] px-2 min-w-fit"));