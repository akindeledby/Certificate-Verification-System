import React from "react";

import Intro from "./components/Intro";
import Steps from "./components/Steps";
import About from "./components/About";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import { getUserId } from "../lib/auth";

type Props = {};

export default async function page(props: Props) {
  const userId = await getUserId();
  return (
    <div>
      <NavBar />
      <Intro />
      <Steps />
      <About />
      <Footer />
    </div>
  );
}
