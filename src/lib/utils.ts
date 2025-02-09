function mutateArrayUtil<ItemDataType extends { _id: string }>(
  _id: string,
  mutationFn: (params: Array<ItemDataType>) => void,
  mutationArr: Array<ItemDataType>,
  itemData: Partial<ItemDataType>
): void {
  let foundIndex = mutationArr.findIndex((eachObject: ItemDataType) => {
    return eachObject._id == _id;
  });
  const arrCopy: Array<ItemDataType> = [...mutationArr];

  if (foundIndex > -1) {
    console.log("found index");
    //found
    arrCopy[foundIndex] = { ...arrCopy[foundIndex], ...itemData };
    console.log(arrCopy);
  }

  mutationFn(arrCopy);
}

export { mutateArrayUtil };
