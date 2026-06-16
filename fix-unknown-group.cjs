const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

function replaceLog(find, replace, label) {
  if (!s.includes(find)) {
    console.log("이미 적용되었거나 찾지 못함:", label);
    return;
  }

  s = s.replace(find, replace);
  console.log("적용 완료:", label);
}

/* 1. 들것지기 미포함조1/2를 미지정조로 변경 */
replaceLog(
`  "12조": ["이상은", "김용주", "박성민", "전민규"],
  "들것지기 미포함조1": [],
  "들것지기 미포함조2": [],
};`,
`  "12조": ["이상은", "김용주", "박성민", "전민규"],
  "미지정조": [],
};`,
"stretcherGroupMembers 미지정조 변경"
);

/* 2. 조장 정보 변경 */
replaceLog(
`  "12조": "이상은",
  "들것지기 미포함조1": "미지정",
  "들것지기 미포함조2": "미지정",
};`,
`  "12조": "이상은",
  "미지정조": "라은혜",
};`,
"groupLeaders 미지정조 변경"
);

/* 3. 목사님 로그인 기본 그룹 변경 */
replaceLog(
`  { id: 3, name: "목사님", stretcherGroup: "들것지기 미포함조1", phone: "010-0000-0000", role: "admin" },`,
`  { id: 3, name: "목사님", stretcherGroup: "미지정조", phone: "010-0000-0000", role: "admin" },`,
"목사님 기본 그룹 변경"
);

/* 4. 조장 로그인 선택 목록에서 미지정조도 보이도록 변경 */
replaceLog(
`  {stretcherGroups
    .filter((group) => !group.includes("미포함"))
    .map((group) => (`,
`  {stretcherGroups
    .map((group) => (`,
"로그인 조 선택 목록 미지정조 포함"
);

/* 5. TargetForm 전도인 선택 select를 미지정조에서는 직접 입력 input으로 변경 */
replaceLog(
`          <select className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none cursor-pointer" value={evangelistName} onChange={(e) => setEvangelistName(e.target.value)}>
            <option value="">전도인 선택</option>
            {groupMemberOptions.map((member) => <option key={member} value={member}>{member}</option>)}
          </select>`,
`          {stretcherGroup === "미지정조" ? (
            <input
              className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="전도인 이름 직접 입력"
              value={evangelistName}
              onChange={(e) => setEvangelistName(e.target.value)}
            />
          ) : (
            <select
              className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none cursor-pointer"
              value={evangelistName}
              onChange={(e) => setEvangelistName(e.target.value)}
            >
              <option value="">전도인 선택</option>
              {groupMemberOptions.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          )}`,
"대상자 등록 미지정조 전도인 직접 입력"
);

/* 6. 미지정조 안내 문구 개선 */
replaceLog(
`<div className="mt-1 text-xs leading-5">조장 및 조원: {groupMemberOptions.length ? groupMemberOptions.join(", ") : "조원 미지정 — 전도인 이름을 직접 입력해 주세요."}</div>`,
`<div className="mt-1 text-xs leading-5">
            {stretcherGroup === "미지정조"
              ? "미지정조는 조원 목록 없이 전도인 이름을 직접 입력합니다."
              : \`조장 및 조원: \${groupMemberOptions.length ? groupMemberOptions.join(", ") : "조원 미지정"}\`}
          </div>`,
"미지정조 안내 문구 변경"
);

/* 7. WeeklyReportForm 보고자 선택을 미지정조에서는 직접 입력 input으로 변경 */
replaceLog(
`          <select className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700" value={leaderName} onChange={(e) => setLeaderName(e.target.value)}>
            <option value="">조장 선택</option>
            {leaderOptions.map((member) => <option key={member} value={member}>{member}</option>)}
          </select>`,
`          {reportGroup === "미지정조" ? (
            <input
              className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700"
              placeholder="보고자 이름 직접 입력"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
            />
          ) : (
            <select
              className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
            >
              <option value="">조장 선택</option>
              {leaderOptions.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          )}`,
"주간보고 미지정조 보고자 직접 입력"
);

/* 8. changeReportGroup에서 미지정조는 라은혜 기본값 적용 */
replaceLog(
`  const changeReportGroup = (group) => {
    setReportGroup(group);
    setLeaderName(groupLeaders[group] || "");
  };`,
`  const changeReportGroup = (group) => {
    setReportGroup(group);
    setLeaderName(group === "미지정조" ? "라은혜" : groupLeaders[group] || "");
  };`,
"주간보고 미지정조 기본 보고자 라은혜"
);

/* 9. 대상자 등록 시 미지정조에서 전도인 이름 없으면 안내 */
replaceLog(
`    if (!name.trim()) return alert("대상자 이름을 입력해 주세요.");`,
`    if (!name.trim()) return alert("대상자 이름을 입력해 주세요.");
    if (!evangelistName.trim()) return alert("전도인 이름을 입력해 주세요.");`,
"전도인 이름 필수 체크"
);

/* 10. 혹시 기존 데이터에 들것지기 미포함조가 남아 있을 경우 화면에서는 미지정조로 보정 */
replaceLog(
`  stretcherGroup: data.stretcherGroup || "1조",`,
`  stretcherGroup:
    data.stretcherGroup === "들것지기 미포함조1" || data.stretcherGroup === "들것지기 미포함조2"
      ? "미지정조"
      : data.stretcherGroup || "1조",`,
"기존 미포함조 데이터 미지정조로 보정"
);

fs.writeFileSync(file, s, "utf8");

console.log("");
console.log("==========================================");
console.log("미지정조 자동 수정 완료");
console.log("미지정조 포함:", s.includes('"미지정조"'));
console.log("라은혜 조장 포함:", s.includes('"미지정조": "라은혜"'));
console.log("전도인 직접 입력 포함:", s.includes("전도인 이름 직접 입력"));
console.log("==========================================");