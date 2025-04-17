export const opConsultNote = {
    "title": "OP Consult Note",
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
                    "description": "Discussion on the results of your recent Lab Test and further consultation",
                    "start": "2020-07-12T09:00:00Z",
                    "end": "2020-07-12T09:30:00Z",
                    "created": "2020-07-09T14:58:58.18105:30",
					 "text": "Foot swelling"
                }
            ]
        },
        {
            "name": "Allergies",
            "data": [
                {
                    "text": "NKA"
                }
            ]
        },
        {
            "name": "Medical History",
            "data": [
                {
                    "text": "Diabetes mellitus type 1"
                }
            ]
        },
        {
            "name": "Investigation Advice",
            "data": [
                {
                    "text": "Fasting lipid profile"
                }
            ]
        },
        {
            "name": "Medications",
            "data": [
                {
                    "resourceType": "MedicationStatement",
                    "tabletName": "Telmisartan 20 mg oral tablet",
                    "dateAsserted": "2020-02-02T14:58:58.18105:30"
                },
                {
                    "resourceType": "MedicationRequest",
                    "tabletName": "Neomycin 5 microgram/mg cutaneous ointment",
                    "dateAsserted": "2020-02-02T14:58:58.18105:30",
                    "dosageInstruction": [
                        {
                            "additionalInstruction": [
                                {
                                    "coding": [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "229799001",
                                            "display": "Twice a day"
                                        }
                                    ]
                                }
                            ],
                            "route": {
                                "coding": [
                                    {
                                        "system": "http://snomed.info/sct",
                                        "code": "6064005",
                                        "display": "Topical route"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            "name": "Procedure",
            "data": [
                {
                    "text": "Assessment of diabetic foot ulcer"
                }
            ]
        },
        {
            "name": "Follow Up",
            "data": [
                {
                    "description": "Discussion on the results of your recent Lab Test and further consultation",
                    "start": "2020-07-12T09:00:00Z",
                    "end": "2020-07-12T09:30:00Z"
                }
            ]
        }
    ]
}