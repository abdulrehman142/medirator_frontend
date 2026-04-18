import whyChooseUsLight from "/medirator_images/whychooseus.png";
import whyChooseUsDark from "/medirator_images/dwhychooseus.jpeg";
import patienthistoryIcon from "/medirator_images/patienthistory.png";
import proactiveCareIcon from "/medirator_images/proactivecare.png";
import encryptionIcon from "/medirator_images/encryption.png";
import bandrugIcon from "/medirator_images/bandrug.png";
import manageschedulesIcon from "/medirator_images/manageschedules.png";
import simpleinterfaceIcon from "/medirator_images/simpleinterface.png";







  
interface DropdownProps {
  darkMode: boolean;
}
const Whychooseus = ({ darkMode }: DropdownProps) => {
  return (
    <div>
      <div className="flex dark:bg-black bg-white">
        <img
          src={darkMode ? whyChooseUsDark : whyChooseUsLight}
          alt="whychooseus"
          className="rounded-2xl pl-1 h-150 w-150 p-10 m-10 ml-30 "
          loading="lazy"
        />
        <div className="flex flex-col p-5 m-5">
          <div className="text-[#0B3C5D] dark:text-white text-2xl font-bold mb-5">
            Why Choose Us?
          </div>
          <div className="flex items-center">
            <img
              src={patienthistoryIcon}
              alt="verify"
              className="ml-0 pl-0 m-2 p-2 h-12 w-12 "
              loading="lazy"
            />
            <div className="pl-0 ml-0 p-2 m-2 text-xl dark:text-white">
              Access <strong>patient history</strong>, medications, and family medical background.
            </div>
          </div>
          <div className="flex items-center">
            <img
              src={proactiveCareIcon}
              alt="time"
              className="ml-0 pl-0 m-2 p-2 h-12 w-12 "
              loading="lazy"
            />
            <div className="pl-0 ml-0 p-2 m-2 text-xl dark:text-white">
              Predict health risks for <strong>proactive care</strong>.
            </div>
          </div>
          <div className="flex items-center">
            <img
              src={encryptionIcon}
              alt="customersupport"
              className="ml-0 pl-0 m-2 p-2 h-12 w-12 "
              loading="lazy"
            />
            <div className="pl-0 ml-0 p-2 m-2 text-xl dark:text-white">
              Protect sensitive information with <strong>encryption and access control</strong>.
            </div>
          </div>
          <div className="flex items-center">
            <img
              src={bandrugIcon}
              alt="customersupport"
              className="ml-0 pl-0 m-2 p-2 h-13 w-11 "
              loading="lazy"
            />
            <div className="pl-0 ml-0 p-2 m-2 text-xl dark:text-white">
             Avoid duplication and harmful <strong>drug interactions</strong>.
            </div>
          </div>
          <div className="flex items-center">
            <img
              src={manageschedulesIcon}
              alt="assurance"
              className="ml-0 pl-0 m-2 p-2 h-12 w-10 "
              loading="lazy"
            />
            <div className="pl-0 ml-0 p-2 m-2 text-xl dark:text-white">
             <strong>Manage schedules, records, tests, and appointments</strong><br/> in one place.
            </div>
          </div>
          <div className="flex items-center">
            <img
              src={simpleinterfaceIcon}
              alt="trust"
              className="ml-0 pl-0 m-2 p-2 h-12 w-10"
              loading="lazy"
            />
            <div className="pl-0 ml-0 p-2 m-2 text-xl dark:text-white">
              <strong>Simplified interfaces</strong> for doctors and patients.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whychooseus;
