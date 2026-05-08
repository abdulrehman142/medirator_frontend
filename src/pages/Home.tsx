import Hero from "../components/Hero";
import Services from "../pages/services/Services";
import Whychooseus from "../components/Whychooseus";
import Rating from "../components/Rating";
import Complaints from "./Complaints";

type HomeProps = {
  darkMode: boolean;
};

export default function Home({ darkMode }: HomeProps) {
  return (
    <>
      <Hero />
      <Services darkMode={darkMode}/>
      <Whychooseus darkMode={darkMode} />
      <Rating />
      <Complaints darkMode={darkMode} />
    </>
  );
}
