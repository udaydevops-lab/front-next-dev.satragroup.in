export const InstallState = {
  configData:[],
  newConfigRes:null,
  open: false,
  configId: null,
  configName: "",
  configType: [],
  remorks:[],
  link:{label:"Link"},
  linkData:[],
  key:0,
  configDef: {
    ipcolumns: [
      {
        id:Date.now(),
        columnName: "",
        columnType: "",
        controlType: "",
        isMandatory: "",
        masterDataCode: "",
        statusFlag: 1,
        status: Date.now(),
      },
    ],
    opcolumns: [],
  },
};
