'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { toolsData } from '@/assets/assets'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

type ToolsListProps = {
    isDarkMode: boolean;
    parentRef: React.RefObject<HTMLDivElement>;
}

export const ToolsList = ({ isDarkMode, parentRef }: ToolsListProps) => {
    const toolsRef = useRef<HTMLUListElement>(null);

    useGSAP(() => {
        // ツールアイテムのスタッガー表示
        gsap.from(toolsRef.current?.children || [], {
            y: 20,
            opacity: 0,
            stagger: 0.15,
            scrollTrigger: {
                trigger: toolsRef.current,
                start: 'top 85%',
                end: 'top 65%',
                scrub: 1,
            }
        });
    }, [parentRef]);

    return (
        <>
            <h4 className='my-6 text-gray-700 font-Ovo dark:text-white/80'>Tools I use</h4>
            <ul ref={toolsRef} className='flex items-center gap-3 sm:gap-5'>
                {toolsData.map((tool, index) => (
                    <li key={index} className='flex items-center justify-center
                    w-12 sm:w-14 aspect-square border border-grey-400
                    rounded-lg cursor-pointer hover:translate-y-1
                    duration-500'>
                        <Image src={isDarkMode ? tool.iconDark : tool.icon} alt='Tool' className='w-5 sm:w-7' width={20} height={20} />
                    </li>
                ))}
            </ul>
        </>
    )
}