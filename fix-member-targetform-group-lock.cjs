const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
`          <select className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none" value={stretcherGroup} onChange={(e) => changeStretcherGroup(e.target.value)}>
            {stretcherGroups.map((group) => <option key={group}>{group}</option>)}
          </select>`,
`          <select
            className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
            value={stretcherGroup}
            onChange={(e) => changeStretcherGroup(e.target.value)}
            disabled
          >
            <option value={stretcherGroup}>{stretcherGroup}</option>
          </select>`
);

fs.writeFileSync(file, s, "utf8");

console.log("조장용 전도대상자 등록 조 선택 잠금 완료");
console.log("disabled 적용:", s.includes("disabled"));