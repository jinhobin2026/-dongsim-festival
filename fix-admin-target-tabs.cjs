const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* AdminView 함수 시작 부분에 조별 대상자 탭 상태 추가 */
s = s.replace(
  `function AdminView({ targets, reports, setReports }) {
  const byDept = useMemo(() => {`,
  `function AdminView({ targets, reports, setReports }) {
  const [selectedTargetGroup, setSelectedTargetGroup] = useState("전체");

  const targetGroupTabs = ["전체", ...stretcherGroups];

  const adminVisibleTargets = targets.filter((target) => {
    return selectedTargetGroup === "전체" || target.stretcherGroup === selectedTargetGroup;
  });

  const byDept = useMemo(() => {`
);

/* 초청 대상자 현황 제목 아래에 조별 탭 추가 */
s = s.replace(
  `<h3 className="text-lg font-black mb-4">초청 대상자 현황</h3>
          <div className="space-y-3">`,
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

          <div className="space-y-3">`
);

/* targets.map 을 adminVisibleTargets.map 으로 변경 */
s = s.replace(
  `{targets.map((t) => (`,
  `{adminVisibleTargets.map((t) => (`
);

/* 대상자가 없을 때 안내 문구 추가 */
s = s.replace(
  `          <div className="space-y-3">
            {adminVisibleTargets.map((t) => (`,
  `          <div className="space-y-3">
            {adminVisibleTargets.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500 text-center">
                선택한 조에 등록된 초청 대상자가 없습니다.
              </div>
            )}

            {adminVisibleTargets.map((t) => (`
);

fs.writeFileSync(file, s, "utf8");

console.log("목사님용 초청 대상자 조별 탭 수정 완료");
console.log("selectedTargetGroup 있음:", s.includes("selectedTargetGroup"));
console.log("adminVisibleTargets 있음:", s.includes("adminVisibleTargets"));
console.log("targetGroupTabs 있음:", s.includes("targetGroupTabs"));