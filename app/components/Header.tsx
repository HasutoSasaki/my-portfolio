'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Header = () => {
    const messageRef = useRef(null)
    const imageContainerRef = useRef(null)
    const greeting = "Hi! I'm Hasuto Sasaki"

    useGSAP(() => {
        // プロフィール画像の円形描画アニメーション
        const imageTimeline = gsap.timeline();

        // 最初の状態設定: 画像は非表示、ボーダーも0%
        gsap.set('.profile-img', { opacity: 0 });
        gsap.set('.image-border', { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 1 });

        // 1. ボーダーを描画するアニメーション
        imageTimeline.to('.image-border', {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.inOut'
        });

        // 2. 画像をフェードイン
        imageTimeline.to('.profile-img', {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
        });

        // 3. border fade out
        imageTimeline.to('.image-border', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        });


        // 各文字に対するアニメーション
        const chars = gsap.utils.toArray('.char');
        gsap.set(chars, { opacity: 0, scale: 0, x: -50 });
        gsap.to(chars, {
            opacity: 1,
            scale: 1,
            x: 0,
            stagger: 0.05,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 2.5
        })
    });
    return (
        <div className='w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col
        items-center justify-center gap-4'>
            <div ref={imageContainerRef} className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="image-border"
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />
                </svg>
                <Image
                    src={assets.profile}
                    alt='Profile Image'
                    className='rounded-full w-full h-full object-cover profile-img'
                />
            </div>
            <h3 ref={messageRef} className='flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo'>
                {greeting.split('').map((char, index) => (
                    <span key={index} className="char inline-block font-Ovo">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </h3>
            <h1 className='text-3xl sm:text-6xl lg-text-[66px] font-Ovo'>
                frontend web developer based in Japan.</h1>
            <p className='max-w-2xl mx-auto font-Ovo'>
                I am a frontend web developer from Japan, Japan with 10 years of experience
                in multiple companies like Microsoft,
            </p>
            <div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
                <a href="#contact"
                    className='px-10 py-3 border border-white rounded-full bg-black
                    text-white flex items-center gap-2 dark:bg-transparent'>contact me
                    <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
                </a>
                <a href="/sample.pdf" download
                    className='px-10 py-3 border rounded-full border-gray-500 flex
                        items-center gap-2 bg-white dark:text-black'>my resume
                    <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
                </a>
            </div>
        </div >
    )
}

export default Header