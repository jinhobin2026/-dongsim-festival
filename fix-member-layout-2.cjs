const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replaceAll("들것지기 조별 대상자 보기", "조별 전도대상자");

s = s.replaceAll(
  "현재 {selectedGroup}에 등록된 전도 대상자만 표시됩니다.",
  "{selectedGroup}에 등록된 전도 대상자를 확인하고 관리합니다."
);

const oldBlock = `      <WeeklyReportForm
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
      </div>`;

const newBlock = `      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      />`;

if (s.includes(oldBlock)) {
  s = s.replace(oldBlock, newBlock);
} else {
  console.log("기존 블록을 찾지 못했습니다. 이미 변경되었을 수 있습니다.");
}

fs.writeFileSync(file, s, "utf8");

console.log("조장용 화면 위치 변경 완료");
console.log("조별 전도대상자 있음:", s.includes("조별 전도대상자"));
console.log("수정 저장 있음:", s.includes("수정 저장"));