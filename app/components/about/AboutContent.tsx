'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SkillsList, ToolsList } from './index'

gsap.registerPlugin(ScrollTrigger);

type AboutContentProps = {
    isDarkMode: boolean;
    parentRef: React.RefObject<HTMLDivElement>;
}

export const AboutContent = ({ isDarkMode, parentRef }: AboutContentProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // parallax
        gsap.from(contentRef.current, {
            y: 100,
            opacity: 0,
            scrollTrigger: {
                trigger: parentRef.current,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1,
            }
        });
    }, [parentRef]);

    return (
        <div ref={contentRef} className='flex-1'>
            <p>I am a software engineer at Classmethod, building web applications with
                React and TypeScript on the frontend and an AWS serverless stack
                (Lambda, DynamoDB, CDK) on the backend.<br />
                Before joining Classmethod, I spent two years as a frontend engineer at
                an SES company, where I handled projects end-to-end from planning and
                design to development, and also led engineering teams.<br />
                I constantly strive to deliver value from both user perspective and engineering standpoint,
                while contributing to the overall productivity and quality improvement of the team.
            </p>

            <SkillsList isDarkMode={isDarkMode} parentRef={parentRef} />
            <ToolsList isDarkMode={isDarkMode} parentRef={parentRef} />
        </div>
    )
}
