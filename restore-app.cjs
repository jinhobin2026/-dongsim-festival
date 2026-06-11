const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

if (!s.includes("const reportWeeks = [")) {
  s = s.replace(
    /const festivalSchedule = \[[\s\S]*?\];/,
    `$&

const reportWeeks = [
  "6월 1주차",
  "6월 2주차",
  "6월 3주차",
  "6월 4주차",
  "7월 1주차",
  "7월 2주차",
  "7월 3주차",
];`
  );
}

s = s.replace(
  `const [week, setWeek] = useState("5월 4주차");`,
  `const [week, setWeek] = useState("6월 1주차");`
);

s = s.replace(
  /<option>5월 4주차<\/option>\s*<option>6월 1주차<\/option>\s*<option>6월 2주차<\/option>\s*<option>6월 3주차<\/option>\s*<option>6월 4주차<\/option>\s*<option>7월 1주차<\/option>\s*<option>7월 2주차<\/option>\s*<option>7월 3주차<\/option>/,
  `{reportWeeks.map((week) => (
              <option key={week}>{week}</option>
            ))}`
);

s = s.replace(
  /const weekTabs = \[\s*"전체",[\s\S]*?filter\(Boolean\)\)\),\s*\];/,
  `const weekTabs = ["전체", ...reportWeeks];`
);

s = s.replace(
  /const visibleReports = reports\.filter\(\(r\) => \{[\s\S]*?return roleMatch && weekMatch;\s*\}\);/,
  `const visibleReports = reports.filter((r) => {
  const roleMatch = isAdmin || r.stretcherGroup === user.stretcherGroup;
  const validWeek = reportWeeks.includes(r.week);
  const weekMatch = selectedWeek === "전체" || r.week === selectedWeek;
  return roleMatch && validWeek && weekMatch;
});`
);

s = s.replace(
  /<Button className="col-span-2 h-12 rounded-2xl bg-rose-500 hover:bg-rose-600" onClick=\{\(\) => onInvite\(target\)\}>\s*<Mail className="w-4 h-4 mr-2" \/> 초대장 만들기\s*<\/Button>/,
  `<Button
            type="button"
            disabled
            className="col-span-2 h-12 rounded-2xl bg-slate-300 text-slate-500 cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
          >
            <Mail className="w-4 h-4 mr-2" /> 초대장 준비중
          </Button>`
);

s = s.replace(
  /<StatCard icon=\{Gift\} label="선물 완료" value=\{myTargets\.reduce\(\(a, t\) => a \+ \(t\.gifts \|\| \[\]\)\.filter\(Boolean\)\.length, 0\)\} sub="1~3차 합계" \/>/,
  `<StatCard icon={Gift} label="1차 선물" value={myTargets.filter((t) => (t.gifts || [])[0]).length} />
        <StatCard icon={Gift} label="2차 선물" value={myTargets.filter((t) => (t.gifts || [])[1]).length} />
        <StatCard icon={Gift} label="3차 선물" value={myTargets.filter((t) => (t.gifts || [])[2]).length} />`
);

s = s.replace(
  `className="grid grid-cols-2 md:grid-cols-4 gap-3"`,
  `className="grid grid-cols-2 md:grid-cols-6 gap-3"`
);

fs.writeFileSync(file, s, "utf8");

console.log("완료: src/App.jsx 강제 수정됨");
console.log("reportWeeks:", s.includes("reportWeeks"));
console.log("초대장 준비중:", s.includes("초대장 준비중"));