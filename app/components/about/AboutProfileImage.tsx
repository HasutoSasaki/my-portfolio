'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

export const AboutProfileImage = ({ parentRef }: { parentRef: React.RefObject<HTMLDivElement> }) => {
    const profileImageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // プロフィール画像のパララックス
        gsap.from(profileImageRef.current, {
            y: 80,
            opacity: 0,
            scrollTrigger: {
                trigger: parentRef.current,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1.5,
            }
        });
    }, [parentRef]);

    return (
        <div ref={profileImageRef} className='w-64 sm:w-80 rounded-3xl max-w-none'>
            <Image src={assets.profile} alt="Profile" className='w-full rounded-3xl' />
        </div>
    )
}
