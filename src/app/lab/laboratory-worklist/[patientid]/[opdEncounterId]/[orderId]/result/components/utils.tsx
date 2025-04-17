export const addLabelAndValue = (data: Array<any>) => {
    data.map((item: any) => {
      item.label = item.equipmentDesc ;
      item.value = item.equipmentCode;
    });
    return data;
  };