
export interface Filters{
    text:string,
    isActive:boolean
}

export const filters=()=>{
    return [
        {
          text: "New Order",
          isActive: false,
        },
        {
          text: "Collected",
          isActive: false,
        },
        {
          text: "All Status",
          isActive: true,
        },
      ] as Filters[]
}