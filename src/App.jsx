import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Gift,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LogIn,
  Mail,
  Menu,
  Plus,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  Users,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
const FESTIVAL_DATE = "2026년 7월 19일";
const CHURCH_NAME = "동심교회";
const FESTIVAL_NAME = "새생명축제";
// 실제 배포 시에는 대한예수교장로회 CI PNG/SVG 파일 경로를 넣어 주세요.
// 예: /assets/hapdong-ci.png
const CHURCH_LOGO = "";

const stretcherGroupMembers = {
  "1조": ["백종칠", "전성산", "조한덕", "임춘빈"],
  "2조": ["류 관", "우종남", "양상민", "박성재"],
  "3조": ["빈진호", "강건구", "장정희", "하승만"],
  "4조": ["이선화", "김종란", "김현숙", "박순영"],
  "5조": ["김미선", "장은실", "박은영", "정은주"],
  "6조": ["김필자", "김남령", "김나연", "유선희"],
  "7조": ["김가일", "이성숙", "오성이", "임명애"],
  "8조": ["양상희", "이재경", "김연옥", "성경미"],
  "9조": ["방한나", "조정희", "한영란", "강숙자"],
  "10조": ["김영미", "박재숙", "이도선", "나춘옥"],
  "11조": ["라은혜", "민수기", "백은아", "오미순"],
  "12조": ["이상은", "김용주", "박성민", "전민규"],
  "들것지기 미포함조1": [],
  "들것지기 미포함조2": [],
};

const stretcherGroups = Object.keys(stretcherGroupMembers);

const groupLeaders = {
  "1조": "백종칠",
  "2조": "류 관",
  "3조": "빈진호",
  "4조": "이선화",
  "5조": "김미선",
  "6조": "김필자",
  "7조": "김가일",
  "8조": "양상희",
  "9조": "방한나",
  "10조": "김영미",
  "11조": "라은혜",
  "12조": "이상은",
  "들것지기 미포함조1": "미지정",
  "들것지기 미포함조2": "미지정",
};

const festivalSchedule = [
  { period: "5월 1일 ~ 31일", activity: "기도하기 / 태신자 등록 / 관계 맺기(봄소풍 초대)" },
  { period: "6월 1일 ~ 30일", activity: "관계 맺기 / 선물 나누기(교회, 개인)" },
  { period: "7월 1일 ~ 18일", activity: "식사하기 / 초대장 돌리기" },
  { period: "7월 19일", activity: "새생명축제" },
];

const reportWeeks = [
  "6월 1주차",
  "6월 2주차",
  "6월 3주차",
  "6월 4주차",
  "7월 1주차",
  "7월 2주차",
  "7월 3주차",
];

const initialMembers = [
  { id: 1, name: "백종칠", stretcherGroup: "1조", phone: "010-1111-2222", role: "member" },
  { id: 2, name: "류 관", stretcherGroup: "2조", phone: "010-3333-4444", role: "member" },
  { id: 3, name: "목사님", stretcherGroup: "들것지기 미포함조1", phone: "010-0000-0000", role: "admin" },
];

const initialTargets = [
  {
    id: 101,
    ownerId: 1,
    ownerName: "백종칠",
    evangelistName: "백종칠",
    stretcherGroup: "1조",
    name: "이OO",
    relation: "직장 동료",
    phone: "010-1234-5678",
    memo: "교회는 처음이라 부담 없는 초대 필요",
    status: "기도중",
    gifts: [true, false, false],
    invited: false,
    attending: "미정",
    lastContact: "2026-05-28",
  },
  {
    id: 102,
    ownerId: 1,
    ownerName: "백종칠",
    evangelistName: "백종칠",
    stretcherGroup: "1조",
    name: "최OO",
    relation: "이웃",
    phone: "010-8888-7777",
    memo: "아이와 함께 올 수 있음",
    status: "연락함",
    gifts: [true, true, false],
    invited: true,
    attending: "참석예정",
    lastContact: "2026-05-27",
  },
  {
    id: 103,
    ownerId: 2,
    ownerName: "류 관",
    evangelistName: "류 관",
    stretcherGroup: "2조",
    name: "정OO",
    relation: "친구",
    phone: "010-2222-9999",
    memo: "찬양에 관심 있음",
    status: "선물전달",
    gifts: [true, true, true],
    invited: true,
    attending: "미정",
    lastContact: "2026-05-26",
  },
];

const initialWeeklyReports = [
  {
    id: 201,
    week: "5월 4주차",
    stretcherGroup: "1조",
    leaderName: "백종칠",
    contactCount: 4,
    mealCount: 1,
    giftCount: 2,
    inviteCount: 1,
    expectedCount: 1,
    prayer: "이OO님 마음이 열리도록 기도 부탁드립니다.",
    note: "조원들과 함께 대상자들을 위해 매일 기도하고 있습니다.",
    pastorComment: "1조 수고 많으셨습니다. 이OO님을 위해 함께 기도하겠습니다.",
    createdAt: "2026-05-28",
  },
  {
    id: 202,
    week: "5월 4주차",
    stretcherGroup: "2조",
    leaderName: "류 관",
    contactCount: 3,
    mealCount: 2,
    giftCount: 1,
    inviteCount: 1,
    expectedCount: 0,
    prayer: "정OO님이 예배 초청에 부담을 갖지 않도록 기도 부탁드립니다.",
    note: "이번 주는 관계 맺기에 집중했습니다.",
    pastorComment: "좋습니다. 부담보다 사랑으로 계속 다가가면 좋겠습니다.",
    createdAt: "2026-05-28",
  },
];

const statuses = ["기도중", "연락함", "식사/만남", "선물전달", "초대장발송", "참석예정", "행사참석"];
const statusEmoji = {
  기도중: "🙏",
  연락함: "📞",
  "식사/만남": "🍜",
  선물전달: "🎁",
  초대장발송: "💌",
  참석예정: "⭐",
  행사참석: "🎉",
};

const normalizeTarget = (id, data) => ({
  id,
  ownerId: data.ownerId || 0,
  ownerName: data.ownerName || "",
  evangelistName: data.evangelistName || data.ownerName || "",
  stretcherGroup: data.stretcherGroup || "1조",
  name: data.name || "이름 없음",
  relation: data.relation || "",
  phone: data.phone || "",
  memo: data.memo || "",
  status: data.status || "기도중",
  gifts: Array.isArray(data.gifts) ? data.gifts : [false, false, false],
  invited: Boolean(data.invited),
  attending: data.attending || "미정",
  lastContact: data.lastContact || "",
});

const normalizeReport = (id, data) => ({
  id,
  week: data.week || "미지정 주차",
  stretcherGroup: data.stretcherGroup || "1조",
  leaderName: data.leaderName || "",
  contactCount: Number(data.contactCount) || 0,
  mealCount: Number(data.mealCount) || 0,
  giftCount: Number(data.giftCount) || 0,
  inviteCount: Number(data.inviteCount) || 0,
  expectedCount: Number(data.expectedCount) || 0,
  prayer: data.prayer || "",
  note: data.note || "",
  pastorComment: data.pastorComment || "",
  createdAt: data.createdAt || "",
});

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-white/90">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function Pill({ children }) {
  return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">{children}</span>;
}



function LoginScreen({ onLogin }) {
  const [memberPassword, setMemberPassword] = useState("");
const [adminPassword, setAdminPassword] = useState("");
const [selectedMemberGroup, setSelectedMemberGroup] = useState("1조");
const [error, setError] = useState("");

  const loginMember = () => {
  if (memberPassword === "7777") {
    const selectedLeaderName = groupLeaders[selectedMemberGroup] || "조장";

    setError("");
    onLogin({
      id: selectedMemberGroup,
      name: selectedLeaderName,
      stretcherGroup: selectedMemberGroup,
      phone: "",
      role: "member",
    });
  } else {
    setError("조장용 비밀번호가 올바르지 않습니다.");
  }
};

  const loginAdmin = () => {
    if (adminPassword === "9106") {
      setError("");
      onLogin(initialMembers[2]);
    } else {
      setError("목사님용 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-5">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="bg-orange-500 text-white p-7 text-center">
            
            <h1 className="text-3xl font-black">{CHURCH_NAME}</h1>
            <p className="text-lg mt-1">{FESTIVAL_NAME} 초청 시스템</p>
            <p className="text-sm opacity-90 mt-3">{FESTIVAL_DATE}</p>
          </div>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-3 rounded-2xl bg-orange-50 p-4">
              <div className="font-bold text-orange-700">조장용 로그인</div>
             <select
  className="w-full h-12 rounded-2xl border border-orange-100 bg-white px-4 outline-none"
  value={selectedMemberGroup}
  onChange={(e) => setSelectedMemberGroup(e.target.value)}
>
  {stretcherGroups
    .filter((group) => !group.includes("미포함"))
    .map((group) => (
      <option key={group} value={group}>
        {group} - {groupLeaders[group]} 조장
      </option>
    ))}
</select> 
              <input
                type="password"
                className="w-full h-12 rounded-2xl border border-orange-100 bg-white px-4 outline-none"
                placeholder="조장용 비밀번호 입력"
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
              />
              <Button className="w-full h-12 rounded-2xl text-base bg-orange-500 hover:bg-orange-600" onClick={loginMember}>
                <UserRound className="w-5 h-5 mr-2" /> 조장용으로 시작하기
              </Button>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="font-bold text-slate-700">목사님용 로그인</div>
              <input
                type="password"
                className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none"
                placeholder="목사님용 비밀번호 입력"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <Button className="w-full h-12 rounded-2xl text-base" variant="outline" onClick={loginAdmin}>
                <ShieldCheck className="w-5 h-5 mr-2" /> 목사님용으로 시작하기
              </Button>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm p-3">
                {error}
              </div>
            )}
            <div className="text-xs text-slate-500 text-center pt-3">
              실제 운영 시에는 휴대폰 번호 인증 또는 교회별 초대코드 로그인으로 변경합니다.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function InvitationCard({ target, onClose }) {
  const [message, setMessage] = useState("");

  const text = `${target?.name || "소중한 분"}님, 안녕하세요😊

${CHURCH_NAME}에서 ${FESTIVAL_DATE}에 ${FESTIVAL_NAME}를 준비했습니다.
부담 없이 오셔서 따뜻한 시간 함께 보내시면 좋겠습니다.

✨ 동심교회 소개
동심교회는 하나님 사랑과 이웃 사랑을 실천하며,
모든 세대가 함께 예배하는 따뜻한 공동체입니다.
처음 오시는 분들도 편안하게 함께하실 수 있습니다.

🎉 새생명축제 안내
- 일시: ${FESTIVAL_DATE}
- 장소: 동심교회
- 주소: 대전광역시 서구 도솔로 338

🙏 이런 분들을 환영합니다
- 교회가 처음이신 분
- 마음에 위로와 쉼이 필요한 분
- 가족과 함께 따뜻한 시간을 보내고 싶은 분

🚗 찾아오시는 길
대전광역시 서구 도솔로 338
(주차 가능)

처음 오셔도 괜찮습니다.
제가 함께 안내해드릴게요😊

초대한 이: ${target?.evangelistName || target?.ownerName || "동심교회 성도"}`;

  const fallbackCopy = (value) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textarea);
      return result;
    } catch {
      return false;
    }
  };

  const copyInvitation = async () => {
    try {
      if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setMessage("초대장 문구가 복사되었습니다.");
        return;
      }
    } catch (e) {
      console.log(e);
    }

    const copied = fallbackCopy(text);

    if (copied) {
      setMessage("초대장 문구가 복사되었습니다.");
    } else {
      setMessage("자동 복사가 제한되었습니다. 아래 문구를 직접 복사해 주세요.");
    }
  };

  const shareInvitation = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${CHURCH_NAME} ${FESTIVAL_NAME}`,
          text: text,
        });
        setMessage("공유창을 열었습니다. 카카오톡, 문자 등 원하는 앱을 선택해 주세요.");
        return;
      }
    } catch (e) {
      console.log(e);
    }

    setMessage("현재 환경에서는 공유창을 열 수 없습니다. 휴대폰에서 접속하면 카카오톡/문자 공유창이 열립니다.");
  };

  const sendSmsInvitation = () => {
    const phone = target?.phone || "";
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(text)}`;
    window.location.href = smsUrl;
  };

  const openDirections = () => {
    const address = "대전광역시 서구 도솔로 338";
    const mapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
    try {
      const opened = window.open(mapUrl, "_blank");

      if (!opened) {
        window.location.href = mapUrl;
      }
    } catch (e) {
      console.log(e);
      setMessage("지도 앱을 열 수 없습니다. 네이버지도에서 '대전광역시 서구 도솔로 338'을 검색해 주세요.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <Card className="rounded-3xl overflow-hidden border-0 shadow-2xl my-6">
          <div className="relative bg-gradient-to-br from-orange-400 to-rose-400 text-white p-7 text-center">
            
            
            <div className="text-sm tracking-widest opacity-90">INVITATION</div>
            <h2 className="text-3xl font-black mt-2">{FESTIVAL_NAME}</h2>
            <p className="text-lg mt-2">{target?.name || "소중한 분"}님을 초대합니다</p>
            <div className="mt-6 bg-white/20 rounded-2xl p-4 space-y-2">
              <div className="text-2xl font-bold">{FESTIVAL_DATE}</div>
              <div className="text-sm">{CHURCH_NAME}</div>
              <div className="text-xs opacity-90">대전광역시 서구 도솔로 338</div>
            </div>
          </div>
          <CardContent className="p-6 space-y-4">
            <textarea readOnly onFocus={(e) => e.target.select()} className="w-full min-h-80 whitespace-pre-line bg-slate-50 rounded-2xl p-4 text-sm leading-7 text-slate-700 outline-none resize-none" value={text} />
            {message && <div className="rounded-2xl bg-orange-50 text-orange-700 text-sm p-3">{message}</div>}
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" className="h-12 rounded-2xl bg-orange-500 hover:bg-orange-600" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); shareInvitation(); }}>
                <Send className="w-4 h-4 mr-2" /> 카톡/앱 공유
              </Button>
              <Button type="button" className="h-12 rounded-2xl" variant="outline" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); sendSmsInvitation(); }}>
                <Mail className="w-4 h-4 mr-2" /> 문자 보내기
              </Button>
              <Button type="button" className="h-12 rounded-2xl" variant="outline" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => {
                e.stopPropagation();
                openDirections();
              }}>
                🗺 찾아오시는 길
              </Button>
              <Button type="button" className="h-12 rounded-2xl" variant="outline" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); copyInvitation(); }}>
                복사
              </Button>
              <Button type="button" className="h-12 rounded-2xl" variant="outline" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClose(); }}>
                닫기
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function TargetForm({ onAdd, currentUser, selectedGroup, onGroupChange }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [evangelistName, setEvangelistName] = useState(currentUser.name || "");
  const [stretcherGroup, setStretcherGroup] = useState(selectedGroup || currentUser.stretcherGroup || "1조");
  const groupMemberOptions = stretcherGroupMembers[stretcherGroup] || [];

  const changeStretcherGroup = (group) => {
    setStretcherGroup(group);
    setEvangelistName("");
    if (onGroupChange) onGroupChange(group);
  }; 

  const submit = async () => {
    if (!name.trim()) return alert("대상자 이름을 입력해 주세요.");

    await addDoc(collection(db, "targets"), {
      ownerId: currentUser.id,
      ownerName: evangelistName,
      evangelistName,
      stretcherGroup,
      name,
      relation,
      phone,
      memo,
      status: "기도중",
      gifts: [false, false, false],
      invited: false,
      attending: "미정",
      lastContact: new Date().toISOString().slice(0, 10),
    });

    setName("");
    setRelation("");
    setPhone("");
    setMemo("");
  };

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5 space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> 전도 대상자 등록</h3>
        <div className="grid grid-cols-2 gap-3">
          <select className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none" value={stretcherGroup} onChange={(e) => changeStretcherGroup(e.target.value)}>
            {stretcherGroups.map((group) => <option key={group}>{group}</option>)}
          </select>
          <select className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none cursor-pointer" value={evangelistName} onChange={(e) => setEvangelistName(e.target.value)}>
            <option value="">전도인 선택</option>
            {groupMemberOptions.map((member) => <option key={member} value={member}>{member}</option>)}
          </select>
          
        </div>
        <div className="rounded-2xl bg-orange-50 p-3 text-sm text-orange-800">
          <div className="font-bold">{stretcherGroup} 조장: {groupLeaders[stretcherGroup] || "미지정"}</div>
          <div className="mt-1 text-xs leading-5">조장 및 조원: {groupMemberOptions.length ? groupMemberOptions.join(", ") : "조원 미지정 — 전도인 이름을 직접 입력해 주세요."}</div>
        </div>
        <input className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="대상자 이름 예: 김OO" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="관계 예: 가족, 친구, 직장동료, 이웃" value={relation} onChange={(e) => setRelation(e.target.value)} />
        <input className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none" placeholder="연락처 선택 입력" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <textarea className="w-full min-h-24 rounded-2xl bg-slate-50 p-4 outline-none" placeholder="기도 제목이나 접촉 메모" value={memo} onChange={(e) => setMemo(e.target.value)} />
        <Button className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600" onClick={submit}>등록하기</Button>
      </CardContent>
    </Card>
  );
}

function TargetCard({ target, onUpdate, onInvite, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const statusIndex = statuses.indexOf(target.status);
  return (
    <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">{target.name}</h3>
            <div className="text-sm text-slate-500 mt-1">{target.relation || "관계 미입력"} · 들것지기 {target.stretcherGroup || "미지정"} · 전도인 {target.evangelistName || target.ownerName}</div>
          </div>
          <Pill>{statusEmoji[target.status]} {target.status}</Pill>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2"><span>진행률</span><span>{Math.max(statusIndex + 1, 1)} / {statuses.length}</span></div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-orange-400 rounded-full" style={{ width: `${((Math.max(statusIndex, 0) + 1) / statuses.length) * 100}%` }} /></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <button key={i} onClick={() => onUpdate(target.id, { gifts: (target.gifts || [false, false, false]).map((g, idx) => idx === i ? !g : g) })} className={`rounded-2xl p-3 text-sm font-bold ${(target.gifts || [false, false, false])[i] ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-400"}`}>
              🎁 {i + 1}차 {(target.gifts || [false, false, false])[i] ? "완료" : "예정"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select className="h-12 rounded-2xl bg-slate-50 px-3 outline-none text-sm" value={target.status} onChange={(e) => onUpdate(target.id, { status: e.target.value, lastContact: new Date().toISOString().slice(0, 10) })}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="h-12 rounded-2xl bg-slate-50 px-3 outline-none text-sm" value={target.attending} onChange={(e) => onUpdate(target.id, { attending: e.target.value })}>
            <option>미정</option>
            <option>참석예정</option>
            <option>불참</option>
            <option>행사참석</option>
          </select>
        </div>

        {target.memo && <div className="text-sm text-slate-600 bg-slate-50 rounded-2xl p-3">{target.memo}</div>}

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            disabled
            className="col-span-2 h-12 rounded-2xl bg-slate-300 text-slate-500 cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
          >
            <Mail className="w-4 h-4 mr-2" /> 초대장 준비중
          </Button>
          <Button type="button" className="h-12 rounded-2xl" variant="outline" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="w-4 h-4 mr-2" /> 삭제
          </Button>
        </div>

        {confirmDelete && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-3">
            <div className="font-bold text-red-700">정말 삭제하시겠습니까?</div>
            <div className="text-sm text-red-600">{target.name} 전도 대상자 정보가 삭제됩니다.</div>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" className="rounded-2xl bg-white" onClick={() => setConfirmDelete(false)}>
                취소
              </Button>
              <Button type="button" className="rounded-2xl bg-red-500 hover:bg-red-600" onClick={() => onDelete(target)}>
                삭제하기
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PastorFeedbackList({ user, reports }) {
  const myReports = reports.filter((report) => report.stretcherGroup === user.stretcherGroup);
  const feedbackReports = myReports.filter((report) => report.pastorComment && report.pastorComment.trim());
  const waitingReports = myReports.filter((report) => !report.pastorComment || !report.pastorComment.trim());

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-500" /> 목사님 피드백
            </h3>
            <p className="text-sm text-slate-500 mt-1">제출한 주간보고에 대한 담임목사님 코멘트를 확인합니다.</p>
          </div>
          {feedbackReports.length > 0 && <Pill>새 피드백 {feedbackReports.length}건</Pill>}
        </div>

        {myReports.length === 0 && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            아직 제출한 주간보고가 없습니다.
          </div>
        )}

        {feedbackReports.map((report) => (
          <div key={report.id} className="rounded-3xl bg-orange-50 border border-orange-100 p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="font-black text-orange-800">{report.week} · {report.stretcherGroup}</div>
                <div className="text-xs text-orange-600">보고자 {report.leaderName} 조장 · 작성일 {report.createdAt}</div>
              </div>
              <Pill>코멘트 도착</Pill>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div className="rounded-2xl bg-white p-3">접촉 <b>{report.contactCount}</b></div>
              <div className="rounded-2xl bg-white p-3">식사 <b>{report.mealCount}</b></div>
              <div className="rounded-2xl bg-white p-3">선물 <b>{report.giftCount}</b></div>
              <div className="rounded-2xl bg-white p-3">초대장 <b>{report.inviteCount}</b></div>
              <div className="rounded-2xl bg-white p-3">참석예상 <b>{report.expectedCount}</b></div>
            </div>
            {report.prayer && (
              <div className="rounded-2xl bg-white p-3 text-sm text-slate-700">
                <b>기도제목</b><br />{report.prayer}
              </div>
            )}
            <div className="rounded-2xl bg-white p-4 text-sm text-slate-800 leading-7">
              <b className="text-orange-700">담임목사님 코멘트</b><br />
              {report.pastorComment}
            </div>
          </div>
        ))}

        {waitingReports.length > 0 && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            코멘트 대기 중인 보고서: {waitingReports.map((r) => `${r.week} ${r.stretcherGroup}`).join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MemberView({ user, targets, setTargets, onInvite, reports, setReports }) {
  const selectedGroup = user.stretcherGroup || "1조";
  const myTargets = targets.filter((t) => t.stretcherGroup === selectedGroup);

  const onAdd = () => {};

  const onUpdate = async (id, patch) => {
    await updateDoc(doc(db, "targets", String(id)), patch);
  };

  const onDelete = async (target) => {
    await deleteDoc(doc(db, "targets", String(target.id)));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard icon={Users} label={`${selectedGroup} 대상자`} value={myTargets.length} />
        <StatCard icon={Gift} label="1차 선물" value={myTargets.filter((t) => (t.gifts || [])[0]).length} />
        <StatCard icon={Gift} label="2차 선물" value={myTargets.filter((t) => (t.gifts || [])[1]).length} />
        <StatCard icon={Gift} label="3차 선물" value={myTargets.filter((t) => (t.gifts || [])[2]).length} />
        <StatCard icon={Mail} label="초대장" value={myTargets.filter((t) => t.invited).length} />
        <StatCard icon={CalendarDays} label="참석 예정" value={myTargets.filter((t) => t.attending === "참석예정").length} />
      </div>

      <div className="rounded-3xl bg-white/90 shadow-sm p-5 space-y-3">
        <div className="font-black text-lg">들것지기 조별 대상자 보기</div>
        <div className="h-12 rounded-2xl bg-orange-50 px-4 flex items-center text-sm text-orange-700 font-bold">
          현재 {selectedGroup}에 등록된 전도 대상자만 표시됩니다.
        </div>
      </div>

      <WeeklyReportForm
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
      </div>
    </div>
  );
}

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
  const leaderOptions = stretcherGroupMembers[reportGroup] || [];

  const submitReport = async () => {
    const report = {
      id: Date.now(),
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
      pastorComment: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    await addDoc(collection(db, "reports"), report);
    setPrayer("");
    setNote("");
    setContactCount(0);
    setMealCount(0);
    setGiftCount(0);
    setInviteCount(0);
    setExpectedCount(0);
  };

  const changeReportGroup = (group) => {
    setReportGroup(group);
    setLeaderName(groupLeaders[group] || "");
  }; 

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <h3 className="font-black text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> 주간 활동보고 작성</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" value={week} onChange={(e) => setWeek(e.target.value)}>
            {reportWeeks.map((week) => (
              <option key={week}>{week}</option>
            ))}
          </select>
          <select className="h-12 rounded-2xl bg-slate-50 px-4 outline-none" value={reportGroup} onChange={(e) => changeReportGroup(e.target.value)}>
            {stretcherGroups.map((group) => <option key={group}>{group}</option>)}
          </select>
          <select className="h-12 rounded-2xl bg-orange-50 px-4 outline-none font-bold text-orange-700" value={leaderName} onChange={(e) => setLeaderName(e.target.value)}>
            <option value="">조장 선택</option>
            {leaderOptions.map((member) => <option key={member} value={member}>{member}</option>)}
          </select>
        </div>
        <div className="rounded-2xl bg-orange-50 p-3 text-sm text-orange-800">
          선택된 보고 조: <b>{reportGroup}</b> / 보고 조장: <b>{leaderName || "미선택"}</b>
        </div>

        <div className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-800">
          <div className="font-bold text-base">
            📋 주간 들것지기 활동보고
          </div>
          <div className="mt-1">
            보고조 : <b>{reportGroup}</b>
          </div>
          <div>
            보고자 : <b>{leaderName || "미선택"} 조장</b>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">👥 접촉인원</div>
            <input
              type="number"
              value={contactCount}
              onChange={(e) => setContactCount(e.target.value)}
              className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">🍚 식사/만남</div>
            <input
              type="number"
              value={mealCount}
              onChange={(e) => setMealCount(e.target.value)}
              className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">🎁 선물전달</div>
            <input
              type="number"
              value={giftCount}
              onChange={(e) => setGiftCount(e.target.value)}
              className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">✉️ 초대장전달</div>
            <input
              type="number"
              value={inviteCount}
              onChange={(e) => setInviteCount(e.target.value)}
              className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-600">🙏 참석예상</div>
            <input
              type="number"
              value={expectedCount}
              onChange={(e) => setExpectedCount(e.target.value)}
              className="h-12 w-full rounded-2xl bg-slate-50 px-4 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <textarea className="w-full min-h-24 rounded-2xl bg-slate-50 p-4 outline-none" placeholder="특별 기도제목" value={prayer} onChange={(e) => setPrayer(e.target.value)} />
        <textarea className="w-full min-h-24 rounded-2xl bg-slate-50 p-4 outline-none" placeholder="기타 보고 / 도움이 필요한 부분" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600" onClick={submitReport}>보고서 제출하기</Button>
      </CardContent>
    </Card>
  );
}
  function PastorCommentEditor({ report, onSave }) {
  const [comment, setComment] = useState(report.pastorComment || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setComment(report.pastorComment || "");
  }, [report.id, report.pastorComment]);

  const saveComment = async () => {
    await onSave(report.id, comment);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="mt-2 space-y-2">
      <textarea
        className="w-full min-h-20 rounded-2xl bg-white p-3 outline-none text-slate-700"
        placeholder="조장에게 남길 코멘트"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          className="rounded-2xl bg-orange-500 hover:bg-orange-600"
          onClick={saveComment}
        >
          코멘트 저장
        </Button>
        {saved && (
          <span className="text-sm font-bold text-orange-700">
            저장되었습니다.
          </span>
        )}
      </div>
    </div>
  );
}

function ReportsView({ user, reports, setReports }) {
  const isAdmin = user.role === "admin";
const [selectedWeek, setSelectedWeek] = useState("전체");

const weekTabs = ["전체", ...reportWeeks];

const visibleReports = reports.filter((r) => {
  const roleMatch = isAdmin || r.stretcherGroup === user.stretcherGroup;
  const validWeek = reportWeeks.includes(r.week);
  const weekMatch = selectedWeek === "전체" || r.week === selectedWeek;
  return roleMatch && validWeek && weekMatch;
});

  const updatePastorComment = async (id, value) => {
    await updateDoc(doc(db, "reports", String(id)), { pastorComment: value });
  };

  const total = visibleReports.reduce((acc, r) => {
    acc.contact += Number(r.contactCount) || 0;
    acc.meal += Number(r.mealCount) || 0;
    acc.gift += Number(r.giftCount) || 0;
    acc.invite += Number(r.inviteCount) || 0;
    acc.expected += Number(r.expectedCount) || 0;
    return acc;
  }, { contact: 0, meal: 0, gift: 0, invite: 0, expected: 0 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Users} label="접촉" value={total.contact} />
        <StatCard icon={HeartHandshake} label="식사/만남" value={total.meal} />
        <StatCard icon={Gift} label="선물" value={total.gift} />
        <StatCard icon={Mail} label="초대장" value={total.invite} />
        <StatCard icon={CalendarDays} label="참석예상" value={total.expected} />
      </div>

      {!isAdmin && <WeeklyReportForm user={user} reports={reports} setReports={setReports} />}

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="text-lg font-black">조별 활동보고</h3>
         {isAdmin && (
  <div className="flex flex-wrap gap-2">
    {weekTabs.map((week) => (
      <button
        key={week}
        type="button"
        onClick={() => setSelectedWeek(week)}
        className={`px-4 py-2 rounded-2xl text-sm font-bold ${
          selectedWeek === week
            ? "bg-orange-500 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {week}
      </button>
    ))}
  </div>
)} 
          {visibleReports.map((report) => (
            <div key={report.id} className="rounded-3xl bg-slate-50 p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-black text-lg">{report.week} · {report.stretcherGroup}</div>
                  <div className="text-sm text-slate-500">조장 {report.leaderName} · 작성일 {report.createdAt}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill>접촉 {report.contactCount}</Pill>
                  <Pill>식사 {report.mealCount}</Pill>
                  <Pill>선물 {report.giftCount}</Pill>
                  <Pill>초대장 {report.inviteCount}</Pill>
                  <Pill>참석예상 {report.expectedCount}</Pill>
                </div>
              </div>
              {report.prayer && <div className="bg-white rounded-2xl p-3 text-sm"><b>기도제목</b><br />{report.prayer}</div>}
              {report.note && <div className="bg-white rounded-2xl p-3 text-sm"><b>기타 보고</b><br />{report.note}</div>}
              <div className="bg-orange-50 rounded-2xl p-3 text-sm text-orange-800">
                <b>담임목사님 코멘트</b>
                {isAdmin ? (
                  <PastorCommentEditor
  report={report}
  onSave={updatePastorComment}
/>
                ) : (
                  <div className="mt-2 text-slate-700">{report.pastorComment || "아직 코멘트가 없습니다."}</div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminView({ targets, reports, setReports }) {
  const byDept = useMemo(() => {
    const map = {};
    targets.forEach((t) => {
      const group = t.stretcherGroup || "미지정";
      if (!map[group]) {
        map[group] = {
          dept: group,
          total: 0,
          invited: 0,
          attending: 0,
          gift1: 0,
          gift2: 0,
          gift3: 0,
        };
      }

      map[group].total += 1;
      if (t.invited) map[group].invited += 1;
      if (t.attending === "참석예정" || t.attending === "행사참석") map[group].attending += 1;
      if ((t.gifts || [])[0]) map[group].gift1 += 1;
      if ((t.gifts || [])[1]) map[group].gift2 += 1;
      if ((t.gifts || [])[2]) map[group].gift3 += 1;
    });
    return Object.values(map).sort((a, b) => parseInt(a.dept) - parseInt(b.dept));
  }, [targets]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        <StatCard icon={Users} label="전체 대상자" value={targets.length} />
        <StatCard icon={Gift} label="1차 선물" value={targets.filter((t) => (t.gifts || [])[0]).length} />
        <StatCard icon={Gift} label="2차 선물" value={targets.filter((t) => (t.gifts || [])[1]).length} />
        <StatCard icon={Gift} label="3차 선물" value={targets.filter((t) => (t.gifts || [])[2]).length} />
        <StatCard icon={Mail} label="초대장 발송" value={targets.filter((t) => t.invited).length} />
        <StatCard icon={CalendarDays} label="참석 예정" value={targets.filter((t) => t.attending === "참석예정").length} />
        <StatCard icon={HeartHandshake} label="행사 참석" value={targets.filter((t) => t.attending === "행사참석").length} />
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-orange-500" /> 조별 전도 현황</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-3">들것지기 조</th>
                  <th>대상자</th>
                  <th>1차 선물</th>
                  <th>2차 선물</th>
                  <th>3차 선물</th>
                  <th>초대장</th>
                  <th>참석예정/참석</th>
                </tr>
              </thead>
              <tbody>
                {byDept.map((d) => (
                  <tr key={d.dept} className="border-b last:border-0">
                    <td className="py-4 font-bold">{d.dept}</td>
                    <td>{d.total}</td>
                    <td>{d.gift1}</td>
                    <td>{d.gift2}</td>
                    <td>{d.gift3}</td>
                    <td>{d.invited}</td>
                    <td>{d.attending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ReportsView user={{ role: "admin" }} reports={reports} setReports={setReports} />

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-lg font-black mb-4">초청 대상자 현황</h3>
          <div className="space-y-3">
            {targets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-bold">{t.name} <span className="text-xs text-slate-400">({t.relation})</span></div>
                  <div className="text-xs text-slate-500">들것지기 {t.stretcherGroup || "미지정"} · 전도인 {t.evangelistName || t.ownerName} · 최근접촉 {t.lastContact}</div>
                </div>
                <div className="flex gap-2 flex-wrap"><Pill>{t.status}</Pill><Pill>{t.attending}</Pill><Pill>선물 {(t.gifts || []).filter(Boolean).length}/3</Pill></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduleCard() {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-black mb-4 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-orange-500" /> 새생명축제 2026 진행 일정</h3>
        <div className="space-y-3">
          {festivalSchedule.map((item) => (
            <div key={item.period} className="rounded-2xl bg-slate-50 p-4 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <div className="font-bold text-orange-700 min-w-36">{item.period}</div>
              <div className="text-sm text-slate-700">{item.activity}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StructureGuide() {
  return (
    <div className="space-y-4">
      <ScheduleCard />
      <div className="grid md:grid-cols-2 gap-4">
      <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5 space-y-3"><h3 className="font-black text-lg">메뉴 구조</h3><ul className="text-sm leading-7 text-slate-600"><li>① 홈 대시보드</li><li>② 내 전도 대상자</li><li>③ 들것지기 조 선택 및 조원 검색</li><li>④ 1·2·3차 선물 체크</li><li>⑤ 초대장 만들기/공유</li><li>⑥ 참석 예정 관리</li><li>⑦ 목사님 피드백 확인</li><li>⑧ 목사님용 전체 현황</li></ul></CardContent></Card>
      <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5 space-y-3"><h3 className="font-black text-lg">데이터 구조</h3><ul className="text-sm leading-7 text-slate-600"><li>members: 성도 정보, 들것지기 조, 권한</li><li>targets: 전도 대상자, 전도인 이름, 들것지기 조, 관계, 연락처, 상태</li><li>gifts: 1차·2차·3차 전달 여부</li><li>invitations: 초대장 발송 여부/일시</li><li>attendance: 참석예정, 행사참석</li></ul></CardContent></Card>
      <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5 space-y-3"><h3 className="font-black text-lg">로그인 구조</h3><ul className="text-sm leading-7 text-slate-600"><li>시제품: 조장용/목사님용 비밀번호 로그인</li><li>실제 운영: 휴대폰 번호 인증</li><li>대안: 교회 공통 초대코드 + 이름 입력</li><li>권한: 조장용 / 목사님용 분리</li></ul></CardContent></Card>
      <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5 space-y-3"><h3 className="font-black text-lg">휴대폰 사용 방식</h3><ul className="text-sm leading-7 text-slate-600"><li>카카오톡 공지 링크로 접속</li><li>홈 화면에 추가하여 앱처럼 사용</li><li>초대장 문구 복사 후 카톡/문자 발송</li><li>목사님은 PC와 태블릿에서 현황 확인</li></ul></CardContent></Card>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [targets, setTargets] = useState([]);
  const [reports, setReports] = useState([]);
  const [inviteTarget, setInviteTarget] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "targets"), (snapshot) => {
      const data = snapshot.docs.map((document) =>
        normalizeTarget(document.id, document.data())
      );
      setTargets(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs.map((document) =>
        normalizeReport(document.id, document.data())
      );
      setReports(data.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
    });

    return () => unsubscribe();
  }, []);

  const filteredTargets = targets.filter((t) => [t.name, t.ownerName, t.evangelistName, t.stretcherGroup, t.relation].join(" ").includes(query));
  const openInvite = async (target) => {
    setInviteTarget(target);
    await updateDoc(doc(db, "targets", String(target.id)), {
      invited: true,
      status: target.status === "행사참석" ? target.status : "초대장발송",
    });
  };

  const deleteTarget = async (target) => {
    await deleteDoc(doc(db, "targets", String(target.id)));
  };

 const handleLogin = (loginUser) => {
  setUser(loginUser);
  setTab(loginUser.role === "admin" ? "admin" : "member");
};

if (!user) return <LoginScreen onLogin={handleLogin} />;

 const menu =
  user.role === "admin"
    ? [{ id: "admin", label: "목사님용", icon: LayoutDashboard }]
    : [{ id: "member", label: "조장용", icon: UserRound }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 text-slate-900">
      {inviteTarget && <InvitationCard target={inviteTarget} onClose={() => setInviteTarget(null)} />}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <div>
              <div className="font-black leading-tight">{CHURCH_NAME} {FESTIVAL_NAME}</div>
              <div className="text-xs text-slate-500">{FESTIVAL_DATE} · 한 영혼 초청 프로젝트</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {menu.map((m) => <Button key={m.id} variant={tab === m.id ? "default" : "ghost"} className={`rounded-2xl ${tab === m.id ? "bg-orange-500 hover:bg-orange-600" : ""}`} onClick={() => setTab(m.id)}><m.icon className="w-4 h-4 mr-2" />{m.label}</Button>)}
            <Button variant="outline" className="rounded-2xl" onClick={() => setUser(null)}><LogIn className="w-4 h-4 mr-2" />나가기</Button>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}><Menu className="w-6 h-6" /></button>
        </div>
        {mobileMenu && <div className="md:hidden px-4 pb-4 grid grid-cols-2 gap-2 bg-white">{menu.map((m) => <Button key={m.id} variant={tab === m.id ? "default" : "outline"} className="rounded-2xl" onClick={() => { setTab(m.id); setMobileMenu(false); }}>{m.label}</Button>)}</div>}
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-5">
        <section className="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 text-white p-6 md:p-8 shadow-lg">
          <div className="max-w-3xl">
            <div className="text-sm opacity-90 mb-2">전 성도가 함께하는 7주 초청 여정</div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">한 사람이 한 영혼을 품고<br />기도하고, 만나고, 초대합니다.</h1>
            <p className="mt-4 text-white/90">대상자 등록부터 들것지기 조별 관리, 3차 선물 전달, 초대장 발송, 참석 예정 관리까지 한 화면에서 진행합니다.</p>
          </div>
        </section>

       {false && tab === "home" && (
          <div className="space-y-5">
            <ScheduleCard />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatCard icon={Users} label="전체 대상자" value={targets.length} />
              <StatCard icon={Gift} label="선물 전달" value={targets.reduce((a, t) => a + (t.gifts || []).filter(Boolean).length, 0)} sub="1~3차 합계" />
              <StatCard icon={Mail} label="초대장" value={targets.filter((t) => t.invited).length} />
              <StatCard icon={CalendarDays} label="참석 예정" value={targets.filter((t) => t.attending === "참석예정").length} />
              <StatCard icon={HeartHandshake} label="행사 참석" value={targets.filter((t) => t.attending === "행사참석").length} />
            </div>
            <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5"><div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 h-12"><Search className="w-5 h-5 text-slate-400" /><input className="bg-transparent outline-none w-full" placeholder="대상자, 전도인, 들것지기 조 검색" value={query} onChange={(e) => setQuery(e.target.value)} /></div></CardContent></Card>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{filteredTargets.map((target) => <TargetCard key={target.id} target={target} onUpdate={async (id, patch) => updateDoc(doc(db, "targets", String(id)), patch)} onInvite={openInvite} onDelete={deleteTarget} />)}</div>
          </div>
        )}

        {tab === "member" && <MemberView user={user.role === "admin" ? initialMembers[0] : user} targets={targets} setTargets={setTargets} onInvite={openInvite} reports={reports} setReports={setReports} />}
        {tab === "admin" && <AdminView targets={targets} reports={reports} setReports={setReports} />}
        {tab === "guide" && <StructureGuide />}
      </main>
    </div>
  );
}
