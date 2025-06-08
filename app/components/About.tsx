'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AboutProfileImage, AboutContent, AboutTitle } from './about/index';

gsap.registerPlugin(ScrollTrigger);

export const About = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const aboutSectionRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    return (
        <div ref={aboutSectionRef} id='about' className='w-full px-[12%] py-10
        scroll-mt-20'>
            <AboutTitle parentRef={aboutSectionRef} />

            <div className='flex w-full flex-col lg:flex-row items-center gap-20 my-20'>
                <AboutProfileImage parentRef={aboutSectionRef} />
                <AboutContent isDarkMode={isDarkMode} parentRef={aboutSectionRef} />
            </div>
        </div>
    )
}