'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface ProfileImageProps {
    isDarkMode: boolean;
}

export const ProfileImage = ({ isDarkMode }: ProfileImageProps) => {
    const imageContainerRef = useRef(null)
    const profileImageRef = useRef(null)
    const imageBorderRef = useRef(null)

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

        // parallax animation
        gsap.to(imageContainerRef.current, {
            y: -60,
            scrollTrigger: {
                trigger: imageContainerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    });

    return (
        <div ref={imageContainerRef} className="relative w-32 h-40 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 125">
                <ellipse
                    ref={imageBorderRef}
                    cx="50"
                    cy="62"
                    rx="49"
                    ry="61"
                    fill="none"
                    stroke={isDarkMode ? '#fff' : '#000'}
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
    )
}
