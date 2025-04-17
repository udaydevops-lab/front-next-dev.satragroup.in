export const DisSumm = {
    "Condition/2": {
        "resourceType": "Condition",
        "id": "2",
        "meta": {
            "profile": [
                "https://nrces.in/ndhm/fhir/r4/StructureDefinition/Condition"
            ]
        },
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en-IN\" lang=\"en-IN\">Myocardial infarction</div>"
        },
        "clinicalStatus": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    "code": "active",
                    "display": "Active"
                }
            ]
        },
        "code": {
            "coding": [
                {
                    "system": "http://snomed.info/sct",
                    "code": "22298006",
                    "display": "Myocardial infarction"
                }
            ],
            "text": "pain in the chest, neck, back or arms, as well as fatigue, lightheadedness, abnormal heartbeat and anxiety."
        },
        "subject": {
            "reference": "Patient/1"
        }
    },
    "practioner": {
        "practionerName": "DEF"
    },
    "patient": {
        "gender": "male",
        "phone": "phone",
        "name": "Bhanuchander",
        "value": "919818512600",
        "birthDate": "1987-10-06",
        "home": "home"
    },
    "title": "Discharge Summary"
}