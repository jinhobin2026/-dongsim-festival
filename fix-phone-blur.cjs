const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /value=\{phone\}\s*onChange=\{\(e\) => setPhone\(e\.target\.value\.replace\(\/\[\^0-9\]\/g, ""\)\)\}/,
  `value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} onBlur={() => setPhone(formatPhoneNumber(phone))}`
);

fs.writeFileSync(file, s, "utf8");

console.log("등록 연락처 onBlur 적용 완료");
console.log("등록 연락처 onBlur 있음:", s.includes("onBlur={() => setPhone(formatPhoneNumber(phone))}"));