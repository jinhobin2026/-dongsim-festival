const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf("function TargetCard({ target, onUpdate, onInvite, onDelete })");
const end = s.indexOf("function PastorFeedbackList", start);

if (start === -1 || end === -1) {
  console.log("TargetCard 위치를 찾지 못했습니다.");
  console.log("start:", start, "end:", end);
  process.exit(1);
}

const newTargetCard = `function TargetCard({ target, onUpdate, onInvite, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(target.name || "");
  const [editRelation, setEditRelation] = useState(target.relation || "");
  const [editPhone, setEditPhone] = useState(target.phone || "");
  const [editMemo, setEditMemo] = useState(target.memo || "");
  const [editEvangelistName, setEditEvangelistName] = useState(target.evangelistName || target.ownerName || "");
  const [editStatus, setEditStatus] = useState(target.status || "기도중");
  const [editAttending, setEditAttending] = useState(target.attending || "미정");

  useEffect(() => {
    setEditName(target.name || "");
    setEditRelation(target.relation || "");
    setEditPhone(target.phone || "");
    setEditMemo(target.memo || "");
    setEditEvangelistName(target.evangelistName || target.ownerName || "");
    setEditStatus(target.status || "기도중");
    setEditAttending(target.attending || "미정");
  }, [target]);

  const statusIndex = statuses.indexOf(target.status);

  const saveEdit = async () => {
    if (!editName.trim()) {
      alert("대상자 이름을 입력해 주세요.");
      return;
    }

    if (!editEvangelistName.trim()) {
      alert("전도인 이름을 입력해 주세요.");
      return;
    }

    await onUpdate(target.id, {
      name: editName.trim(),
      relation: editRelation.trim(),
      phone: editPhone.trim(),
      memo: editMemo.trim(),
      evangelistName: editEvangelistName.trim(),
      ownerName: editEvangelistName.trim(),
      status: editStatus,
      attending: editAttending,
      lastContact: new Date().toISOString().slice(0, 10),
    });

    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditName(target.name || "");
    setEditRelation(target.relation || "");
    setEditPhone(target.phone || "");
    setEditMemo(target.memo || "");
    setEditEvangelistName(target.evangelistName || target.ownerName || "");
    setEditStatus(target.status || "기도중");
    setEditAttending(target.attending || "미정");
    setIsEditing(false);
  };

  return (
    <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {!isEditing ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">{target.name}</h3>
                <div className="text-sm text-slate-500 mt-1">
                  {target.relation || "관계 미입력"} · 들것지기 {target.stretcherGroup || "미지정"} · 전도인 {target.evangelistName || target.ownerName}
                </div>
                {target.phone && (
                  <div className="text-xs text-slate-400 mt-1">
                    연락처 {target.phone}
                  </div>
                )}
              </div>
              <Pill>{statusEmoji[target.status]} {target.status}</Pill>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>진행률</span>
                <span>{Math.max(statusIndex + 1, 1)} / {statuses.length}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: \`\${((Math.max(statusIndex, 0) + 1) / statuses.length) * 100}%\` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() =>
                    onUpdate(target.id, {
                      gifts: (target.gifts || [false, false, false]).map((g, idx) =>
                        idx === i ? !g : g
                      ),
                    })
                  }
                  className={\`rounded-2xl p-3 text-sm font-bold \${
                    (target.gifts || [false, false, false])[i]
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-50 text-slate-400"
                  }\`}
                >
                  🎁 {i + 1}차 {(target.gifts || [false, false, false])[i] ? "완료" : "예정"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                className="h-12 rounded-2xl bg-slate-50 px-3 outline-none text-sm"
                value={target.status}
                onChange={(e) =>
                  onUpdate(target.id, {
                    status: e.target.value,
                    lastContact: new Date().toISOString().slice(0, 10),
                  })
                }
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <select
                className="h-12 rounded-2xl bg-slate-50 px-3 outline-none text-sm"
                value={target.attending}
                onChange={(e) => onUpdate(target.id, { attending: e.target.value })}
              >
                <option>미정</option>
                <option>참석예정</option>
                <option>불참</option>
                <option>행사참석</option>
              </select>
            </div>

            {target.memo && (
              <div className="text-sm text-slate-600 bg-slate-50 rounded-2xl p-3">
                {target.memo}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                className="h-12 rounded-2xl"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                수정
              </Button>

              <Button
                type="button"
                disabled
                className="h-12 rounded-2xl bg-slate-300 text-slate-500 cursor-not-allowed"
                onClick={(e) => e.preventDefault()}
              >
                <Mail className="w-4 h-4 mr-2" /> 준비중
              </Button>

              <Button
                type="button"
                className="h-12 rounded-2xl"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> 삭제
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="font-black text-lg text-orange-700">
              전도 대상자 수정
            </div>

            <input
              className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="전도인 이름"
              value={editEvangelistName}
              onChange={(e) => setEditEvangelistName(e.target.value)}
            />

            <input
              className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="대상자 이름"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <input
              className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="관계 예: 가족, 친구, 직장동료, 이웃"
              value={editRelation}
              onChange={(e) => setEditRelation(e.target.value)}
            />

            <input
              className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="연락처"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                className="h-12 rounded-2xl bg-slate-50 px-3 outline-none text-sm"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <select
                className="h-12 rounded-2xl bg-slate-50 px-3 outline-none text-sm"
                value={editAttending}
                onChange={(e) => setEditAttending(e.target.value)}
              >
                <option>미정</option>
                <option>참석예정</option>
                <option>불참</option>
                <option>행사참석</option>
              </select>
            </div>

            <textarea
              className="w-full min-h-24 rounded-2xl bg-slate-50 p-4 outline-none"
              placeholder="기도 제목이나 접촉 메모"
              value={editMemo}
              onChange={(e) => setEditMemo(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl"
                onClick={cancelEdit}
              >
                취소
              </Button>
              <Button
                type="button"
                className="h-12 rounded-2xl bg-orange-500 hover:bg-orange-600"
                onClick={saveEdit}
              >
                수정 저장
              </Button>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-3">
            <div className="font-bold text-red-700">정말 삭제하시겠습니까?</div>
            <div className="text-sm text-red-600">
              {target.name} 전도 대상자 정보가 삭제됩니다.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl bg-white"
                onClick={() => setConfirmDelete(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                className="rounded-2xl bg-red-500 hover:bg-red-600"
                onClick={() => onDelete(target)}
              >
                삭제하기
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

`;

s = s.slice(0, start) + newTargetCard + s.slice(end);

fs.writeFileSync(file, s, "utf8");

console.log("전도대상자 수정 기능 2차 적용 완료");
console.log("수정 저장 있음:", s.includes("수정 저장"));
console.log("전도 대상자 수정 있음:", s.includes("전도 대상자 수정"));