'use client'

import { useRef, createRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTriggerプラグインを登録
gsap.registerPlugin(ScrollTrigger);

export const Heading = () => {
    const heading = "software developer based in Japan.";
    const headingRefs = useRef(heading.split('').map(() => createRef<HTMLSpanElement>()));

    useGSAP(() => {
        // 見出しの文字アニメーションのセットアップ
        const headingChars = headingRefs.current.map(ref => ref.current);
        headingChars.forEach((char) => {
            char?.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    rotateY: 360,
                    duration: 0.7,
                    ease: 'power2.out'
                });
            });

            char?.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    rotateY: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                });
            });
        });

        // ヘッディングのパララックス（より遅く移動）
        gsap.to('h1', {
            y: -20,
            opacity: 0.8,
            scrollTrigger: {
                trigger: 'h1',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
            }
        });
    });

    return (
        <h1 className='text-3xl sm:text-6xl lg-text-[66px] font-Ovo'>
            {heading.split('').map((char, index) => (
                <span
                    key={index}
                    ref={headingRefs.current[index]}
                    className="inline-block transition-transform hover:cursor-default font-Ovo"
                    style={{ display: 'inline-block', perspective: '1000px' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    )
}

export default Heading