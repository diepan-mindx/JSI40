let cargoHold = [
  "oxygen tanks",
  "space suits",
  "parrot",
  "instruction manual",
  "meal packs",
  "slinky",
  "security blanket",
];

// 1. thay đổi 'slinky' thành 'space tether'
// ------------------------------------
// cargoHold[5] = 'space tether';
// console.log(cargoHold);
// ------------------------------------
// let newList = cargoHold.map((item) => {
//   if (item === "slinky") {
//     return "space tether";
//   }
//   return item;
// });
// console.log(newList);
// ------------------------------------
cargoHold.forEach((item, index) => {
  if (item === "slinky") {
    cargoHold[index] = "space tether";
  }
});
console.log(cargoHold);

// =====================================
// 2.a. xoa phan tu cuoi cung
cargoHold.pop();
console.log(cargoHold);

// =====================================
// 2.b. xoa phan tu dau tien
cargoHold.shift();
console.log(cargoHold);

// =====================================
// 3. them 1138 vao dau + them '20 meters' vao cuoi
cargoHold.unshift(1138); // them dau
cargoHold.push("20 meters"); // them cuoi
console.log(cargoHold);

// =====================================
// 4. in mang + len voi template literal
console.log(`Cargo Hold Contents: ${cargoHold.join(", ")}\n
Total Items: ${cargoHold.length}`);

// =====================================
/**
 * Thêm - xóa đầu: shift - unshift
 * Thêm - xóa cuối: push - pop
 */
