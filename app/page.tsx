import React from "react";

import NavBar from "./components/NavBar";
import Intro from "./components/Intro";
import Steps from "./components/Steps";
import About from "./components/About";
import Footer from "./components/Footer";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <NavBar />
      <Intro />
      <Steps />
      <About />
      <Footer />
    </div>
  );
};

export default page;
