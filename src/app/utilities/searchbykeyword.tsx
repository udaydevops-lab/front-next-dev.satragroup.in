export const searchByKeyword = (
    listOfItems: Array<{ [key: string]: any }>, // Replace `{ [key: string]: any }` with the actual type if possible
    field: string | string[],
    searchKey: string,
    objectName?: string
  ): Array<{ [key: string]: any }> => {
    if (typeof searchKey !== 'string' || searchKey.length === 0) {
      return listOfItems;
    }
  
    let searchLower = searchKey.toLowerCase();
    let filteredItems: Array<{ [key: string]: any }> = [];
  
    listOfItems.forEach(item => {
      if (objectName && typeof field === 'string' &&
        item[objectName] && typeof item[objectName][field] === 'string' &&
        item[objectName][field].toLowerCase().includes(searchLower)
      ) {
        filteredItems.push(item);
      }
  
      if (!objectName && typeof field === 'string' &&
        item[field] && typeof item[field] === 'string' &&
        item[field].toLowerCase().includes(searchLower)
      ) {
        filteredItems.push(item);
      }
  
      if (Array.isArray(field)) {
        field.forEach(test => {
          if (item[test] && typeof item[test].toString() === 'string' &&
            item[test].toString().toLowerCase().includes(searchLower)
          ) {
            filteredItems.push(item);
          }
        });
      }
    });
  
    // Using Set to remove duplicate items
    return Array.from(new Set(filteredItems));
  };
  

  export const dateConverter = (value:any)=>{
    // let convertedDate = new Intl.DateTimeFormat("en-US", {
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    // }).format(value);
    // return convertedDate;
  }

  export const dateConverterNew = (value:any)=>{
    let convertedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(value);
    return convertedDate;
  }

  export const dateFormatYYMMDD=(value:any)=>{
    let data=dateConverterNew(value);
    let formattedyymmdd=data.split("/")[2]+"-"+data.split("/")[0]+"-"+data.split("/")[1]
    return formattedyymmdd;
    }