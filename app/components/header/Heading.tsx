'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTriggerプラグインを登録
gsap.registerPlugin(ScrollTrigger);

export const Heading = () => {
    const heading = "software developer based in Japan.";
    const headingRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useGSAP(() => {
        // 見出しの文字アニメーションのセットアップ
        const headingChars = headingRefs.current.filter(Boolean);
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
                    ref={(el) => { headingRefs.current[index] = el; }}
                    className="inline-block transition-transform hover:cursor-default font-Ovo"
                    style={{ display: 'inline-block', perspective: '1000px' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    )
}