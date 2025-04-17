import { getConfigData } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";

export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
//Filtering Data to bind the item to select input during update
export const filteredData = (data: any, key: string) => {
  return data.filter((item: any) => item.value=== key)[0];
};

//Add Label and value in favour of select input
export const addLabelAndValue = (data: Array<any>) => {
  data.map((item: any) => {
    item.label = item.desc || item.departmentDescription || item.label;
    item.value = item.code || item.id || item.departmentCode || item.value;
  });
  return data;
};
//Get Drop down Data by Config (def) name
export const getList = (def: string, setState: any) => {
  services.get(getConfigData + `${def}/0`).then((response) => {
    setState(addLabelAndValue(response.data.configData));
  });
};

