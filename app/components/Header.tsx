'use client'

import { useRef, createRef } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Header = () => {
    const messageRef = useRef(null)
    const imageContainerRef = useRef(null)
    const profileImageRef = useRef(null)
    const imageBorderRef = useRef(null)
    const greeting = "Hi! I'm Hasuto Sasaki"
    const charRefs = useRef(greeting.split('').map(() => createRef<HTMLSpanElement>()));

    useGSAP(() => {
        const imageTimeline = gsap.timeline();

        const circumference = 1000;

        gsap.set(profileImageRef.current, { opacity: 0 });

        gsap.set(imageBorderRef.current, {
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            opacity: 1
        });

        // 1. 円を描画
        imageTimeline.to(imageBorderRef.current, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power1.inOut'
        });

        // 2. ボーダー描画が完了したら、ボーダーを非表示にする
        imageTimeline.to(imageBorderRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        }, "fadeInStart");

        // 3. 画像をフェードイン
        imageTimeline.to(profileImageRef.current, {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, "fadeInStart");


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
    });
    return (
        <div className='w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col
        items-center justify-center gap-4'>
            <div ref={imageContainerRef} className="relative w-32 h-40 flex items-center justify-center">
                <svg className="absolute w-full h-full" viewBox="0 0 100 125">
                    <ellipse
                        ref={imageBorderRef}
                        cx="50"
                        cy="62"
                        rx="49"
                        ry="61"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                    />
                </svg>
                <Image
                    ref={profileImageRef}
                    src={assets.profile}
                    alt='Profile Image'
                    className='rounded-full w-full h-full object-cover'
                />
            </div>
            <h3 ref={messageRef} className='flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo'>
                {greeting.split('').map((char, index) => (
                    <span key={index} ref={charRefs.current[index]} className="inline-block font-Ovo">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </h3>
            <h1 className='text-3xl sm:text-6xl lg-text-[66px] font-Ovo'>
                software developer based in Japan.</h1>
            <p className='max-w-2xl mx-auto font-Ovo'>
                I am a software developer from Japan with 2 years experience in an SES company.
            </p>
            <div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
                <a href="#contact"
                    className='px-10 py-3 border border-white rounded-full bg-black
                    text-white flex items-center gap-2 dark:bg-transparent'>contact me
                    <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
                </a>
                <a href="/resume.pdf" download
                    className='px-10 py-3 border rounded-full border-gray-500 flex
                        items-center gap-2 bg-white dark:text-black'>my resume
                    <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
                </a>
            </div>
        </div >
    )
}

export default Header