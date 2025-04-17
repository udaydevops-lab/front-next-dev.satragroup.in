const FrontdeskReportsJson: any = [
    {
        name: 'List of new patient registrations done during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "patientMrn", headerName: "Patient MRN", width: 300 },
            { field: "patientName", headerName: "Patient Name", width: 120 },
            { field: "abhaNumber", headerName: "ABHA Number", width: 50 },
            { field: "abhaAddress", headerName: "ABHA Address", width: 300 },
            { field: "gender", headerName: "Gender", width: 120 },
            { field: "age", headerName: "Age", width: 50 },
            { field: "referralSource", headerName: "Referral source", width: 300 },
            { field: "patientCategory", headerName: "Patient category", width: 120 },
            { field: "regDateTime", headerName: "Reg. Date Time", width: 50 },
            { field: "registeredByUser", headerName: "Registered by user", width: 300 },
            { field: "facilityName", headerName: "Facility Name", width: 120 },
            { field: "opdCounterName", headerName: "OPD Counter Name", width: 120 },
        ]
    },
    {
        name: 'Department wise outpatient encounters census report during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "patientMrn", headerName: "Encounter No", width: 300 },
            { field: "patientName", headerName: "Encounter Datetime", width: 120 },
            { field: "abhaNumber", headerName: "Patient MRN", width: 50 },
            { field: "abhaAddress", headerName: "Patient Name", width: 300 },
            { field: "gender", headerName: "ABHA Number", width: 120 },
            { field: "age", headerName: "Gender", width: 50 },
            { field: "referralSource", headerName: "Age", width: 300 },
            { field: "patientCategory", headerName: "Department", width: 120 },
            { field: "regDateTime", headerName: "Physician", width: 50 },
            { field: "registeredByUser", headerName: "Service Name", width: 300 },
            { field: "facilityName", headerName: "Appt Type", width: 120 },
            { field: "opdCounterName", headerName: "Visit Type", width: 120 },
            { field: "registeredByUser", headerName: "Customer group", width: 300 },
            { field: "facilityName", headerName: "Facility", width: 120 },
            { field: "opdCounterName", headerName: "OPD Counter Name", width: 120 },
        ]
    },
    {
        name: 'OPD Counter wise outpatient encounters census report during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "OPD Counter Name", width: 300 },
            { field: "patientMrn", headerName: "Encounter No", width: 300 },
            { field: "patientName", headerName: "Encounter Datetime", width: 120 },
            { field: "abhaNumber", headerName: "Patient MRN", width: 50 },
            { field: "abhaAddress", headerName: "Patient Name", width: 300 },
            { field: "gender", headerName: "ABHA Number", width: 120 },
            { field: "age", headerName: "Gender", width: 50 },
            { field: "referralSource", headerName: "Age", width: 300 },
            { field: "patientCategory", headerName: "Department", width: 120 },
            { field: "regDateTime", headerName: "Physician", width: 50 },
            { field: "registeredByUser", headerName: "Service Name", width: 300 },
            { field: "facilityName", headerName: "Appt Type", width: 120 },
            { field: "opdCounterName", headerName: "Visit Type", width: 120 },
            { field: "registeredByUser", headerName: "Customer group", width: 300 },
            { field: "facilityName", headerName: "Facility", width: 120 },
            { field: "opdCounterName", headerName: "Created by User", width: 120 },
        ]
    },
    {
        name: 'Doctor wise outpatient encounters census report during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "department", headerName: "Department", width: 300 },
            { field: "physician", headerName: "Physician", width: 50 },
            { field: "encounterNo", headerName: "Encounter No", width: 300 },
            { field: "encounterDatetime", headerName: "Encounter Datetime", width: 120 },
            { field: "abhaNumber", headerName: "Patient MRN", width: 50 },
            { field: "abhaAddress", headerName: "Patient Name", width: 300 },
            { field: "gender", headerName: "ABHA Number", width: 120 },
            { field: "age", headerName: "Gender", width: 50 },
            { field: "referralSource", headerName: "Age", width: 300 },
            { field: "registeredByUser", headerName: "Service Name", width: 300 },
            { field: "facilityName", headerName: "Appt Type", width: 120 },
            { field: "opdCounterName", headerName: "Visit Type", width: 120 },
            { field: "registeredByUser", headerName: "Customer group", width: 300 },
            { field: "facilityName", headerName: "Facility", width: 120 },
            { field: "opdCounterName", headerName: "Created by User", width: 120 },
        ]
    },
    {
        name: 'List of ABHA Healthcards generated during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'No.of outpatients visited with vs without ABHA card during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'OP encounters not billed report',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'OP orders bill pending report',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'Hospital services outpatient tariff report',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'List of patient registered in HIMS and not registered in ABHA',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'List of cancelled OP encounters during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'User wise outpatient encounters census report during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'Patient age group wise visits report during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    },
    {
        name: 'OPD waiting time report during the period',
        columns: [
            { field: "id", headerName: "S.no", width: 50 },
            { field: "servicename", headerName: "Service Name", width: 300 },
            { field: "charge", headerName: "Charge", width: 120 },
        ]
    }
];
