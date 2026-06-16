const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 1. groupLeaders 미지정조 라은혜로 강제 변경 */
s = s.replace(
  /  "들것지기 미포함조1": "미지정",\s*\n  "들것지기 미포함조2": "미지정",/,
  `  "미지정조": "라은혜",`
);

/* 2. stretcherGroupMembers 미포함조 제거 후 미지정조 추가 */
s = s.replace(
  /  "들것지기 미포함조1": \[\],\s*\n  "들것지기 미포함조2": \[\],/,
  `  "미지정조": [],`
);

/* 3. TargetForm 전도인 선택 select를 미지정조에서는 직접 입력으로 변경 */
s = s.replace(
  /<select className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none cursor-pointer" value=\{evangelistName\} onChange=\{\(e\) => setEvangelistName\(e\.target\.value\)\}>\s*<option value="">전도인 선택<\/option>\s*\{groupMemberOptions\.map\(\(member\) => <option key=\{member\} value=\{member\}>\{member\}<\/option>\)\}\s*<\/select>/,
  `{stretcherGroup === "미지정조" ? (
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
          )}`
);

/* 4. WeeklyReportForm 보고자 선택 select를 미지정조에서는 직접 입력으로 변경 */
s = s.replace(
  /<select className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700" value=\{leaderName\} onChange=\{\(e\) => setLeaderName\(e\.target\.value\)\}>\s*<option value="">조장 선택<\/option>\s*\{leaderOptions\.map\(\(member\) => <option key=\{member\} value=\{member\}>\{member\}<\/option>\)\}\s*<\/select>/,
  `{reportGroup === "미지정조" ? (
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
          )}`
);

/* 5. TargetForm 조 변경 시 미지정조는 전도인 이름을 비우고 직접 입력 유도 */
s = s.replace(
  /const changeStretcherGroup = \(group\) => \{\s*setStretcherGroup\(group\);\s*setEvangelistName\(""\);\s*if \(onGroupChange\) onGroupChange\(group\);\s*\};/,
  `const changeStretcherGroup = (group) => {
    setStretcherGroup(group);
    setEvangelistName("");
    if (onGroupChange) onGroupChange(group);
  };`
);

/* 6. WeeklyReportForm 조 변경 시 미지정조는 라은혜 기본값 */
s = s.replace(
  /const changeReportGroup = \(group\) => \{\s*setReportGroup\(group\);\s*setLeaderName\(groupLeaders\[group\] \|\| ""\);\s*\};/,
  `const changeReportGroup = (group) => {
    setReportGroup(group);
    setLeaderName(group === "미지정조" ? "라은혜" : groupLeaders[group] || "");
  };`
);

/* 7. 대상자 등록 시 전도인 이름 필수 */
s = s.replace(
  /if \(!name\.trim\(\)\) return alert\("대상자 이름을 입력해 주세요\."\);/,
  `if (!name.trim()) return alert("대상자 이름을 입력해 주세요.");
    if (!evangelistName.trim()) return alert("전도인 이름을 입력해 주세요.");`
);

/* 8. normalizeTarget 기존 미포함조 데이터를 미지정조로 표시 */
s = s.replace(
  /stretcherGroup: data\.stretcherGroup \|\| "1조",/,
  `stretcherGroup:
    data.stretcherGroup === "들것지기 미포함조1" || data.stretcherGroup === "들것지기 미포함조2"
      ? "미지정조"
      : data.stretcherGroup || "1조",`
);

fs.writeFileSync(file, s, "utf8");

console.log("미지정조 2차 수정 완료");
console.log("미지정조 있음:", s.includes('"미지정조"'));
console.log("라은혜 조장 있음:", s.includes('"미지정조": "라은혜"'));
console.log("전도인 직접 입력 있음:", s.includes("전도인 이름 직접 입력"));
console.log("보고자 직접 입력 있음:", s.includes("보고자 이름 직접 입력"));