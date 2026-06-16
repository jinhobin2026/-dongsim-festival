const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 조장용 안내 제목 변경 */
s = s.replaceAll("들것지기 조별 대상자 보기", "조별 전도대상자");

/* 현재 안내 문구 개선 */
s = s.replaceAll(
  "현재 {selectedGroup}에 등록된 전도 대상자만 표시됩니다.",
  "{selectedGroup}에 등록된 전도 대상자를 확인하고 관리합니다."
);

/* 조장용 순서 변경: WeeklyReportForm / PastorFeedbackList 를 대상자 목록 아래로 이동 */
s = s.replace(
`      <WeeklyReportForm
        user={{ ...user, stretcherGroup: selectedGroup }}
        reports={reports}
        setReports={setReports}
      />

      <PastorFeedbackList
        user={{ ...user, stretcherGroup: selectedGroup }}
        reports={reports}
      />

      <TargetForm
        onAdd={onAdd}
        currentUser={{ ...user, stretcherGroup: selectedGroup }}
        selectedGroup={selectedGroup}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myTargets.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            onUpdate={onUpdate}
            onInvite={onInvite}
            onDelete={onDelete}
          />
        ))}
      </div>`,
`      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myTargets.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            onUpdate={onUpdate}
            onInvite={onInvite}
            onDelete={onDelete}
          />
        ))}
      </div>

      <TargetForm
        onAdd={onAdd}
        currentUser={{ ...user, stretcherGroup: selectedGroup }}
        selectedGroup={selectedGroup}
      />

      <WeeklyReportForm
        user={{ ...user, stretcherGroup: selectedGroup }}
        reports={reports}
        setReports={setReports}
      />

      <PastorFeedbackList
        user={{ ...user, stretcherGroup: selectedGroup }}
        reports={reports}
      />`
);

fs.writeFileSync(file, s, "utf8");

console.log("조장용 화면 순서 변경 완료");
console.log("조별 전도대상자 문구 있음:", s.includes("조별 전도대상자"));