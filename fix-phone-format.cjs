const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

/* 1. 전화번호 포맷 함수 추가 */
if (!s.includes("const formatPhoneNumber =")) {
  s = s.replace(
`const statusEmoji = {`,
`const formatPhoneNumber = (value) => {
  const numbers = String(value || "").replace(/[^0-9]/g, "");

  if (numbers.length === 11) {
    return numbers.replace(/^(\\d{3})(\\d{4})(\\d{4})$/, "$1-$2-$3");
  }

  if (numbers.length === 10) {
    return numbers.replace(/^(\\d{3})(\\d{3})(\\d{4})$/, "$1-$2-$3");
  }

  return numbers;
};

const statusEmoji = {`
  );
}

/* 2. 전도대상자 등록 연락처 placeholder 변경 */
s = s.replaceAll(
  `placeholder="연락처 선택 입력"`,
  `placeholder="연락처 입력 - 숫자만 입력"`
);

/* 3. 등록 시 phone 저장값 자동 변환 */
s = s.replaceAll(
  `phone,`,
  `phone: formatPhoneNumber(phone),`
);

/* 4. 수정 화면 placeholder 변경 */
s = s.replaceAll(
  `placeholder="연락처"`,
  `placeholder="연락처 입력 - 숫자만 입력"`
);

/* 5. 수정 저장 시 phone 저장값 자동 변환 */
s = s.replaceAll(
  `phone: editPhone.trim(),`,
  `phone: formatPhoneNumber(editPhone),`
);

/* 6. 엑셀 다운로드 연락처도 포맷 적용 */
s = s.replaceAll(
  `target.phone || "",`,
  `formatPhoneNumber(target.phone),`
);

fs.writeFileSync(file, s, "utf8");

console.log("전화번호 자동 포맷 수정 완료");
console.log("formatPhoneNumber 있음:", s.includes("const formatPhoneNumber ="));
console.log("placeholder 변경:", s.includes("연락처 입력 - 숫자만 입력"));
console.log("엑셀 연락처 포맷:", s.includes("formatPhoneNumber(target.phone)"));