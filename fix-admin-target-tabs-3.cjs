const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 혹시 이전 실패로 중복된 adminVisibleTargets가 있으면 먼저 제거 */
s = s.replace(
  /\n\s*const adminVisibleTargets = targets\.filter\(\(target\) => \{[\s\S]*?\n\s*\}\);\n/g,
  "\n"
);

/* AdminView 내부 const byDept 바로 앞에 필요한 상태값 추가 */
s = s.replace(
  /(function AdminView\(\{ targets, reports, setReports \}\) \{\s*)const byDept = useMemo/,
  `$1const [selectedTargetGroup, setSelectedTargetGroup] = useState("전체");

  const targetGroupTabs = ["전체", ...stretcherGroups];

  const adminVisibleTargets = targets.filter((target) => {
    return selectedTargetGroup === "전체" || target.stretcherGroup === selectedTargetGroup;
  });

  const byDept = useMemo`
);

/* 초청 대상자 현황 영역에 탭 UI 추가 */
s = s.replace(
  /<h3 className="text-lg font-black mb-4">초청 대상자 현황<\/h3>\s*<div className="space-y-3">\s*\{adminVisibleTargets\.map\(\(t\) => \(/,
  `<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-black">초청 대상자 현황</h3>
              <p className="text-sm text-slate-500 mt-1">
                전체 또는 조별로 전도 대상자를 확인할 수 있습니다.
              </p>
            </div>
            <Pill>{selectedTargetGroup} {adminVisibleTargets.length}명</Pill>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {targetGroupTabs.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedTargetGroup(group)}
                className={\`px-4 py-2 rounded-2xl text-sm font-bold \${
                  selectedTargetGroup === group
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-600"
                }\`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {adminVisibleTargets.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500 text-center">
                선택한 조에 등록된 초청 대상자가 없습니다.
              </div>
            )}

            {adminVisibleTargets.map((t) => (`
);

/* 아직 targets.map이면 adminVisibleTargets.map으로 변경 */
s = s.replaceAll("{targets.map((t) => (", "{adminVisibleTargets.map((t) => (");

fs.writeFileSync(file, s, "utf8");

console.log("목사님용 초청 대상자 조별 탭 3차 수정 완료");
console.log("selectedTargetGroup 있음:", s.includes("selectedTargetGroup"));
console.log("targetGroupTabs 있음:", s.includes("targetGroupTabs"));
console.log("adminVisibleTargets 있음:", s.includes("adminVisibleTargets"));