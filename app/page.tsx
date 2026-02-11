'use client'
import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Header } from "./components/Header";
import { About } from "./components/About";
// import { Services } from "./components/Services";
// import { Work } from "./components/Work";
// import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SmoothScrollSection } from "./components/SmoothScrollSection";

export default function Home() {

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.theme === 'dark' || (!('theme' in localStorage)
      && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = '';
    }
  }, [isDarkMode]);

  return (
    <>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <SmoothScrollSection>
        <Header isDarkMode={isDarkMode} />
        <About isDarkMode={isDarkMode} />
        {/* <Services /> */}
        {/* <Work /> */}
        {/* <Contact /> */}
        <Footer isDarkMode={isDarkMode} />
      </SmoothScrollSection>
    </>
  );
}
