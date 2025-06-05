'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProfileImage, Greeting, Heading, Bio, ActionButtons } from './header/index'

gsap.registerPlugin(ScrollTrigger);

const Header = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const headerSectionRef = useRef(null)

    useGSAP(() => {
        // parallax animation
        ScrollTrigger.create({
            trigger: headerSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        });
    });

    return (
        <div ref={headerSectionRef} className='w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col
        items-center justify-center gap-4'>
            <ProfileImage isDarkMode={isDarkMode} />
            <Greeting />
            <Heading />
            <Bio />
            <ActionButtons />
        </div>
    )
}

export default Header