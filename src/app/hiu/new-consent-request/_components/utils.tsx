export const initialConsentData = [
  {
    isStructure: "",
    patient: {
      gender: "",
      phone: "",
      name: "",
      value: "",
      birthDate: "",
      home: "",
    },
    practioner: {
      practionerName: "",
    },
    report: [
      {
        data: [
          {
            code: "",
            system: "",
            display: "",
            resourceType: "",
          },
        ],
        name: "",
      },
      {
        data: [
          {
            code: "",
            system: "",
            display: "",
            resourceType: "",
          },
        ],
        name: "Medical History",
      },
      {
        data: [
          {
            system: "",
            code: "",
            display: "",
          },
          {
            system: null,
            code: {
              coding: [
                {
                  system: "",
                  code: "",
                  display: "",
                },
              ],
            },
            display: null,
          },
        ],
        name: "Family History",
      },
      {
        data: [
          {
            system:
              "",
            code: "",
            dosageInstruction: null,
            display:
              "",
            resourceType: "",
          },
        ],
        name: "Medications",
      },
      {
        data: [
          {
            code: null,
            system: null,
            display:"",
            title: "",
            resourceType: "DocumentReference",
          },
        ],
        name: "OPConsultation",
      },
    ],
    title: "OPConsultation",
  },
];
