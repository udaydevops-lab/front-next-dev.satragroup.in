
export const initialState = {
    popup: false,
    buttonStatus: false,
    showPassword: true,
    password: "",
    facilites: [],
    roleList: [],
    activeLocation: {},
    newRole: false,
}

export const CapitalizeName = (str: any) => {
    let str1 = str.toLowerCase().split(" ")
    let str2 = str1.map((n: any) => n.toUpperCase().charAt(0) + n.slice(1))
    return str2.join(" ")
}