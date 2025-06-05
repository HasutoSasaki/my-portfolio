'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Footer = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const footerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLImageElement>(null)
    const emailRef = useRef<HTMLDivElement>(null)
    const copyrightRef = useRef<HTMLParagraphElement>(null)
    const socialRef = useRef<HTMLUListElement>(null)
    const socialIconsRef = useRef<(HTMLLIElement | null)[]>([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // footer section animation
            gsap.fromTo(footerRef.current,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // logo animation
            gsap.fromTo(logoRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                    y: 30
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // email section animation
            gsap.fromTo(emailRef.current,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.4,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // copyright animation
            gsap.fromTo(copyrightRef.current,
                {
                    opacity: 0,
                    x: -30
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    delay: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // social icon animation
            gsap.fromTo(socialRef.current,
                {
                    opacity: 0,
                    x: 30
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    delay: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            )

            // social icon individual animation
            socialIconsRef.current.forEach((icon, index) => {
                if (icon) {
                    gsap.fromTo(icon,
                        {
                            opacity: 0,
                            scale: 0.5,
                            rotation: -180
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            rotation: 0,
                            duration: 0.5,
                            delay: 1 + (index * 0.1),
                            ease: "back.out(1.7)",
                            scrollTrigger: {
                                trigger: footerRef.current,
                                start: "top 80%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    )
                }
            })
        }, footerRef)

        return () => ctx.revert()
    }, [])

    // ホバーアニメーション
    const handleLogoHover = () => {
        gsap.to(logoRef.current, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "power2.out"
        })
    }

    const handleLogoLeave = () => {
        gsap.to(logoRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out"
        })
    }

    const handleEmailHover = () => {
        gsap.to(emailRef.current, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out"
        })
    }

    const handleEmailLeave = () => {
        gsap.to(emailRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
        })
    }

    const handleSocialHover = (index: number) => {
        const icon = socialIconsRef.current[index]
        if (icon) {
            gsap.to(icon, {
                scale: 1.3,
                rotation: 360,
                duration: 0.4,
                ease: "power2.out"
            })
        }
    }

    const handleSocialLeave = (index: number) => {
        const icon = socialIconsRef.current[index]
        if (icon) {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            })
        }
    }

    return (
        <div ref={footerRef} className='mt-20'>
            <div className='text-center'>
                <div
                    onMouseEnter={handleLogoHover}
                    onMouseLeave={handleLogoLeave}
                    className="inline-block cursor-pointer"
                >
                    <Image
                        ref={logoRef}
                        src={isDarkMode ? assets.logoDark : assets.logo}
                        alt=''
                        className='w-36 mx-auto mb-2'
                    />
                </div>

                <div
                    ref={emailRef}
                    className='w-max flex items-center gap-2 mx-auto cursor-pointer'
                    onMouseEnter={handleEmailHover}
                    onMouseLeave={handleEmailLeave}
                >
                    <Image
                        src={isDarkMode ? assets.mailIconDark : assets.mailIcon}
                        alt=''
                        className='w-6'
                    />
                    hasuto.sa@gmail.com
                </div>
            </div>

            <div className='text-center sm:flex items-center justify-between border-t
            border-gray-400 mx-[10%] mt-12 py-6'>
                <p ref={copyrightRef}>© 2025 Hasuto Sasaki. All rights reserved.</p>

                <ul ref={socialRef} className='flex items-center gap-10 justify-center mt-4 sm:mt-0'>
                    <li
                        ref={el => { socialIconsRef.current[0] = el }}
                        onMouseEnter={() => handleSocialHover(0)}
                        onMouseLeave={() => handleSocialLeave(0)}
                        className="cursor-pointer"
                    >
                        <a target='_blank' href="https://github.com/HasutoSasaki/">
                            <Image
                                src={isDarkMode ? assets.githubIconWhite : assets.githubIcon}
                                alt='GitHub'
                                className='w-6'
                            />
                        </a>
                    </li>

                    <li
                        ref={el => { socialIconsRef.current[1] = el }}
                        onMouseEnter={() => handleSocialHover(1)}
                        onMouseLeave={() => handleSocialLeave(1)}
                        className="cursor-pointer"
                    >
                        <a target='_blank' href="https://x.com/vt23358/">
                            <Image
                                src={isDarkMode ? assets.xLogoIconWhite : assets.xLogoIcon}
                                alt='X'
                                className='w-6'
                            />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Footer