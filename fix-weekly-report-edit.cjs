const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf("function WeeklyReportForm(");
const end = s.indexOf("function PastorCommentEditor", start);

if (start === -1 || end === -1) {
  console.log("WeeklyReportForm 또는 PastorCommentEditor 위치를 찾지 못했습니다.");
  console.log("start:", start, "end:", end);
  process.exit(1);
}

const newWeeklyReportForm = String.raw`
function WeeklyReportForm({ user, reports, setReports }) {
  const [week, setWeek] = useState("6월 1주차");
  const [reportGroup, setReportGroup] = useState(user.stretcherGroup || "1조");
  const [leaderName, setLeaderName] = useState(groupLeaders[user.stretcherGroup] || user.name || "");
  const [contactCount, setContactCount] = useState(0);
  const [mealCount, setMealCount] = useState(0);
  const [giftCount, setGiftCount] = useState(0);
  const [inviteCount, setInviteCount] = useState(0);
  const [expectedCount, setExpectedCount] = useState(0);
  const [prayer, setPrayer] = useState("");
  const [note, setNote] = useState("");
  const [editingReportId, setEditingReportId] = useState(null);

  const leaderOptions = stretcherGroupMembers[reportGroup] || [];
  const myReports = reports
    .filter((report) => report.stretcherGroup === user.stretcherGroup)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const resetForm = () => {
    setEditingReportId(null);
    setWeek("6월 1주차");
    setReportGroup(user.stretcherGroup || "1조");
    setLeaderName(groupLeaders[user.stretcherGroup] || user.name || "");
    setContactCount(0);
    setMealCount(0);
    setGiftCount(0);
    setInviteCount(0);
    setExpectedCount(0);
    setPrayer("");
    setNote("");
  };

  const submitReport = async () => {
    const report = {
      week,
      stretcherGroup: reportGroup,
      leaderName: leaderName || groupLeaders[reportGroup] || "조장",
      contactCount: Number(contactCount) || 0,
      mealCount: Number(mealCount) || 0,
      giftCount: Number(giftCount) || 0,
      inviteCount: Number(inviteCount) || 0,
      expectedCount: Number(expectedCount) || 0,
      prayer,
      note,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    if (editingReportId) {
      await updateDoc(doc(db, "reports", String(editingReportId)), report);
      alert("주간 활동보고가 수정되었습니다.");
    } else {
      await addDoc(collection(db, "reports"), { ...report, pastorComment: "" });
      alert("주간 활동보고가 제출되었습니다.");
    }

    resetForm();
  };

  const editReport = (report) => {
    setEditingReportId(report.id);
    setWeek(report.week || "6월 1주차");
    setReportGroup(report.stretcherGroup || user.stretcherGroup || "1조");
    setLeaderName(report.leaderName || groupLeaders[report.stretcherGroup] || user.name || "");
    setContactCount(report.contactCount || 0);
    setMealCount(report.mealCount || 0);
    setGiftCount(report.giftCount || 0);
    setInviteCount(report.inviteCount || 0);
    setExpectedCount(report.expectedCount || 0);
    setPrayer(report.prayer || "");
    setNote(report.note || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteReport = async (report) => {
    if (!window.confirm(report.week + " 활동보고를 삭제하시겠습니까?")) return;
    await deleteDoc(doc(db, "reports", String(report.id)));
    if (editingReportId === report.id) resetForm();
    alert("주간 활동보고가 삭제되었습니다.");
  };

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <h3 className="font-black text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-orange-500" />
          {editingReportId ? "주간 활동보고 수정" : "주간 활동보고 작성"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" value={week} onChange={(e) => setWeek(e.target.value)}>
            {reportWeeks.map((week) => <option key={week}>{week}</option>)}
          </select>

          <select className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" value={reportGroup} disabled>
            <option value={reportGroup}>{reportGroup}</option>
          </select>

          {reportGroup === "미지정조" ? (
            <input className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} />
          ) : (
            <select className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700" value={leaderName} onChange={(e) => setLeaderName(e.target.value)}>
              <option value="">조장 선택</option>
              {leaderOptions.map((member) => <option key={member} value={member}>{member}</option>)}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input type="number" value={contactCount} onChange={(e) => setContactCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="접촉인원" />
          <input type="number" value={mealCount} onChange={(e) => setMealCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="식사/만남" />
          <input type="number" value={giftCount} onChange={(e) => setGiftCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="선물전달" />
          <input type="number" value={inviteCount} onChange={(e) => setInviteCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="초대장전달" />
          <input type="number" value={expectedCount} onChange={(e) => setExpectedCount(e.target.value)} className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="참석예상" />
        </div>

        <textarea className="w-full min-h-24 rounded-2xl bg-slate-50 p-4 outline-none" placeholder="특별 기도제목" value={prayer} onChange={(e) => setPrayer(e.target.value)} />
        <textarea className="w-full min-h-24 rounded-2xl bg-slate-50 p-4 outline-none" placeholder="기타 보고 / 도움이 필요한 부분" value={note} onChange={(e) => setNote(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {editingReportId && <Button type="button" variant="outline" className="h-12 rounded-2xl" onClick={resetForm}>수정 취소</Button>}
          <Button className="h-12 rounded-2xl bg-orange-500 hover:bg-orange-600" onClick={submitReport}>
            {editingReportId ? "수정 저장하기" : "보고서 제출하기"}
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-black text-base">제출한 주간 활동보고</h4>

          {myReports.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">아직 제출한 주간 활동보고가 없습니다.</div>}

          {myReports.map((report) => (
            <div key={report.id} className="rounded-2xl bg-slate-50 p-4 space-y-3">
              <div className="flex justify-between gap-2">
                <div>
                  <div className="font-black">{report.week} · {report.stretcherGroup}</div>
                  <div className="text-xs text-slate-500">보고자 {report.leaderName} · 작성일 {report.createdAt}</div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={() => editReport(report)}>수정</Button>
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={() => deleteReport(report)}>삭제</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className="rounded-xl bg-white p-3">접촉 <b>{report.contactCount}</b></div>
                <div className="rounded-xl bg-white p-3">식사 <b>{report.mealCount}</b></div>
                <div className="rounded-xl bg-white p-3">선물 <b>{report.giftCount}</b></div>
                <div className="rounded-xl bg-white p-3">초대장 <b>{report.inviteCount}</b></div>
                <div className="rounded-xl bg-white p-3">참석예상 <b>{report.expectedCount}</b></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

`;

s = s.slice(0, start) + newWeeklyReportForm + s.slice(end);

fs.writeFileSync(file, s, "utf8");

console.log("조장용 주간 활동보고 수정/삭제 기능 추가 완료");
console.log("수정 저장하기 있음:", s.includes("수정 저장하기"));
console.log("제출한 주간 활동보고 있음:", s.includes("제출한 주간 활동보고"));