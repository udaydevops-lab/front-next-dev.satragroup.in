export const presData = {
  title: "Prescription record",
  patient: {
    name: "Bhanuchander",
    gender: "male",
    birthDate: "1987-10-06",
  },
  practioner: "Dr. DEF",
  report: [
    {
      name: "Prescription record",
      data: [
        {
          resourceType: "MedicationRequest/1",
          tabletName:
            "Azithromycin (as azithromycin dihydrate) 250 mg oral capsule",
          dosageInstruction: [
            {
              text: "One tablet at once",
              additionalInstruction: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "311504000",
                      display: "With or after food",
                    },
                  ],
                },
              ],
              timing: {
                repeat: {
                  frequency: 1,
                  period: 1,
                  periodUnit: "d",
                },
              },
              route: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "26643006",
                    display: "Oral Route",
                  },
                ],
              },
              method: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "421521009",
                    display: "Swallow",
                  },
                ],
              },
            },
          ],
        },
        {
          resourceType: "MedicationRequest/2",
          tabletName: "Paracetemol 500mg Oral Tab",
          dosageInstruction: [
            {
              text: "Take two tablets orally with or after meal once a day",
              additionalInstruction: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "311504000",
                      display: "With or after food",
                    },
                  ],
                },
              ],
              timing: {
                repeat: {
                  frequency: 1,
                  period: 1,
                  periodUnit: "d",
                },
              },
              route: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "26643006",
                    display: "Oral Route",
                  },
                ],
              },
              method: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "421521009",
                    display: "Swallow",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
