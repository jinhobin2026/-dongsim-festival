const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /<select[^>]*value=\{stretcherGroup\}[^>]*onChange=\{\(e\) => changeStretcherGroup\(e\.target\.value\)\}[^>]*>[\s\S]*?\{stretcherGroups\.map\(\(group\) => <option key=\{group\}>\{group\}<\/option>\)\}[\s\S]*?<\/select>/,
  `<select
            className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none text-slate-700"
            value={stretcherGroup}
            disabled
          >
            <option value={stretcherGroup}>{stretcherGroup}</option>
          </select>`
);

fs.writeFileSync(file, s, "utf8");

console.log("전도대상자 등록 조 선택 강제 잠금 완료");
console.log("stretcherGroups.map 제거됨:", !s.includes("{stretcherGroups.map((group) => <option key={group}>{group}</option>)}"));
console.log("disabled 있음:", s.includes("value={stretcherGroup}") && s.includes("disabled"));