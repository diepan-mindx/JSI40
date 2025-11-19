const root_arr = [1, 12.4, "abc", true, false, [1, 2, 3]];
// ---------------------------------------
// map: trả về một mảng mới với các phần tử được biến đổi
// doi map thanh string + "new_"
const new_arr = root_arr.map((item) => "new_" + item);
console.log("Map: " + new_arr);
// ---------------------------------------
// filter

// ---------------------------------------
// reduce

// ---------------------------------------
// join: trả về 1 string mới, chuyển mảng thành string với phân cách là kí tự truyền vào
// map -> xuống hàng cho từng phần tử
const joined_str = root_arr.join("\n");
console.log("Join:\n" + joined_str);

// ---------------------------------------
// flat: trả về mảng mới, làm phẳng mảng đa chiều thành 1D
const flat_arr = root_arr.flat();
console.log("Flat:\n" + flat_arr);
// ---------------------------------------
// find: trả về phần tử đầu tiên (bên trái) khớp với điều kiện
// tim so 1
const found_item = flat_arr.find((item) => item == 1);
console.log("Find:" + found_item);
// ---------------------------------------
// some: trả về boolean, có ít nhất 1 phần tử khớp điều kiện
const has_a = flat_arr.some((item) => String(item).includes("a"));
console.log("Some: " + has_a);
// ---------------------------------------
// every: trả về boolean, thỏa điều kiện tất cả phần tử phải khớp
const all_number = flat_arr.every((item) => typeof item === "number");
console.log("Every: " + all_number);
// ---------------------------------------
// slice: trả về mảng mới được cắt từ mảng gốc
// slice(start, end): cắt từ index start cho đến index end - 1
const sliced_arr = flat_arr.slice(3, 6); 
console.log("Slice: " + sliced_arr);