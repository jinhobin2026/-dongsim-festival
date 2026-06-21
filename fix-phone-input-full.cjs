const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /<input[^>]*placeholder="연락처 입력 - 숫자만 입력"[^>]*value=\{phone\}[^>]*\/>/s,
  `<input
        className="w-full h-12 rounded-2xl bg-slate-50 px-4 outline-none"
        placeholder="연락처 입력 - 숫자만 입력"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={() => setPhone(formatPhoneNumber(phone))}
      />`
);

fs.writeFileSync(file, s, "utf8");

console.log("등록 연락처 input 전체 교체 완료");
console.log("등록 onBlur 있음:", s.includes("onBlur={() => setPhone(formatPhoneNumber(phone))}"));