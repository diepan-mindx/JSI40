const employees = [
  { name: "John", salary: 50000, department: "IT" },
  { name: "Jane", salary: 60000, department: "HR" },
  { name: "Bob", salary: 55000, department: "IT" },
  { name: "Sophie", salary: 75000, department: "HR" },
  { name: "Emily", salary: 65000, department: "IT" },
  { name: "Mike", salary: 80000, department: "HR" },
  { name: "David", salary: 70000, department: "IT" },
];

// 1. Nhiệm vụ của bạn là sử dụng map(), filter() và reduce() để tính mức lương trung bình cho từng bộ phận.
const HRGroup = employees.filter((emp) => emp.department === "HR");
const ITGroup = employees.filter((emp) => emp.department === "IT");
const sumSalaryHRGroup = HRGroup.reduce((acc, emp) => acc + emp.salary, 0);
const sumSalaryITGroup = ITGroup.reduce((acc, emp) => acc + emp.salary, 0);
const avgSalaryHRGroup = sumSalaryHRGroup / HRGroup.length;
const avgSalaryITGroup = sumSalaryITGroup / ITGroup.length;
console.log(
  `Mức lương trung bình của phòng HR: ${avgSalaryHRGroup.toFixed(2)}`
);
console.log(
  `Mức lương trung bình của phòng IT: ${avgSalaryITGroup.toFixed(2)}`
);

// 2. Kết quả trả về một mảng đối tượng chỉ chứa các phòng ban có mức lương trung bình trên 65000.
const departments = [
  { name: "HR", avgSalary: avgSalaryHRGroup },
  { name: "IT", avgSalary: avgSalaryITGroup },
];
console.log(
  "Phòng ban có mức lương trung bình trên 65k: ",
  departments.find((dept) => dept.avgSalary > 65000)
);
