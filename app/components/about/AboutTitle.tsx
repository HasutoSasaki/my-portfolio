'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

export const AboutTitle = ({ parentRef }: { parentRef: React.RefObject<HTMLDivElement> }) => {
    const titleRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // タイトルのパララックス
        gsap.from(titleRef.current, {
            y: 40,
            opacity: 0,
            scrollTrigger: {
                trigger: parentRef.current,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 0.8,
            }
        });
    }, [parentRef]);

    return (
        <div ref={titleRef}>
            <h4 className='text-center mb-2 text-lg font-Ovo'>Introduction</h4>
            <h2 className='text-center text-5xl font-Ovo'>About me</h2>
        </div>
    )
}