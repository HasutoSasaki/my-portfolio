'use client'

import { useRef, createRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export const Greeting = () => {
    const messageRef = useRef(null)
    const greeting = "Hi! I'm Hasuto Sasaki"
    const charRefs = useRef(greeting.split('').map(() => createRef<HTMLSpanElement>()));

    useGSAP(() => {
        // 各文字に対するアニメーション
        const chars = charRefs.current.map(ref => ref.current);
        gsap.set(chars, { opacity: 0, scale: 0, x: -50 });
        gsap.to(chars, {
            opacity: 1,
            scale: 1,
            x: 0,
            stagger: 0.05,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 1.3
        });

        // パララックスアニメーション
        gsap.to(messageRef.current, {
            y: -40,
            opacity: 0.7,
            scrollTrigger: {
                trigger: messageRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    });

    return (
        <h3 ref={messageRef} className='flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo'>
            {greeting.split('').map((char, index) => (
                <span key={index} ref={charRefs.current[index]} className="inline-block font-Ovo">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h3>
    );
};