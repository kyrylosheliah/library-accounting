export const mapToObject = <T>(arr: Array<{ column: keyof T; value: any }>) => {
  let obj: any = new Object();
  for (let item of arr) {
    obj[item.column] = item.value;
  }
  return obj;
};
