'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);

export const Bio = () => {
    const bioRef = useRef(null)

    useGSAP(() => {
        // parallax animation 
        gsap.to(bioRef.current, {
            y: -30,
            opacity: 0.85,
            scrollTrigger: {
                trigger: bioRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.7,
            }
        });
    });

    return (
        <p ref={bioRef} className='max-w-2xl mx-auto font-Ovo'>
            I am a software developer from Japan with 2 years experience in an SES company.
        </p>
    )
}