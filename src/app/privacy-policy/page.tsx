"use client";
import React from 'react'
import BackIcon from '../_common/common_icons/back-to-home-icon';
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter()
  return (
    <>
      <div className="privacy-policy">
        <div className="titlee w-full py-4 px-6">
          <h1 className='text-xl px-6' title="Back to Login"><b>Privacy Policy</b><a onClick={() => { router.push("/login"); }}> <BackIcon /></a></h1>
        </div>
        <div className="w-full mx-auto max-w-7xl pt-4 pb-4 px-4 md:pb-6 2xl:pb-6">

          <p>
            <b> Applicability</b>
          </p>
          <p>
            The provisions of the Privacy Policy shall be applicable to the
            individuals / users of SATRA eArogya Application <strong>(“App”)</strong>.
          </p>
          <p className="pt-3 pb-3">
            <b>Purpose of the Privacy Policy</b>
          </p>
          <p>
            The SATRA Services and Solutions Pvt Ltd &apos;SATRA&apos; is committed to
            the protection of privacy of data and will take all reasonable steps
            to protect the personal data belonging to users of the App. This
            privacy policy outlines how the App collects, processes and uses
            personal data of individuals in compliance with the ABDM Health Data
            Management Policy &apos;HDM Policy&apos;, available at <strong><u>Health Data Management Policy</u></strong> and the provisions of other applicable laws. SATRA understands and
            respects user&apos;s privacy and it is committed to protect it. Any
            collection of personal or sensitive personal data may be done only
            with the consent of the data principal
          </p>
          <div className="pt-3">
            <p> This Privacy Policy is published in compliance with, inter alia:
            </p>
            <ol style={{ listStyleType: "lower-roman" }}>
              <li>Section 43 A of the Information Technology Act, 2000;</li>
              <li>
                Regulation 4 of the Information Technology (Reasonable Security
                Practices and Procedures and Sensitive Personal Information)
                Rules, 2011 (the &apos;SPI Rules&apos;);
              </li>
              <li>
                Regulation 3(1) of the Information Technology (Intermediaries
                Guidelines) Rules, 2011.
              </li>
            </ol>
          </div>

          <div className="pt-3">
            <p>This Privacy Policy states the following:</p>
            <ol style={{ listStyleType: "lower-roman" }}>
              <li>The type of information collected from the Users, including Personal Information (as defined below) and Sensitive Personal Data or Information (as defined below) relating to an individual;</li>
              <li>
                The purpose, means and modes of collection, usage, processing, retention and destruction of such information; and
              </li>
              <li>
                How and to whom SATRA will disclose such information.
              </li>
            </ol>
          </div>
          <div className="pt-3">
            <p><b>Collection, Use and Storage Limitation</b></p>
            <ol style={{ listStyleType: "upper-alpha" }}>
              <li> App shall ensure that</li>
              <ol style={{ listStyleType: "lower-alpha" }}>
                <li>collection and use of personal data from user is done only to the extent necessary for the purposes of processing;</li>
                <li>the processing of all personal data will be done in a fair and reasonable manner, ensuring the privacy of the user;</li>
                <li>consent of the user;</li>
                <li>The personal data collected will not be retained beyond the period necessary to satisfy the purpose for which it is collected.</li>
              </ol>
              <li>The following categories of data may be collected by the App:</li>

              <table className="table-fixed w-full text-left mt-2 mb-2 border-separate border-spacing-2 border border-slate-900 ">
                <thead>
                  <tr className='border'>
                    <th>User data</th>
                    <th>Category</th>
                    <th>Field requirement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>Personal</td>
                    <td>Mandatory</td>
                  </tr>
                  <tr>
                    <td>Year of Birth</td>
                    <td>Personal</td>
                    <td>Mandatory</td>
                  </tr>
                  <tr>
                    <td>Date/Month of Birth</td>
                    <td>Personal</td>
                    <td>Non-Mandatory</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>Sensitive</td>
                    <td>Mandatory</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td>Personal</td>
                    <td>Mandatory</td>
                  </tr>
                  <tr>
                    <td>District</td>
                    <td>Personal</td>
                    <td>Mandatory</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>Personal</td>
                    <td>Non-Mandatory</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>Personal</td>
                    <td>Mandatory</td>
                  </tr>
                  <tr>
                    <td>Mobile Number</td>
                    <td>Personal</td>
                    <td>Non-Mandatory</td>
                  </tr>
                  <tr>
                    <td>ABHA Number</td>
                    <td>Personal</td>
                    <td>Non-Mandatory</td>
                  </tr>
                  <tr>
                    <td>Geo Coordinates</td>
                    <td>Sensitive</td>
                    <td>Mandatory</td>
                  </tr>
                </tbody>
              </table>
              <li> The personal data mentioned above in (B) may be collected using the following methods or mechanisms:</li>
              <ol style={{ listStyleType: "lower-alpha" }}>
                <li> Following are the methods or mechanisms for the collection of personal data:</li>
                <ol type="i">
                  <li> User provides the required personal details using self-registration on the App using Mobile OTP Authentication. In this mode of registration, user self declares the requested fields mentioned above; or</li>
                  <li>User provides the required personal details using self-registration on App using email OTP Authentication. In this mode of registration, user self declares the requested fields mentioned above; or</li>
                  <li>  Lastly if the ABHA (number) of the user has been already created then the user can fetch the required personal details from the ABHA system itself using mobile OTP or Aadhar OTP authentication.</li>
                </ol>
                <li> Personal data may also be collected incidentally by SATRA in the following instances, where the user:</li>
                <ol type="i">
                  <li> Provides the App with personal data such as name, date of birth, ABHA (number), email id, phone number</li>
                  <li>The App may request access to or permission for certain features from the mobile device of the user, including the camera and storage. If the user wishes to change the access or permissions, they may do so in the device&apos;s settings.</li>
                  <li>The camera feature has been added for the specific purpose of scanning a QR code at health facility, confirm all details and share health related consent-based information/data in one click of the user. The camera shall not access any personal Information/data of the user.</li>
                  <li> The App may use the mobile devices external storage to access files/documents. The may App use cache memory of the mobile device for the purpose of enabling the user to access medical & health records in the form of PDF&apos;s or any other format which can also be downloaded by the user on mobile device. </li>
                </ol>
                <li>The App may request to send the user push notifications regarding their account or certain features of the App. If the user wishes to opt-out from receiving these types of communications, they may turn them off in their device&apos;s settings.</li>
                <li> Additionally, some personal data may also be collected automatically by the App, such as Mobile device information such as your mobile device ID, model, operating system, version information and geo location.</li>
                <li> The purpose of capturing additional geo location is to allow scan QR Code for receiving token number in app functionality only within India.</li>

              </ol>
              <p><b>Purpose Limitation</b></p>
              <p>All personal data collected and processed by the App are specific, lawful and has clear purpose identified as below.</p>
              <li>The personal data of the user may be shared with the following individuals or entities:</li>
              <ol style={{ listStyleType: "lower-alpha" }}>
                <li>Any individual or entity under ABDM with whom the user consents to sharing such data.</li>
                <li>User&apos;s information shall not be shared with any third party until it is required by applicable law of the land. The App has appropriate controls to protect and safeguard the privacy of user&apos;s personal information shared or collected by it. Where appropriate, encryption methods are used to protect data, which is deemed to be sensitive, or any other data that must remain secure inorder to meet Central, State ABDM&apos;s obligations under applicable law.</li>
              </ol>
              <p><b>Empowerment and rights of the user</b></p>
              <li>The user has the following rights provided to them:</li>
              <ol style={{ listStyleType: "lower-alpha" }}>
                <li>The right to confirmation and access</li>
                <li>The right to correction and erasure</li>
                <li>The right to restrict or object to disclosure</li>
                <li> The right to data portability</li>
                <li>The right to lodge a complaint or grievance with the SATRA - Grievance Redressal Officer</li>
                <p>The procedure for the exercise of these rights is as follows:</p>
                <li>In the event that the user wishes to refer any issue relating to its rights to the grievance officer of SATRA, the same may be contacted at: Company Address :</li>
                <p>Grievance Redressal Officer,</p>
                <p>SATRA Services and Solutions Private Limited</p>
                <p>401, Jain Sadguru Image&apos;s Capital Park</p>
                <p>Image Garden Lane, Hi-Tech City, Madhapur</p>
                <p>Hyderabad, Telangana-500 081</p>
                <p>E-mail: grievance[at]satragroup[dot]in</p>
              </ol>
              <p><b>Disclosures</b></p>
              <li>The App may request access or permission to certain features from the mobile device of the user, including the camera and storage. If the user wishes to change the access or permissions, they may do so in the device&apos;s settings.</li>
              <li><strong>Camera</strong></li>
              <p className="pt-2">The camera feature has been added for the specific purpose of scanning a QR code at health facility, confirm all details and share health related consent-based information/data in one click of the user. The camera shall not access any personal information/data of the user.</p>
              <li><strong>Storage</strong></li>
              <p className="pt-2">The App may use the mobile devices external storage to access files/documents. The App uses cache memory of the mobile device for the purpose of enabling the user to access medical & health records in the form of PDF&apos;s or any other format which can also be downloaded by the user on mobile device.</p>
              <li><strong>Sharing of data</strong></li>
              <p className="pt-2">User of the App to note that SATRA does not share the personal data with other people/entity. Any sharing of personal data shall take place with free, clear, informed and specific consent of the user. No personal information or health records collected by the app will be shared or disclosed to any third party without user&apos;s consent.</p>
              <li><strong>GPS Location / Geo Location</strong></li>
              <p className="pt-2">The purpose of capturing additional geo location is to allow scan QR Code for receiving token number in app functionality only within India.</p>
              <p><strong>Security Safeguards</strong></p>
              <li>The App adopts the principles in relation to security standards and accountability. This includes:</li>
              <ol style={{ listStyleType: "lower-alpha" }}>
                <li>data management protocols to be followed by data processors;</li>
                <li>data protection impact assessments that must be carried out before undertaking any processing involving new technologies or any other processing which carries a risk of significant harm to users;</li>
                <li>maintenance of accurate and up-to-date records to document the important operations in the data lifecycle including collection, transfers, and erasure of personal data; (d) maintenance of a strict audit trail of all processing activities which have access to any personal data, at all times; and</li>
                <li> maintenance of a record of how such personal data is processed by the App in a manner that enables the audit and review of any use of such personal data.</li>
              </ol>
              <p><strong>Accountability</strong></p>
              <p className="pt-2">SATRA is accountable for complying with measures which give effect to the privacy principles while processing any personal data by it or on its behalf. In addition, users should at all times have control and decision-making power over the manner in which personal data associated with them is collected and further processed</p>
              <p><strong>Choice & Consent</strong></p>
              <p className="pt-2">The knowledge and consent of a user are required for the collection, use or disclosure of personal data. The App shall provide an option to user to opt-in/opt-out of the App at any time or choose not to provide the information sought at any given time.</p>
              <p><strong>Privacy by Design</strong></p>
              <p className="pt-2">SATRA ascertains/ includes data protection requirements as part of the design and implementation of systems, services, products and business practices. It ensures that the interest of the user is accounted for at every stage of processing of personal data.</p>

            </ol>
          </div>

        </div>
      </div>
    </>
  )
}
