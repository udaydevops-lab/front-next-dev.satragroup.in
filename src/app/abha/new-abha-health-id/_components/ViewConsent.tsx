import CheckboxMui from "@/app/check-box";
import React, { useEffect, useState } from "react";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import FormPropsTextFields from "@/app/_common/input";
import ActionButton from "@/app/_common/button";

export default function ViewConsent({
  setConsentChecked,
  consentChecked,
  setShowConsent,
  isConsentProvided
}: any) {
  const [isAbdmCreate, setIsAbdmCreate] = useState(false);
  const [isVoluntary, setIsVoluntary] = useState(false);
  const [isAbhaLinked, setIsAbhaLinked] = useState(false);
  const [isAuthorizeToShare, setIsAuthorizeToShare] = useState(false);
  const [isHealthProcess, setIsHealthProcess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isConfirmedPurpose, setIsConfirmedPurpose] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');

  const handleAbdmCreate = () => {
    setIsAbdmCreate(!isAbdmCreate);
  };
  const handleVoluntary = () => {
    setIsVoluntary(!isVoluntary);
  };
  const handleAbhaLinked = () => {
    setIsAbhaLinked(!isAbhaLinked);
  };
  const handleAuthorizeToShare = () => {
    setIsAuthorizeToShare(!isAuthorizeToShare);
  };
  const handleHealthProcess = () => {
    setIsHealthProcess(!isHealthProcess);
  };
  const handleConfirmed = () => {
    setIsConfirmed(!isConfirmed);
  };
  const handleConfirmedPurpose = () => {
    setIsConfirmedPurpose(!isConfirmedPurpose);
  };
  useEffect(()=>{
    if(isConsentProvided){
      setIsConfirmedPurpose(true)
      setIsConfirmed(true)
      setIsHealthProcess(true)
      setIsAuthorizeToShare(true)
      setIsAbhaLinked(true);
      setIsAbdmCreate(true);
      setIsVoluntary(true)
    }
  },[])

  return (
    <div>
      <h1 className="font-bold -mt-2">Terms and Conditions</h1>
      <div className="p-4 -mt-2 mb-0">
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="text-left text-sm mb-0 -mt-3">I hereby declare that:</div>
                  <div className="flex">
                    <div>
                      <CheckboxMui
                        label=""
                        handleChange={handleVoluntary}
                        checked={isVoluntary}
                        // checked={isConsentProvided}
                        disable={isVoluntary}
                      />
                    </div>
                    <div className="mt-2 text-left">
                      I am voluntarily sharing my Aadhaar Number / Virtual ID
                      issued by the Unique Identification Authority of India
                      <b>(“UIDAI”)</b>, and my dempgraphic information for the
                      purpose of creating an Ayushman Bharat Health Account number
                      (<b>“ABHA number”</b>) and Ayushman Bharat Health Account
                      address (<b>“ABHA Address”</b>). I authorize NHA to use my
                      Aadhaar number / Virtual ID for performing Aadhaar based
                      authentication with UIDAI as per the provisions of the
                      Aadhaar (Targeted Delivery of Financial and other Subsidies,
                      Benefits and Services) Act, 2016 for the aforesaid purpose.
                      I understand that UIDAI will share my e-KYC details, or
                      response of “Yes” with NHA upon successful authentication.
                    </div>
                  </div>
                  <div className="flex">
                    <div>
                      <CheckboxMui
                        label=""
                        handleChange={handleAbdmCreate}
                        checked={isAbdmCreate}
                        // checked={isConsentProvided}
                      />
                    </div>
                    <div className="mt-2 text-left">
                      I intend to create Ayushman Bharat Health Account Number (
                      <b>“ABHA number”</b>) and Ayushman Bharat Health Account
                      address (<b>“ABHA Address”</b>) using document other than
                      Aadhaar. (Click here to proceed further)
                    </div>
                  </div>
                  <div className="flex">
                    <div>
                      <CheckboxMui
                        label=""
                        handleChange={handleAbhaLinked}
                        checked={isAbhaLinked}
                        // checked={isConsentProvided}
                      />
                    </div>
                    <div className="mt-2 text-left">
                      I consent to usage of my ABHA address and ABHA number for
                      linking of my legacy (past) health records and
                      those which will be generated during this encounter.
                    </div>
                  </div>
                  <div className="flex">
                    <div>
                      <CheckboxMui
                        label=""
                        handleChange={handleAuthorizeToShare}
                        checked={isAuthorizeToShare}
                        // checked={isConsentProvided}
                      />
                    </div>
                    <div className="mt-2 text-left">
                      I authorize the sharing of all my health records with
                      healthcare provider(s) for the purpose of providing
                      healthcare services to me during this encounter.
                    </div>
                  </div>
                  <div>
                    <div className="flex">
                      <div>
                        <CheckboxMui
                          label=""
                          handleChange={handleHealthProcess}
                          checked={isHealthProcess}
                          // checked={isConsentProvided}
                        />
                      </div>
                      <div className="mt-2 text-left">
                        I consent to the anonymization and subsequent use of my
                        health records for public health purposes.
                      </div>
                    </div>
                    <div className="ml-10">
                      <div className="flex">
                        <div>
                          <CheckboxMui
                            label=""
                            handleChange={handleConfirmed}
                            checked={isConfirmed}
                            // checked={isConsentProvided}
                          />
                        </div>
                        <div className="mt-2 text-left">
                          I, Dr.Bhanu Chander, confirm that I have duly
                          informed and explained the beneficiary of the contents
                          of consent for aforementioned purposes.
                        </div>
                      </div>
                      <div className="flex">
                        <div>
                          <CheckboxMui
                            label=""
                            handleChange={handleConfirmedPurpose}
                            checked={isConfirmedPurpose}
                            // checked={isConsentProvided}
                          />
                        </div>
                        <div className="mt-3 text-left flex">
                          <div>I,&nbsp;</div>
                          <div className="-mt-2">
                            <FormPropsTextFields
                              label={`Beneficiary Name`}
                              name="beneficiaryName"
                              value={beneficiaryName}
                              handleChange={(e: any) => setBeneficiaryName(e.target.value)}
                            />
                          </div>
                          <div>
                            &nbsp;have been explained about the consent as stated above
                            and hereby provide my consent for the &nbsp;aforementioned
                            purposes.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className='flex gap-4 justify-end mt-3 mb-0'>
        <ActionButton
          buttonText={"I Agree"}
          width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          disabled={!beneficiaryName}
          handleSubmit={() => setShowConsent(false)}
        />
        <ActionButton
          buttonText={"Close"}
          width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          disabled={false}
          handleSubmit={() => setShowConsent(false)}
        />
      </div>
    </div>
  );
}
