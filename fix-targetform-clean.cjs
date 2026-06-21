const fs = require("fs");

const file = "src/App.jsx";
let s = fs.readFileSync(file, "utf8");

const start = s.indexOf("function TargetForm(");
const end = s.indexOf("function TargetCard", start);

if (start === -1 || end === -1) {
  console.log("TargetForm 위치를 찾지 못했습니다.");
  process.exit(1);
}

const cleanTargetForm = `function TargetForm({ onAdd, currentUser, selectedGroup, onGroupChange }) {
  const [name, setName] = useState