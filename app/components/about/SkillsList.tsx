'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { skillsData } from '@/assets/assets'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

type SkillsListProps = {
    isDarkMode: boolean;
    parentRef: React.RefObject<HTMLDivElement>;
}

export const SkillsList = ({ isDarkMode, parentRef }: SkillsListProps) => {
    const skillsRef = useRef<HTMLUListElement>(null);

    useGSAP(() => {
        // スキルアイテムのスタッガー表示
        gsap.from(skillsRef.current?.children || [], {
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            scrollTrigger: {
                trigger: skillsRef.current,
                start: 'top 85%',
                end: 'top 65%',
                scrub: 1,
            }
        });
    }, [parentRef]);

    return (
        <ul ref={skillsRef} className='flex flex-wrap items-center gap-3 sm:gap-2 my-6'>
            {skillsData.map((skill, index) => (
                <li key={index} className='inline-flex items-center gap-2
                px-3 py-1 rounded-full text-gray-700 dark:text-white/80 dark:border dark:border-white/20'
                    style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }}>
                    <Image src={isDarkMode ? skill.iconDark : skill.icon} alt={skill.name} className='w-5 h-5' width={20} height={20} />
                    <span className='font-semibold'>{skill.name}</span>
                </li>
            ))}
        </ul>
    )
}