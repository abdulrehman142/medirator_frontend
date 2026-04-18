import medicalHistory from "/medirator_images/history.png";

interface MedicalHistoryProps {
  darkMode?: boolean;
}
const MedicalHistory = ({ darkMode = false }: MedicalHistoryProps) => {
  type Gender = "male" | "female";

  const PersonCard = ({
    name,
    gender,
    imageSrc,
    className,
  }: {
    name: string;
    gender: Gender;
    imageSrc: string;
    className: string;
  }) => (
    <div className={`absolute w-[140px] h-[130px] bg-[#0B3C5D] dark:bg-black border-4 border-[#0B3C5D] rounded-md shadow-sm ${className}`}>
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src={imageSrc}
          alt={name}
          className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 object-cover"
          loading="lazy"
        />
        <div className="mt-3 text-sm font-semibold text-white text-center">{name}</div>
        <div className="text-[11px] uppercase tracking-wide text-white">{gender}</div>
      </div>
    </div>
  );
  const genderImages = {
    male: "/medirator_images/male.png",
    female: "/medirator_images/female.png",
  };

  const people = {
    grandMother: { gender: "female" as Gender, imageSrc: genderImages.female },
    grandFather: { gender: "male" as Gender, imageSrc: genderImages.male },
    sonWife: { gender: "female" as Gender, imageSrc: genderImages.female },
    sonOne: { gender: "male" as Gender, imageSrc: genderImages.male },
    daughterHubby: { gender: "male" as Gender, imageSrc: genderImages.male },
    daughter: { gender: "female" as Gender, imageSrc: genderImages.female },
    sonTwo: { gender: "male" as Gender, imageSrc: genderImages.male },
    grandSon: { gender: "male" as Gender, imageSrc: genderImages.male },
    grandDaughter: { gender: "female" as Gender, imageSrc: genderImages.female },
    daughterChild: { gender: "female" as Gender, imageSrc: genderImages.female },
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6">
        <div className="">
          <h2 className="text-5xl font-bold ">Medical History</h2>
          <p className="mt-2">
            Medirator keeps your complete medical history <br />
            organized with prior information so you can <br />
            review past conditions, treatments, and reports <br />
            whenever needed.
          </p>
        </div>
        <img src={medicalHistory} alt="Medical History" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white flex justify-center items-center">
        <div className="w-full dark:bg-black">
          <div className="relative w-[1100px] h-[760px] mx-auto min-w-[1100px]">

            <div className="absolute h-[2px] bg-[#0B3C5D] w-[160px] top-[190px] left-[470px]" />
            <div className="absolute w-[2px] h-[70px] bg-[#0B3C5D] top-[190px] left-[550px]" />
            <div className="absolute h-[2px] bg-[#0B3C5D] w-[720px] top-[260px] left-[150px]" />
            <div className="absolute w-[2px] h-[20px] bg-[#0B3C5D] top-[260px] left-[150px]" />
            <div className="absolute w-[2px] h-[20px] bg-[#0B3C5D] top-[260px] left-[330px]" />
            <div className="absolute w-[2px] h-[20px] bg-[#0B3C5D] top-[260px] left-[510px]" />
            <div className="absolute w-[2px] h-[20px] bg-[#0B3C5D] top-[260px] left-[690px]" />
            <div className="absolute w-[2px] h-[20px] bg-[#0B3C5D] top-[260px] left-[870px]" />

            <div className="absolute w-[2px] h-[48px] bg-[#0B3C5D] top-[410px] left-[330px]" />
            <div className="absolute h-[2px] bg-[#0B3C5D] w-[180px] top-[458px] left-[240px]" />
            <div className="absolute w-[2px] h-[22px] bg-[#0B3C5D] top-[458px] left-[240px]" />
            <div className="absolute w-[2px] h-[22px] bg-[#0B3C5D] top-[458px] left-[420px]" />

            <div className="absolute w-[2px] h-[48px] bg-[#0B3C5D] top-[410px] left-[600px]" />

            <PersonCard
              name="GrandMother"
              gender={people.grandMother.gender}
              imageSrc={people.grandMother.imageSrc}
              className="top-[120px] left-[400px]"
            />
            <PersonCard
              name="GrandFather"
              gender={people.grandFather.gender}
              imageSrc={people.grandFather.imageSrc}
              className="top-[120px] left-[560px]"
            />

            <PersonCard
              name="Son Wife"
              gender={people.sonWife.gender}
              imageSrc={people.sonWife.imageSrc}
              className="top-[280px] left-[80px]"
            />
            <PersonCard
              name="Son One"
              gender={people.sonOne.gender}
              imageSrc={people.sonOne.imageSrc}
              className="top-[280px] left-[260px]"
            />
            <PersonCard
              name="Daughter Hubby"
              gender={people.daughterHubby.gender}
              imageSrc={people.daughterHubby.imageSrc}
              className="top-[280px] left-[440px]"
            />
            <PersonCard
              name="Daughter"
              gender={people.daughter.gender}
              imageSrc={people.daughter.imageSrc}
              className="top-[280px] left-[620px]"
            />
            <PersonCard
              name="Son Two"
              gender={people.sonTwo.gender}
              imageSrc={people.sonTwo.imageSrc}
              className="top-[280px] left-[800px]"
            />

            <PersonCard
              name="Grand Son"
              gender={people.grandSon.gender}
              imageSrc={people.grandSon.imageSrc}
              className="top-[480px] left-[170px]"
            />
            <PersonCard
              name="Grand Daughter"
              gender={people.grandDaughter.gender}
              imageSrc={people.grandDaughter.imageSrc}
              className="top-[480px] left-[350px]"
            />
            <PersonCard
              name="Daughter Child"
              gender={people.daughterChild.gender}
              imageSrc={people.daughterChild.imageSrc}
              className="top-[480px] left-[530px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
