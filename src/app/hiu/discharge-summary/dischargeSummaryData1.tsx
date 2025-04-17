export let DisSummData ={
    "title": "Discharge Summary",
    "patient": {
        "name": "Bhanuchander",
        "gender": "male",
        "birthDate": "1987-10-06"
    },
    "practioner": "Dr. DEF",
    "report": [
        {
            "name": "Chief complaints",
            "data": [
                {
                    "text": "pain in the chest, neck, back or arms, as well as fatigue, lightheadedness, abnormal heartbeat and anxiety."
                }
            ]
        },
        {
            "name": "Medical History",
            "data": [
                {
                    "resourceType": "Procedure",
                    "text": "Placement of stent in coronary artery",
                    "performedDateTime": "2019-05-12",
                },
                {
                    "resourceType": "Condition",
                    "text": "Patient complained about pain in left arm"
                }
            ]
        },
        {
            "name": "Investigations",
            "data": [
                {
                    "resourceType": "DiagnosticReport",
                    "text": "Lipid 1996 panel",
                    "issued": "2020-07-10T11:45:3311:00",
                    "performer": {
                        "name": "XYZ Lab Pvt.Ltd.",
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "91 243 2634 1234",
                                "use": "work"
                            },
                            {
                                "system": "email",
                                "value": "contact@labs.xyz.org",
                                "use": "work"
                            }
                        ]
                    },
                    "report": {
                        "practioner": "Dr. DEF",
                        "data": [
                            {
                                "observation": "cholesterol",
                                "valueQuantity": {
                                    "value": 6.3,
                                    "unit": "mmol/l",
                                    "system": "http://unitsofmeasure.org",
                                    "code": "mmol/L"
                                },
                                "referenceRange": [
                                    {
                                        "high": {
                                            "value": 4.5,
                                            "unit": "mmol/l",
                                            "system": "http://unitsofmeasure.org",
                                            "code": "mmol/L"
                                        }
                                    }
                                ]
                            },
                            {
                                "observation": "triglyceride",
                                "valueQuantity": {
                                    "value": 1.3,
                                    "unit": "mmol/l",
                                    "system": "http://unitsofmeasure.org",
                                    "code": "mmol/L"
                                },
                                "referenceRange": [
                                    {
                                        "high": {
                                            "value": 2,
                                            "unit": "mmol/l",
                                            "system": "http://unitsofmeasure.org",
                                            "code": "mmol/L"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "resourceType": "Condition",
                    "text": "Patient complained about pain in left arm"
                }
            ],
			"conclusion": "Elevated cholesterol/high density lipoprotein ratio"
        },
		{
            "name": "Procedures",
            "data": [
                {
					"resourceType": "Procedure",
                    "text": "Coronary artery bypass grafting",
					"performedDateTime": "2020-07-05"
                }
            ]
        },
		{
            "name": "Medications",
            "data": [
                {
					"resourceType": "MedicationRequest",
                    "text": "Coronary artery bypass grafting",
					"performedDateTime": "2020-07-05",
					"dosageInstruction": {
						"tabletName": "Nitroglycerin 5 mg buccal tablet",
						"text": "One tablet at once",
                            "additionalInstruction": [
                                {
                                    "coding": [
                                        {
                                            "display": "With or after food"
                                        }
                                    ]
                                }
                            ],
                            "timing": {
                                "repeat": {
                                    "frequency": 1,
                                    "period": 1,
                                    "periodUnit": "d"
                                }
                            },
                            "route": {
                                "coding": [
                                    {
                                        "system": "http://snomed.info/sct",
                                        "code": "26643006",
                                        "display": "Oral Route"
                                    }
                                ]
                            },
                            "method": {
                                "coding": [
                                    {
                                        "system": "http://snomed.info/sct",
                                        "code": "421521009",
                                        "display": "Swallow"
                                    }
                                ]
                            }
					}
                }
            ]
        },
		{
            "name": "Care Plan",
            "data": [
                {
					"description": "Treatment of coronary artery and related disease problems",
					"resourceType": "CarePlan",
                    "text": "Coronary artery bypass grafting",
					"follow-up": "Follow-up visit",
					"start": "2020-07-12T09:00:00Z",
                    "end": "2020-07-12T09:30:00Z"
                }
            ]
        }
    ]
}

