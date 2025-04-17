// USER MANAGEMENT
// ===== AUTH APIS

export const getCaptcha = process.env.NEXT_PUBLIC_USER_URL + "getCaptcha";
export const login = process.env.NEXT_PUBLIC_USER_URL + "login";
export const logOutUser = process.env.NEXT_PUBLIC_USER_URL + "user/logout";
export const sendCode = process.env.NEXT_PUBLIC_USER_URL + "resetPassword";
export const emailVerifySubmit = process.env.NEXT_PUBLIC_USER_URL + "verifyotp";
export const changePassword =
  process.env.NEXT_PUBLIC_USER_URL + "changepassword";
export const csrfToken = process.env.NEXT_PUBLIC_USER_URL + "cuti";
//Encounter
export const forceLogout = process.env.NEXT_PUBLIC_USER_URL + "forceLogout";
export const getRoles =
  process.env.NEXT_PUBLIC_USER_URL + "api/master/role/dropdown";
export const getUserById =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/by/id/";
// export const updateUserStatusflag =
//   "http://10.10.21.235:8001/" + "master/user-profile/updateStatusFlag/";
export const updateUserStatusflag =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/updateStatusFlag/";
export const deleteUser =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/deleteUserByUserId";
export const getDepartmentPrac =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/dropdownByDept/";
export const saveFavourites =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/user/favourites";
export const getFavouriteDiagnosis =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/get/user/favourites";
export const getDeptWisePhysicians =
  process.env.NEXT_PUBLIC_USER_URL + "dept-physician-search?deptName=";
export const getPhysBasedOnDept =
  process.env.NEXT_PUBLIC_USER_URL + "dept-physician-search?departmentCode=";
export const createEncounter =
  process.env.NEXT_PUBLIC_PATIENT_URL + "createEncounter";
export const cancelEncounter =
  process.env.NEXT_PUBLIC_PATIENT_URL + "cancelEncounter";
export const updateEncounter =
  process.env.NEXT_PUBLIC_PATIENT_URL + "update-encounterDetails";

// CORE DOMAIN
export const getEmployeeNames =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/names-list";
export const getAllUsers =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/basic/data-list";
export const changeEmpStatus =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/employee/employeeDetailsStatusFlag/";
export const deleteEmployee =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/employee/deleteemployeby-employeId/";
export const saveUser =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile";
export const updateUser =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/update-user";
export const getServiceEntitys =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti/dropdown";
export const getLocations =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location/dropdown";
export const getAllServiceEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/ser-enti/getAllServiceEntity";
export const createServiceEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti";
export const deleteServiceEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/ser-enti/deleteserviceEntityby-serviceEntityId";
export const changeStatus =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/ser-enti/updateServiceEntityByStatusFlag/";
export const getAllLocationDetails =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/location/getAllLocationDetails";
export const getPatientHealthCard =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "patient/registration/by/id/";
export const getConfigData =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-dataList/";
export const getAllDepartments =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "department-master-list";
export const getSpecialitiesByDepartment =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "speciality/by/department/";

export const getServicesEntityDropdown =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti/dropdown/";
export const getLocationsByServiceEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location/dropdown/";

export const savecountermaster =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "counter-master";
export const searchDoctorFee =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "searchDoctorFee/";
export const serviceCreation =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "saveService";
export const getServiceDetailsById =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "serviceById/";
export const getAllServiceDetails =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "serviceDetailsTypeAndDesc/";
export const serviceEntityById =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti/by/id/";
export const getServiceItems =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?serviceType=";
export const getCountryDropDown =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-dataList/Country-State/0";
export const getRoleDropDown =
  process.env.NEXT_PUBLIC_USER_URL + "api/master/role/dropdown";
export const getServiceEntityDropDown =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti/dropdown";
export const getLocationDropDown =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location/dropdown/";
export const getAllEmployeeList =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/basic/data-list";
export const saveEmployee =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee";
// PATIENT MANAGEMENT
export const getExistingPatient =
  process.env.NEXT_PUBLIC_PATIENT_URL + "detailsBy/";
export const updateExistingPatient =
  process.env.NEXT_PUBLIC_PATIENT_URL + "updatehealthid";
export const saveNormalRegistration =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patientRegistration";
export const updatePatient =
  process.env.NEXT_PUBLIC_PATIENT_URL + "updatePatientRegistration";
export const getPatientImgById =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getPatientImageByPatientId/";
export const getPatientDetailsById =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patientById/";
export const patientRegDetailsById =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patientRegistrationDetailById/";
export const getTriage =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAll-Master-triageDetails";
export const getPatientbyid =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAppiontmentByPatientId/";
export const getAllDetails =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllAppiontmentDetails";
export const getByPatientId =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAppointmentDetailsBypatientId/";
export const savePatientSearch =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patient-search";
export const savePregnancy =
  process.env.NEXT_PUBLIC_PATIENT_URL + "pregnancyRecord";
export const getPregnancyTrimester =
  process.env.NEXT_PUBLIC_PATIENT_URL + "pregnancyData/";
export const getEncounterDetailsById =
  process.env.NEXT_PUBLIC_PATIENT_URL + "opdDetailById/";
export const vaccinationList =
  process.env.NEXT_PUBLIC_PATIENT_URL + "vaccination-list";
export const getImmunizationMaster =
  process.env.NEXT_PUBLIC_PATIENT_URL + "immunization-master-list";
export const saveImmunizationMaster =
  process.env.NEXT_PUBLIC_PATIENT_URL + "save_immunization_master";
export const getQueueStatusDetails =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getQueueStatusDetails/";

export const saveHealthDocument =
  process.env.NEXT_PUBLIC_PATIENT_URL + "saveHealthDoc";
export const getHealthDocuments =
  process.env.NEXT_PUBLIC_PATIENT_URL + "healthDocBypatientIdAndEncounterId/";

// HEALTH ID
export const getPatientProfileByAadhaarMobile =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/profile/account";
export const getPatientProfileByAbhaAddress =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getAbhaProfileByAbhaAddress";
export const getPatientProfileImage =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getAbhaImageByHealthId/";
export const getPatientQRCodeByAadharMobile =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getQr/withAadhaarMobile";
export const getPatientIdCardByAadhaarMobile =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getAbhaCard/withAadhaarMobile";
export const getPatientIdCardByAbhaAddress =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abhaCard/withAbhaAddress";
export const deleteAbha =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/profile/remove";
export const abhaGenerateOTP =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/profile/login/init/MobileOtp";
export const abhaSubmitOTP =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/profile/login/cnf/MobilerOtp";
export const linkingToken =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hip/linking2/auth-init";
export const searchByHealthId =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/search/searchByHealthId";
export const searchByMobile =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/search/searchByMobile";
export const submitOTP =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hip/linking3/authCnf";
export const linkFormTokenStatus =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hip/isHipAccessTokenAvailable";
export const getTokenStatus =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/links/link/add-contexts";
// export const getGenerateToken =
//   process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/token/generate-token";
export const getGenerateToken =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/token/generate-token";
export const getCareContextOTP =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getTokenStatus/";
export const resendAbhaLoginOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/profile/resendOtp";
export const healthIdGenerateAadhaarOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/aadhar/generateotp";
export const healthIdResendAadhaarOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/reg/aadhar/resendOtp";
export const healthIdVerifyAadhaarOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/aadhar/verifyotp";
export const healthIdGenerateMobileOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/mobile/generateotp";
export const healthIdResendMobileOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/reg/mobile/resendOtp";
export const healthIdVerifyMobileOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/mobile/verifyotp";
export const createHealthId =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/createABHAByPreVerified";
export const getPatDetails =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/patientDetailsByHealthId?healthId=";
export const hlthInfconsentRequest =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/dataflow-hiu-healthinformation-request";
export const isHealthIdAvailable =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/isAvailable/customHealthId/";
export const getAllConsentList =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getAllConsentList/";
export const deleteConsentRecord =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hiu/delete-consent/";
export const decryptData =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hiu/fhir/decrypt-data/";

// EMR
export const getFrequency =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/getAllFreqDetails";
export const medicationSave =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/save-medication-rx";
export const getMedication =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/getAllmedicationByPatientId";
export const inActiveMedication =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDateMedication/";
export const getOPEmrData = process.env.NEXT_PUBLIC_EMR_URL + "emrData/";
export const saveOPEmr = process.env.NEXT_PUBLIC_EMR_URL + "emrData";
//vitals
export const saveVitals = process.env.NEXT_PUBLIC_EMR_URL + "save-vitals";
export const getVitals =
  process.env.NEXT_PUBLIC_EMR_URL +
  "getVitalsDetailsBypatientIdAndEncounterId/";
export const getVitalsById =
  process.env.NEXT_PUBLIC_EMR_URL + "vitals-details-byId/";
// print details api with Hospital Details
export const gethospitalDetials =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/location/getLocationDetails";

// CPOE API BEFORE
// ==================================
export const saveCPOE =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/save-cpoe-record/";
export const getCPOE =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getCpoeByPatietIdAndOpdencounterId?";
export const delCPOE =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/deleteCpoeByPatientIdAndEncounterId/";
export const getopassessmentInfo =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getBasicDetailsPatientIdEncounterId/";
export const updateCPOE =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/update-cpoeDetails";

/* ======================== 
new cpoe records api
========================= */
export const newSaveCPOE =
  process.env.NEXT_PUBLIC_PATIENT_URL + "save-cpoe-record";
export const newgetCPOE =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getCpoeByPatietIdAndOpdencounterId?";
export const newupdateCPOE =
  process.env.NEXT_PUBLIC_PATIENT_URL + "update-cpoeDetails";
export const newdeleteCPOE =
  process.env.NEXT_PUBLIC_PATIENT_URL + "deleteCpoeByPatientIdAndEncounterId/";
export const getProcudersCpoeData =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?serviceTypeDesc=";
export const getAllCpeoMasterRecord =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?department=";
export const cpoePrority =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-dataList/Priority/0";
export const cpoeReasonForTesting =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/config-dataList/ReasonForTesting/0";

// cpoe master apies
// ==============================
export const saveCpoeParametermaster =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "save-parameterMaster";
export const saveCpoeLabmaster =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "save-labAssign-parameter";
export const labParamerterList =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL +
  "getAllParametersBymodule?ModuleType=";
export const getAllParameterByService =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL +
  "getAllAssignServicesByserviceName?";
export const deleteParameterCpoe =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "delete-AssignLabParameteres?";
export const updateCPOEParameter =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "update-labAssign-parameter";
export const deleteParameterMaster =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "delete-masterparameters?";
export const ParamterUnits =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-dataList/Units/0";

// OpAssementGet Data
export const getOpassmentapi =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getComplaintsByPatietIdAndOpdencounterId?";
export const getMasterLinkDataList =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/childconfig-data/";
export const saveROS = process.env.NEXT_PUBLIC_EMR_URL + "saveros";
export const timer =
  process.env.NEXT_PUBLIC_PATIENT_URL + "save-activity-capture_time";
export const getVitalsGraphData =
  process.env.NEXT_PUBLIC_EMR_URL + "VitalsData";
export const saveDiagnosis = process.env.NEXT_PUBLIC_EMR_URL + "save-diagnosis";
export const saveFixedDiagnosis =
  process.env.NEXT_PUBLIC_EMR_URL + "save-fixed-diagnosis";
export const saveActive =
  process.env.NEXT_PUBLIC_EMR_URL + "updateDiagnosisByisActive/";
export const getFindByDiagnosis =
  process.env.NEXT_PUBLIC_EMR_URL +
  "getDiagnosisDetailsBypatientIdAndEncounterId/";
export const getFixedDiagnosis =
  process.env.NEXT_PUBLIC_EMR_URL +
  "getfixedDiagnosisDetailsBypatientIdAndEncounterId/";
export const deleteDiagnosis =
  process.env.NEXT_PUBLIC_EMR_URL + "deleteDiagnosisByPatientIdAndEncounterId/";
export const deleteFavourite =
  process.env.NEXT_PUBLIC_USER_URL + "deleteByFavorites/";

//Encounter
export const getAllDepartment =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "department-master-list";
export const getAllAppointmentDetail =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "getAllAppiontmentDetails";
export const getAllEncounterTriageDts =
  process.env.NEXT_PUBLIC_PATIENT_URL + "allEncounterAndTriageDetails";
export const getAllEncounterTriageDtls =
  process.env.NEXT_PUBLIC_PATIENT_URL + "dashBoard/encounterDetails";

//linking Token
export const getEncDetailsByEncId =
  process.env.NEXT_PUBLIC_PATIENT_URL + "opdDetailById/";
export const getContextNumber =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getCareContextIdBy?";
export const getAddContextStatus =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/get-add-context-status/";
export const checkNotifyStatus =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/get-context-notify-status/";
export const getNotifedList =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getHipTypesBy/";
export const getPatientEncounterCount =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patient-encounter-count-date/";
export const getPatientDetailsCount =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patient-details-count-date/";
export const getPatientDetailsBasedOnId =
  process.env.NEXT_PUBLIC_PATIENT_URL + "patient-dtls-by-id/";

// opassessment complaint
export const saveOpAssessmentData =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/saveComplaint";
export const saveWellnessRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/saveWellnessRecord";
export const getWellnessRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/getWellnessRecord/";
export const deleteChiefComplaint =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDate-OpAssessmentId?";
export const inactivePhysicalActivityRowRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDatePhysicalActivity/";
export const inactiveWomenRowRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDateWomenWellness/";
export const inactiveGeneralRowRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDateGeneralWellness/";
export const inactiveDietTypeRowRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDateDietType/";
export const inactiveTobaccoTypeRowRecord =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/upDateTobaco/";

// snowmed api's
export const snowmedChiefcomplaint =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "snomed/search?";
export const snomedSearchByTermAndSemanticTag =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "snomed/search?";
export const snowmedData =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "descendants/concept?id=";
export const snomedLoincSearch =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "loincservUrl/search?";
export const enctGenerateBill =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "generate-bill";
export const getBillDetails =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "getBy-bill-generation-id/";

//HIU
export const createConsent =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hiu/create/consent-request";
export const createConsentNew =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hiu/consent/request/init";
export const referral_Order =
  process.env.NEXT_PUBLIC_PATIENT_URL + "referral-Order";
export const getReferralOrder =
  process.env.NEXT_PUBLIC_PATIENT_URL + "get-referral-order";

// VACCINATION LIST Apis
// ==============================
// get immunization list before saving the immunization record table

export const getImmunizationRecord =
  process.env.NEXT_PUBLIC_PATIENT_URL + "vaccination-list";
export const getImmunizationRecordDataById =
  process.env.NEXT_PUBLIC_PATIENT_URL + "vaccination-dtls-by-patientId/";
export const saveImmunizationRecord =
  process.env.NEXT_PUBLIC_PATIENT_URL + "save_immunization_record";
export const saveAdditionalVaccination =
  process.env.NEXT_PUBLIC_PATIENT_URL + "save_additional_vaccine";
export const DoctorList =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/list/doctors";
export const getAdditionalVaccinationList =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAdditionalVaccineListBy/";
export const clearAddtionalVaccinationRecord =
  process.env.NEXT_PUBLIC_PATIENT_URL + "delete-additional-vaccine/";
export const saveDoctorNotes =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/save-doctor-notes";
export const savePfsh =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/savePfsh";
export const getDoctorNote =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getDoctorNotesByPatietIdAndOpdencounterId/";
export const getPFSH =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getPfshByPatietIdAndOpdencounterId";
export const getPainScreening =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getPainScreeningByPatietIdAndOpdencounterId";
export const getDiagnosis =
  process.env.NEXT_PUBLIC_EMR_URL +
  "getDiagnosisDetailsBypatientIdAndEncounterId/";
export const deletePfsh =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/deletePfshByPatientIdAndEncounterId/";
export const inActivePFSH =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/upDatePfshPatientIdAndEncounterId/";
export const deletePainScreening =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/deletePainScreeningByPatientIdAndEncounterId/";
export const deleteExamination =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/deleteExaminationByPatientIdAndEncounterId/";
export const savePainscreening =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/save-painscreening";
export const saveExamination =
  process.env.NEXT_PUBLIC_EMR_URL + "opassessment/saveExamination";
export const getExamination =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getExaminationByPatietIdAndOpdencounterId";
export const saveOpfollow =
  process.env.NEXT_PUBLIC_EMR_URL + "op-follow-up-advice/";
export const getOpfollow =
  process.env.NEXT_PUBLIC_EMR_URL + "get-op-follow-up-advice/";
export const getActivityCaptureTime =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getActivityTimeCapture/";
export const getPatientDetails =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getPatientDetails/";
// export const getPatientDetails =
//   process.env.NEXT_PUBLIC_PATIENT_URL + "getPatientDetails/";
export const getOpassessmentData =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getAll-oppssessmentsByPatientIdAndOpdEncounterId/";
export const getDoctorData =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/";
export const getServiceType =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "getAllAssignServicesByserviceName";
export const getResultEntry =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL +
  "getAllresultentryByPatientIdAndEncounterId?";
export const getResultsView =
  process.env.NEXT_PUBLIC_EMR_URL +
  "opassessment/getCpoeByPatietIdAndOpdencounterId?";
export const saveTriageCategory =
  process.env.NEXT_PUBLIC_PATIENT_URL + "update-triageCategory";
export const resultVerify =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "result-entry-verify";
export const saveResultEntry =
  process.env.NEXT_PUBLIC_CPOE_MASTER_URL + "save-resultEntry";

//ABDM Notify
export const abdmNotify =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/links/context/notify";
// export const phrAppLink = process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/patients/sms/notify2"
export const phrAppLink =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/patient/sms/link/notify2";
// Service Location
export const getAllLocationData =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/location/getAllLocationDetails";
export const EditLocationsByid =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location/location/";
export const UpdateLocationsByService =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location";
// export const UpdateLocationsByService =
// process.env.NEXT_PUBLIC_DOMAIN_URL +
//   "master/hospital/location/update-location";
export const DeletelocationByService =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/location/deletelocationby-locationId";
export const ActiveStatuslocationByService =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/location/detailsStatusFlag/";
export const SaveLocationsByService =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location";
export const getLocationDDByServiceEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/assign-service-entity-to-group/getLocationsByServiceEntityId/";

//Speciality
export const getAllSpeciality =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master-speciality-list";
export const getStatusFlagSpeciality =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "specialityDetailsStatusFlag/";
export const createSpeciality =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "speciality-master";
export const getSpecialityById =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "findbyspecialityid/";

//Department
export const createDepartment =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "department-master";
export const getDeparmentById =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "department-details-by-id/";
export const getStatusFlagDepartment =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "departmentDetailsStatusFlag/";

// service screens
export const getServiceById =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/assign-service-entity-to-group/getByServiceEntityAssignId/";
export const getServiceEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti/dropdown";
export const getLocation =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/location/dropdown";
export const serviceEntitytoLocation =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/assign-service-entity-to-group";
export const updateServiceEtnityData =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/assign-service-entity-to-group/update-assignserviceentity";
export const activeInactiveEtityData =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/assign-service-entity-to-group/ServiceDetailsStatusFlag/";
export const deleteServiceEntityData =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/assign-service-entity-to-group/deleteServiceEntityAssignId";
export const getEntity =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/hospital/ser-enti/dropdown";
export const getReferalsearchString =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/hospital/location/referalsearchString";

export const refreshToken = process.env.NEXT_PUBLIC_USER_URL + "refresh-token";

//roale api's
export const getAllRole = process.env.NEXT_PUBLIC_USER_URL + "api/master/role";
export const roleUpdateStatus =
  process.env.NEXT_PUBLIC_USER_URL + "api/master/role/updateStatusFlagByRoleId";
export const roleUpdate = process.env.NEXT_PUBLIC_USER_URL + "api/master/role";
export const roleMasterSideMenu =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/side-menu-config/getAllSideMenuData";
export const getAllRoleData =
  process.env.NEXT_PUBLIC_USER_URL + "getAllRoleConfigData";
export const getRoleDataById =
  process.env.NEXT_PUBLIC_USER_URL + "getRollConfigDataByRollAssignId";
export const getAdminRoleData =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/side-menu-config/getAllSuperAdminRoles/1093";
// export const getAdminRoleData = "http://10.10.20.187:8001/" + "master/side-menu-config/getAllSuperAdminRoles/1093"
export const checkIsRoleAssignedToLocation =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/checkRoleAssignedToLocation";
export const saveRoleConfig =
  process.env.NEXT_PUBLIC_USER_URL + "save-role-config-master";
export const deleteRoleScreen =
  process.env.NEXT_PUBLIC_USER_URL + "deleteRoleAssignByRoleAssignId";
export const isUserExistByLocation =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/getAssignedUsersByLocationId?locationId=";
//Lab Master api's
export const getSampleTypeGrid =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllSampleMaster";
export const sampleTypeSave =
  process.env.NEXT_PUBLIC_LAB_URL + "saveSimpleTypeMaster";
export const sampleTypeUpdateStatus =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagBysampleMasterId/";
export const getBySampletype =
  process.env.NEXT_PUBLIC_LAB_URL + "getBySampleId/";

export const getContainerTypeGrid =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllContainerDetails";
export const containerTypeSave =
  process.env.NEXT_PUBLIC_LAB_URL + "saveContainerTypeMaster";
export const containerTypeUpdateStatus =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByContainerTypeId/";
export const getByContainetrype =
  process.env.NEXT_PUBLIC_LAB_URL + "getByContainerId/";

export const getAllLabAssignServicesNames =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllLabAssignServices?serviceName=";

export const resultTamplateSave =
  process.env.NEXT_PUBLIC_LAB_URL + "save-lab-result-template";

export const getResultTamplate =
  process.env.NEXT_PUBLIC_LAB_URL + "get-all-lab-result-template";
export const resulStatusUpdate =
  process.env.NEXT_PUBLIC_LAB_URL + "result-template-statusflag-update";
export const getResulUpdateById =
  process.env.NEXT_PUBLIC_LAB_URL + "get-lab-result-by-headerId?headerId=";

// user Master
export const empDetailsById =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/";
export const userDetailsById =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/getEmployeeUserDetailsByUserId/";
// saveUser
export const saveUserMaster =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile";
// export const getAllUsersMaster = process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/basic/data-list"
export const getNewAllUsersMaster =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/getAllUserData";

//testing history
export const empHistory =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/assign-service-entity-to-group/getHistStatusByServiceEntityLocation/";
export const updateUserData =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/update-user";
export const getUserByIdapiData =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/by/id/";
export const GroupuserMasterData =
  process.env.NEXT_PUBLIC_USER_URL + "getAllMasterGroupData";
export const GroupuserMasterDataDropDown =
  process.env.NEXT_PUBLIC_USER_URL + "getAllMasterGroupDataDropDown";
export const userLocationOrganizationBlockunBlockape =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/UpdateFacilityByStatusFlag";
export const FacilityAssignmentHistoryApi =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/getServiceEntityLocationHistoryByUserId/";
export const deluserGroupfromuserMasterapi =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/deleteGroupToUser";

//Block/UnBlock user
export const getUserNameDetails =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/basic/data-list";
export const getReasonForBlock =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "master/config-dataList/ReasonForBlockUser/";
export const getEmpDetailsbyUserIds =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/by/id/";
export const userBlockUnBlock =
  process.env.NEXT_PUBLIC_USER_URL + "master/user-profile/block-unblock-user";
export const getUserGridData =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/getBlockStatusByUserId/";

/* Lab Api's */
//Lab Organism
export const getAllOrganismsData =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllOrganismMaster";
export const getOrganismDataById =
  process.env.NEXT_PUBLIC_LAB_URL + "findByOrganismMaster/";
export const saveOrganismData =
  process.env.NEXT_PUBLIC_LAB_URL + "saveOrganismMaster";
export const changeOrganismStatusFlag =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByorganismId/";

//Lab Antibiotic
export const getAllAntibioticData =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllAntibioticDetails";
export const getAntibioticById =
  process.env.NEXT_PUBLIC_LAB_URL + "findByAntibioticId/";
export const saveAntiBioticData =
  process.env.NEXT_PUBLIC_LAB_URL + "saveAntibioticMaster";
export const changeAntibioticStatusFlag =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByAntibioticId/";

//Lab Test method

export const getAllLabtestData =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllTestMethodDetails";
export const getLabTestById =
  process.env.NEXT_PUBLIC_LAB_URL + "findByTestMethod/";
export const saveLabTestData =
  process.env.NEXT_PUBLIC_LAB_URL + "saveLabTestMethod";
export const changeLabTestStatusFlag =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByLabTestMethodId/";

//Laboreatory work list
// export const labWorkListSearch = process.env.NEXT_PUBLIC_LAB_URL + "search-lab-worklist?";
export const labWorkListSearch =
  process.env.NEXT_PUBLIC_LAB_URL + "search-lab-worklist?";
export const updateCollectionStatus =
  process.env.NEXT_PUBLIC_LAB_URL + "update-collection-status";
export const updateRejectionStatus =
  process.env.NEXT_PUBLIC_LAB_URL + "update-rejection-status";
export const cancelAcknowledge =
  process.env.NEXT_PUBLIC_LAB_URL + "cancel-acknowledge";
export const getMoreDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "get-lab-more-data/";
export const labSearchByPatMrn =
  process.env.NEXT_PUBLIC_LAB_URL + "search-patient-mrn";
// export const labSearchByPatMrn = process.env.NEXT_PUBLIC_LAB_URL + 'search-patient-mrn'
export const getLabSpeciality =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "findAllDepartmentBydepartmentCode?departMentCode=D014";
export const getAllEquipmentDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllLabEquipmentDetails";
export const saveLabEquipmentMaster =
  process.env.NEXT_PUBLIC_LAB_URL + "saveLabEquipmentAsset";
export const updateEquipmentStatusFlag =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByEquipmentId/";
export const getAllTechnicianDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "get-all-lab-technician-map";
export const getTechnicianDetailsById =
  process.env.NEXT_PUBLIC_LAB_URL + "get-lab-technician-by-id/";
export const saveLabTechnicianMaster =
  process.env.NEXT_PUBLIC_LAB_URL + "save-lab-technician-map";
export const deleteLabSpecialtyTechnician =
  process.env.NEXT_PUBLIC_LAB_URL + "delete-lab-speciality-technician/";
export const updateTechnicianStatusFlag =
  process.env.NEXT_PUBLIC_LAB_URL + "update-lab-tech-statusflag";
export const getAllSpecialty =
  process.env.NEXT_PUBLIC_LAB_URL + "get-all-lab-speciality-technician";
export const getAllSpecialities =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "findAllDepartmentBydepartmentCode?departMentCode=D014";
export const getAllLabTechnicians =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/getAllLabTechnicians";
export const getAllLabDoctors =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/getAllLabDoctors";
export const saveLabDoctorMaster =
  process.env.NEXT_PUBLIC_LAB_URL + "save-lab-doctor-map";
export const deleteLabSpecialtyDoctor =
  process.env.NEXT_PUBLIC_LAB_URL + "delete-lab-speciality-doctor/";
export const getAllDoctorsGridData =
  process.env.NEXT_PUBLIC_LAB_URL + "get-all-lab-doctor-map";
export const deleteLabEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteByEquipmentId/";

//Laboratory Assign Test Parameter

export const saveAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "save-labAssign-parameter";
export const getLabServiceName =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?department=Laboratory";
export const getSearchLabParam =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllLabParameters?";
export const getLabServiceGridName =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllLabAssignServices?";
export const statusFlagActive =
  process.env.NEXT_PUBLIC_LAB_URL + "updateLabAssignParametersStatus?";
export const getEditID =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllLabAssignServicesByserviceName?";
export const updatelab =
  process.env.NEXT_PUBLIC_LAB_URL + "update-labAssign-parameter";
export const DeleteTestGroup =
  process.env.NEXT_PUBLIC_LAB_URL + "delete-AssignLabParameteres?";

//Laboratory Test Group
export const getGroupService =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?department=Laboratory";
export const getAllGridTestGroupMasters =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllTestGroupMasters";
export const statusActiveInActive =
  process.env.NEXT_PUBLIC_LAB_URL + "updateTabTestGroupStatusFlag?";
export const saveTestGroup =
  process.env.NEXT_PUBLIC_LAB_URL + "save-test-group-master";
export const updateTestGroup =
  process.env.NEXT_PUBLIC_LAB_URL + "update-testgroup-master";
export const getEditIdTestGroup =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getTestGroupMasterById?labTestgroupHeaderId=";
export const DelTestGroup =
  process.env.NEXT_PUBLIC_LAB_URL + "labtestGroup/delete";

//Phlebotomy Worklist

export const getPhleboWorklist =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllPhlebotami-worklist-data?";
export const phleboPatSearch =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getAllBilledOrdersByMrnOrLabOrderId?PatienMrn=";
export const getSampleById =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getAllBilledOrdersByLabOrderId?labOrderId=";

// Organism - Antibiotic Mapping Apies
export const organismAntibioticMapingsaveapie =
  process.env.NEXT_PUBLIC_LAB_URL + "saveOrganismAssign";
export const organismAntibioticMapingAllgridapi =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllOrganismAssignDetails";
export const organismAntibioticMapingActiveInactiveapie =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByOrganismAssignId/";
export const organismDataFindbyIdapi =
  process.env.NEXT_PUBLIC_LAB_URL + "findByOrganismAssignId/";
export const onganismAntibioticdeleteapie =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteOrganismAssign";

// Change Roles

export const getServiceEntitysById =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/GetAllServiceEntityLocationByUserId/";
// export const getRolesBySerEntAndLoc = "http://10.10.20.187:8001/" + "getAllUserRoles?username=";
export const getRolesBySerEntAndLoc =
  process.env.NEXT_PUBLIC_USER_URL + "getAllUserRoles?username=";
// export const saveChangeRole = "http://10.10.20.187:8001/" + "changeRoles"
export const saveChangeRole = process.env.NEXT_PUBLIC_USER_URL + "changeRoles";
// export const getRolesBySerEntAndLoc = "http://10.10.21.235:8001/" + "getAllUserRoles?username=";

// user Master Group
export const userMastergroupSaveapie =
  process.env.NEXT_PUBLIC_USER_URL + "saveMasterGroup";
export const userMastergroupAllDataapie =
  process.env.NEXT_PUBLIC_USER_URL + "getAllMasterGroupData";
export const userMastergroupDatagetByIDapie =
  process.env.NEXT_PUBLIC_USER_URL + "getMasterGroupById/";
export const userMastergroupDataDeleteByIDapie =
  process.env.NEXT_PUBLIC_USER_URL + "delete-by-id/";
export const userMastergroupDataBlockUnblockapie =
  process.env.NEXT_PUBLIC_USER_URL + "block-unblock-master-group";

//Result Entry (Lab)
export const getLabOrderDetails =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllresultentryByPatientIdAndEncounterId?";
export const getLabServiceDetailsByOrderId =
  process.env.NEXT_PUBLIC_LAB_URL + "sampleCollectedOrdersByOrderId/";
// export const getLabServiceDetailsByOrderId = process.env.NEXT_PUBLIC_LAB_URL + "sampleCollectedOrdersByOrderId/"
export const getLabParmDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllLabAssignServicesByserviceName?";
// export const getLabParmDetails = process.env.NEXT_PUBLIC_LAB_URL + "getAllLabAssignServicesByserviceName?"
export const getLabEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllLabEquipmentDetails";
export const userMastergroupAssignuserblockunblock =
  process.env.NEXT_PUBLIC_USER_URL + "updateUserGroupByStatusFlag";

//Sample Collection
export const getSampleCollectionById =
  process.env.NEXT_PUBLIC_LAB_URL + "get-sample-collection-by-id/";

// Lab Parameter Master
export const labParamerMastersaveapie =
  process.env.NEXT_PUBLIC_LAB_URL + "save-parameterMaster";
export const getAllLabParameterapi =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllLabParameters";
export const delLabparameterapi =
  process.env.NEXT_PUBLIC_LAB_URL + "delete-masterparameters?parameterId=";
export const delLabTerminologyApi =
  process.env.NEXT_PUBLIC_LAB_URL +
  "delete-masterparameters/terminologyMaster?";
export const delLabReferencerangeApi =
  process.env.NEXT_PUBLIC_LAB_URL + "delete-masterparameters/referenaceMaster?";

//Change Role
export const getAllSerLocById =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/user-profile/GetAllServiceEntityLocationByUserId/";
export const changeRolesData = process.env.NEXT_PUBLIC_USER_URL + "changeRoles";

// lab result entry
//export const saveLabResultEntry = "http://10.10.20.105:8011/" + "save-resultEntry"
export const saveLabResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "save-resultEntry";
// export const updateLabResultEntry = "http://10.10.20.105:8011/" + "update/resultEntry"
export const updateLabResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "update/resultEntry";
export const verifyLabResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "result-entry-verify";
// export const getAllresultentryById = "http://10.10.20.105:8011/" + "getAllresultentryByPatientIdAndEncounterId?"
export const getAllresultentryById =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllresultentryByPatientIdAndEncounterId?";
// export const getLabResultTemplate = process.env.NEXT_PUBLIC_LAB_URL + "get-lab-resultTemplateByserviceCodeAndServiceName?"
export const getLabResultTemplate =
  process.env.NEXT_PUBLIC_LAB_URL +
  "get-lab-resultTemplateByserviceCodeAndServiceName?";

//sample collection

export const saveSampleCollection =
  process.env.NEXT_PUBLIC_LAB_URL + "save-sample-collection";

// lab result entry

export const getAllLabAssignServicesData =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllLabAssignServicesByserviceName?assignLabParameterHeaderId=";
// export const getAllresultVerifyGrid = "http://10.10.20.105:8011/" + "getAllBulkResultVerifyWorkList?"
export const getAllresultVerifyGrid =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllBulkResultVerifyWorkList?";

//Sample Collection

export const collectSampleCollection =
  process.env.NEXT_PUBLIC_LAB_URL + "save-sample-collection";
export const getByOrderIdLabOrderId =
  process.env.NEXT_PUBLIC_LAB_URL + "get-sample-collection-by-orderId?";
export const unCollectSampleCollection =
  process.env.NEXT_PUBLIC_LAB_URL + "uncollect-sample";
export const getBarCodeByAccessionNumber =
  process.env.NEXT_PUBLIC_LAB_URL +
  "generateBarcode-accession-num?accessionNum=";

//radiology
export const radiologyParameterMasterSave =
  process.env.NEXT_PUBLIC_LAB_URL + "saveRadiologyParameterMaster";
export const getRadiologyServiceByServiceType =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?department=Radiology";
export const getAllRadiologyParameters =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllRadiologyParameters";
export const saveRadiologyAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "save-radiologyAssign-parameter";
export const updateRadiologyAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "updateRadiologyAssignParameter";
export const deleteRadiologyAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteAssignRadiologyParameteres?";
export const updateStatusRadiologyAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "updateRadiologyAssignParametersStatus?";
export const getAllRadiologyAssignServices =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllRadiologyAssignServices";

export const assignRadiologyParameterHeaderId =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllRadiologyAssignServicesByserviceName?assignRadiologyParameterHeaderId=";

export const getRadiologySpeciality =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "findAllDepartmentBydepartmentCode?departMentCode=D015";
export const getRadiologyTechnicians =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/employee/getAllMaterRadiologyTechnicians"; //harish needs to correct the endpoint name(mater to master)
export const getAllRadiologyTechnicianMapping =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllAssignRadiologyTechnicians";
export const saveRadiologyAssignTechnician =
  process.env.NEXT_PUBLIC_LAB_URL + "save-radiology-assign-technician";
export const deleteRadiologyTechnician =
  process.env.NEXT_PUBLIC_LAB_URL +
  "delete-radiology-assign-technician?radTechMapId=";
export const getAllRadiologyDoctorMapping =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllRadiologyAssignDoctors";
export const getRadiologyDoctors =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/getAllRadiologyDoctors";
export const saveRadiologyDoctor =
  process.env.NEXT_PUBLIC_LAB_URL + "save-radiology-assign-doctor-mapping";
export const deleteRadiologyDoctor =
  process.env.NEXT_PUBLIC_LAB_URL +
  "delete-radiology-assignDoctorById?radDocMapId=";
export const getAllRadiologyEquipmentDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllRadiologyEquipmentDetails";
export const deleteRadiologyEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteByEquipmentId/";
export const saveEquipmentDoctor =
  process.env.NEXT_PUBLIC_LAB_URL + "saveRadiologyEquipmentMapping";

export const getAllRadiologySpecialities =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "findAllDepartmentBydepartmentCode?departMentCode=D015";
export const getRadOrdersOrPatientmrn =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getAllBilledRadiologyOrdersOrPatientmrn";
export const radiologyWorkListSearch =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getAllRadiologyPhlebotami-worklist-data?";
export const deleteRadiologyParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteRadiologyMasterParameter";
//Radiology Result Template
export const saveRadiologyResultTemplate =
  process.env.NEXT_PUBLIC_LAB_URL + "saveRadiologyResultTemplate";
export const getRadiologyResultTamplate =
  process.env.NEXT_PUBLIC_LAB_URL + "get-all-radiology-result-template";
export const updateStatusRadiologyResultTamplate =
  process.env.NEXT_PUBLIC_LAB_URL +
  "radiology-result-template-statusflag-update";
export const getRadiologyResulUpdateById =
  process.env.NEXT_PUBLIC_LAB_URL +
  "get-radiology-result-by-headerId?headerId=";

//result entry
export const getOrderIdDetails =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getRadiologyOrderDetailsByorderId?orderId=";
export const getAllRadiologyAssignServicesByserviceName =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getAllRadiologyAssignServicesByserviceName?";

export const getRadiologyDetailsByOrderId =
  process.env.NEXT_PUBLIC_LAB_URL + "getRadiologyDetailsByOrderId/";
// export const getRadiologyServicesData = "http://10.10.20.105:80011/" + 'getAllRadiologyAssignServicesByserviceName?'
export const getRadiologyServicesData =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllRadiologyAssignServicesByserviceName?";
export const saveRadiologyResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "radiology-save-resultEntry";
export const updateRadiologyResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "update/radiology/resultEntry";
export const verifyradiologyResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "radiology/result-entry-verify";
export const getRadiologyServicesDataAfterSave =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllRadiologyresultentryByPatientIdAndEncounterId?orderId=";
export const getAllAddendam =
  process.env.NEXT_PUBLIC_LAB_URL + "radiology/getAllAddendam";
export const saveAddendam =
  process.env.NEXT_PUBLIC_LAB_URL + "radiology/save-addendam";
export const deleteAddendam =
  process.env.NEXT_PUBLIC_LAB_URL + "radiology/delete-addendamById?";
export const getRadiologyTemplet =
  process.env.NEXT_PUBLIC_LAB_URL +
  "get-radiology-resultTemplateByserviceCodeAndServiceName?";
export const getRadiologyEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllRadiologyEquipmentDetails";

//Radiology order details
export const getTechnicians =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/employee/getAllMaterRadiologyTechnicians";
export const getRadiologists =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/getAllRadiologyDoctors";
export const saveRadiologyOrderDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "saveRadiologyOrderDetails";
export const getOrderDetailsByOrderId =
  process.env.NEXT_PUBLIC_LAB_URL + "getRadiologyDetailsByOrderId/";
export const updateRadOrderDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "update/radiologyOrderDetails";

// bulk verify
// export const verifyradiologyGrid = "http://10.10.20.105:8011/" + "searchRadiologyBulkVerify?"
export const verifyradiologyGrid =
  process.env.NEXT_PUBLIC_LAB_URL + "searchRadiologyBulkVerify?";
export const radiologyResultEntryBulkVerify =
  process.env.NEXT_PUBLIC_LAB_URL + "radiologyResultEntryBulkVerify";
// export const getPatientDetailsforPrint = "http://10.10.20.105:8002/" + "getPatientDataByPatIdAndEncounterId/"
export const getPatientDetailsforPrint =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getPatientDataByPatIdAndEncounterId/";
// export const getradiologySpeciality = process.env.NEXT_PUBLIC_DOMAIN_URL + "findAllDepartmentBydepartmentCode?departMentCode=D015";

export const getRadiologyMoreDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "radiologyOrderItemDataByHeaderId/";

export const socketIoPort = process.env.NEXT_PUBLIC_FRONTEND_KAFKA_EVENT;

export const getAllBilledRadiologyMrn =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllBilledRadiologyMrn";

export const getAllBilledRadiologyOrders =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllBilledRadiologyOrders";

// --------------------------------Procedures Api's ------------------------

//Speciality Doctor mapping
export const saveProceduresDoctorMapping =
  process.env.NEXT_PUBLIC_LAB_URL + "save-procedures-assign-doctor-mapping";
export const getAllProceduresDoctormapping =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllProceduresAssignDoctors";
export const deleteProceduresDoctormapping =
  process.env.NEXT_PUBLIC_LAB_URL +
  "delete-procedures-assignDoctorById?proceDocMapId=";

export const getAllProcedureDoctors =
  process.env.NEXT_PUBLIC_USER_URL + "master/employee/getAllProceduresDoctors";

//Parameter Master
export const saveProcedureParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "save-procedure-parameterMaster";
export const getAllProcedureParameters =
  process.env.NEXT_PUBLIC_LAB_URL + "getProcedureParameters";
export const updateProcedureParameterStatus =
  process.env.NEXT_PUBLIC_LAB_URL + "updateProcedureParameterByStatusFlag";

//Technician Mapping
export const getAllProcedureTechnicianMapping =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllAssignProceduresTechnicians";
export const saveProcedureTechnicianMapping =
  process.env.NEXT_PUBLIC_LAB_URL + "save-procedures-assign-technician";
export const deleteProcedureTechnicianMapping =
  process.env.NEXT_PUBLIC_LAB_URL +
  "delete-procedures-assign-technician?proceTechMapId=";
export const getProcedureTechniciansByDept =
  process.env.NEXT_PUBLIC_USER_URL +
  "master/employee/getAllMaterProceduresTechnicians";

// Procedures Equipment Api's
export const saveProceduresEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "saveProceduresEquipmentMapping";
export const getAllProceduresEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllProceduresEquipmentDetails";
export const getEditProceduresEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "findByProceduresEquipmentMapping/";
export const updateStatusFlagByProcedures =
  process.env.NEXT_PUBLIC_LAB_URL + "updateStatusFlagByProceduresEquipmentId/";
export const deleteProceduresEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteProceudresByEquipmentId/";

// Assign Test Parameter Api's
export const proceduresServiceName =
  process.env.NEXT_PUBLIC_DOMAIN_URL +
  "getAllServiceByServiceType-department?serviceType=ST1010";
export const proceduresParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "getProcedureParameters";
export const saveProcedureAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "save-procedureAssign-parameter";
export const updateProcedureAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "updateProcedureAssignParameter";
export const getAllProcedureAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "getAllProcedureAssignServices";
export const assignProcedureParameterHeaderId =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllProcedureAssignServicesByserviceName?assignProcedureParameterHeaderId=";
export const updateStatusProcedureAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "updateProcedureAssignParametersStatus?";
export const deleteProcedureAssignParameter =
  process.env.NEXT_PUBLIC_LAB_URL + "deleteAssignProcedureParameteres?";

//  Result Template Master Api's
export const getAllProcedureAssignServices =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllProcedureAssignServicesByserviceName?";
export const saveProcedureResultTemplate =
  process.env.NEXT_PUBLIC_LAB_URL + "saveProceduresResultTemplate";
export const getProcedureResultTemplate =
  process.env.NEXT_PUBLIC_LAB_URL + "get-all-procedures-result-template";
export const getProcedureResulUpdateById =
  process.env.NEXT_PUBLIC_LAB_URL +
  "get-procedures-result-by-headerId?headerId=";
export const updateStatusProcedureResultTamplate =
  process.env.NEXT_PUBLIC_LAB_URL +
  "procedures-result-template-statusflag-update";

//Procedures Worklist
export const proceduresWorkListSearch =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllProcedure-worklist-data?";
export const getProcedureOrderList =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllProcedureBilledOrders";
export const getProcedureMrnList =
  process.env.NEXT_PUBLIC_PATIENT_URL + "getAllBilledProcedureMrn";
export const getProcedureMoreDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "proceduresOrderItemDataByHeaderId/";

//Order details
export const getProceduresOrderIdDetailsBanner =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getProceduresOrderDetailsByorderId?orderId=";
export const getProceduresOrderDetailsByOrderId =
  process.env.NEXT_PUBLIC_LAB_URL + "getProceduresDetailsByOrderId/";
export const saveProceduresOrderDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "saveProceduresOrderDetails";
// export const getTechnicians = process.env.NEXT_PUBLIC_USER_URL + 'master/employee/getAllMaterRadiologyTechnicians'
// export const getRadiologists = process.env.NEXT_PUBLIC_USER_URL + 'master/employee/getAllRadiologyDoctors'
export const updateProceduresOrderDetails =
  process.env.NEXT_PUBLIC_LAB_URL + "update/proceduresOrderDetails";

//Result Entry
export const getProceduresDetailsByOrderId =
  process.env.NEXT_PUBLIC_LAB_URL + "getProceduresDetailsByOrderId/";
export const getProcedureServicesData =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllProcedureAssignServicesByserviceName?";
export const getProcedureTemplet =
  process.env.NEXT_PUBLIC_LAB_URL +
  "get-procedures-resultTemplateByserviceCodeAndServiceName?";
export const saveProcedureResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "procedure-save-resultEntry";
export const updateprocedureResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "update/procedure/resultEntry";
export const getProcedureServicesDataAfterSave =
  process.env.NEXT_PUBLIC_LAB_URL +
  "getAllProcedureResultentryByPatientIdAndEncounterId?orderId=";
export const verifyProcedureResultEntry =
  process.env.NEXT_PUBLIC_LAB_URL + "procedure/result-entry-verify";
export const getProcedureEquipment =
  process.env.NEXT_PUBLIC_LAB_URL + "findAllProceduresEquipmentDetails";

// bulk verify
export const verifyprocedureGrid =
  process.env.NEXT_PUBLIC_LAB_URL + "searchProceduresBulkVerify?";
export const procedureResultEntryBulkVerify =
  process.env.NEXT_PUBLIC_LAB_URL + "proceduresResultEntryBulkVerify";

export const getAllEquipmentData =
  process.env.NEXT_PUBLIC_LAB_URL +
  "findAllEquipmentDetails/departmentCode/specilaityCode?";

// Reports Api's
//"http://10.10.21.235:8012/" process.env.NEXT_PUBLIC_REPORTS
export const generateReport =
  process.env.NEXT_PUBLIC_REPORTS + "generate-report";
export const getReportFilePath =
  process.env.NEXT_PUBLIC_REPORTS + "getReportFilePaths";
export const uploadReport = process.env.NEXT_PUBLIC_REPORTS  + "upload-report";
// export const uploadReport = process.env.NEXT_PUBLIC_REPORTS + "upload-report"
export const getReportParameters =
  process.env.NEXT_PUBLIC_REPORTS + "getReportParameters";
export const getReportParametersValues =
  process.env.NEXT_PUBLIC_REPORTS + "getReportParameterValuesByFileName/";
export const saveGroupMaster =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "saveReportMaster";
export const getGroupMasterList =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "getAllMasterReportNames";
export const reportupdateStatusFlag =
  process.env.NEXT_PUBLIC_REPORTS + "reportActiveInactiveByReportName";
export const getGroupInerList =
  process.env.NEXT_PUBLIC_REPORTS + "getReportNamesByReportCategory/";
export const getActiveGroupInerList =
  process.env.NEXT_PUBLIC_REPORTS + "getActiveReportsByReportCategory/";

//OP-Billing
export const getBillingDetailsBybillId =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "getAllservicesByBillId?billNumber=";
export const getBillStatus =
  process.env.NEXT_PUBLIC_PATIENT_URL +
  "getServiceStatusByBillNumber?billNumber=";
export const cancelOpBillServices =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "opBilling/cancel-services";
export const opBillMrnSearch =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "billSearchMrn?searchString=";
export const opBillWorkListSearch =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "getAllBillDetailsByBillNumber?";
export const getReceiptAmountsDataByBillNum =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "receiptDataByReceiptNumOrBillNum?";
export const opBillingInitiateRefund =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "opBilling/initiate/refund";
export const getRefundGridData =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "opBilling/refund/worklist?";

// bill screen API's
export const saveGenerateBill =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "saveBillDetails";
// export const saveGenerateBill = process.env.NEXT_PUBLIC_OP_BILLING_URL + "saveBillDetails"

export const getOpReceiptDetails =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "getOpReceiptDetailsByDates?";
export const getBillData =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "searchBillNumbers?billNum=";
export const getReceptData =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "searchReceiptNumbers?recieptNum=";
export const saveOpBillReceipt =
  process.env.NEXT_PUBLIC_OP_BILLING_URL + "saveOpBillReceipt";
export const getReceptDataByBillNum =
  process.env.NEXT_PUBLIC_OP_BILLING_URL +
  "receiptDataByReceiptNumOrBillNum?billNum=&receiptNum=";

// Configuration Master api's
export const getConfigurationMaster =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-id-names";
// export const saveConfigurationMaster = "http://10.10.20.131:8000/" + "master/config-data"
export const saveConfigurationMaster =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-data";
export const editConfigurationMaster =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/config-dataList/";
export const statusConfigurationMaster =
  process.env.NEXT_PUBLIC_DOMAIN_URL + "master/updateMasterConfigByStatusFlag";
// https://snomed.satragroup.in/csnoserv/api/search/search?term=food&state=active&semantictag=finding&acceptability=synonyms&returnlimit=100&refsetid=null&parentid=null&fullconcept=false

// front desk consent request view
export const consentView =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hiu/fhir/decrypt-data/";

// Update mobile Number
export const sendNewOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/account/change/mobile/new/generateOTP";
export const verifyNewOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/account/change/mobile/new/verifyOTP";
export const sendOldOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/account/change/mobile/old/generateOTP";
export const updateNewNumber =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/account/change/mobile/old/verifyOTP";
export const updateEmailPhoto =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abhaProfile/update";

//Create Abha-Health-New
export const enrollmentByAadharOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollmentByAadharOtp";
export const enrollmentAadharVerifyOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollmentAadharVerifyOtp";
export const enrollAbhaAddressSuggestions =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollAbhaAddressSuggestions";
export const enrollNewAbhaAddress =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollNewAbhaAddress";
export const enrollMobileVerifyOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollment/MobileVerifyOtp";
export const enrollUpdateMobileRequestOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/enrollment/UpdateMobileRequestOtp";

//Update Email
export const updateMailRequestOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollment/UpdateMailRequestOtp";
export const mailVerifyOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/enrollment/mailVerifyOtp";

// abha new login
export const profileLoginByMobileOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/login/mobile/request/otp";
// export const profileLoginByMobileOtpVerify = process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/login/otp/verify"
export const profileLoginByMobileOtpVerify =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/login/otp/verify";
export const profileLoginByMobileVerifyUser =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/login/verify/user";
export const profileLoginByMobileAccount =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/profile/account";
export const updateAbhaAddressByMrn =
  process.env.NEXT_PUBLIC_PATIENT_URL + "updateAbhaAddressByMrn";

export const profileLoginByAadharOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/enrollment/profileLoginByAadharOtp";
export const profileLoginByAadharOtpVerify =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/enrollment/profileLoginAadharVerifyOtp";

export const getPatientByAbhaAddress =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/hiu/patient-find";
export const getPatBytxnId =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/fetch-patien-find/";

export const getCareContextOTPStatus =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getCareContextOtpStatusDetails/";

//v3 abha login by abha address
export const mobileAadhaarOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/profileLogin/AbhaAddress/RequestMobileAadhaarOtp";
export const MobileAadhaarVerifyOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL +
  "abdm/profileLogin/AbhaAddress/MobileAadhaarVerifyOtp";
export const linkCarecontext =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/link/carecontext";
export const getQrByAbhaNumAbhaAddress =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/getAbhaNumberQr";

//V3 mobile captcha
export const getMobileCaptcha =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "getCaptcha";
export const mobileCaptchaVerify =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/abha/login/otp/verify";

//Dashboard apis (onload)
export const labDashboard =
  "http://10.10.20.207:8011/" + "getLabDashboardSpecialityCounts";
export const proceduresDashboard =
  "http://10.10.20.207:8011/" + "getProceduresDepartmentDashboardCounts";
export const radiologyDashboard =
  "http://10.10.20.207:8011/" + "getRadiologySpecialityDashboardCounts";

export const getHipDataByconsentId =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/get-all-ConsentBy-requestId/";

export const deactivateAbhaRequestOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/deactivateAbhaRequestOtp";
export const deactivateAbhaVerifyOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/deactivateAbhaVerifyOtp";
export const reactivateAbhaRequestOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/reactivateAbhaRequestOtp";
export const reactivateAbhaVerifyOtp =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/reactivateAbhaVerifyOtp";
export const linkAndDeLinkAbhaByXtoken =
  process.env.NEXT_PUBLIC_HEALTHID_URL + "abdm/linkAndDeLinkAbhaByXtoken";

//Appointment Api's
export const getTimeSlots =
process.env.NEXT_PUBLIC_PATIENT_URL + "doctor/slotsByResourceType?";
export const bookAppointment = process.env.NEXT_PUBLIC_PATIENT_URL  + "bookAppointment";
export const getDoctorAvailableSlots =
process.env.NEXT_PUBLIC_PATIENT_URL + "doctor/availabilityByDate?";
export const getAppointmentDetailsByApptNo =
process.env.NEXT_PUBLIC_PATIENT_URL +
  "appoinmentdetailsByAppoinmentnumber?appointmentNumber=";
export const getAppointmentGrid = process.env.NEXT_PUBLIC_PATIENT_URL +'getAppointmentDetailsByDate?fromDate='