import { assets } from '@/assets/assets'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// GSAPプラグインを登録
gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

const Navbar = ({ isDarkMode, setIsDarkMode }: NavbarProps) => {
    const [isScroll, setIsScroll] = useState(false)
    const sideMenuRef = useRef<HTMLUListElement>(null)
    const navbarRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLAnchorElement>(null)
    const menuRef = useRef<HTMLUListElement>(null)
    const actionsRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // logo animation
        tl.fromTo(logoRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
        );

        // menu animation
        tl.fromTo(menuRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.4" // overlap with previous animation
        );

        // action button animation
        tl.fromTo(actionsRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.4"
        );

        // scroll animation
        ScrollTrigger.create({
            start: 'top -10%',
            onEnter: () => {
                gsap.to(navbarRef.current, {
                    backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isDarkMode ? '0 4px 6px rgba(255, 255, 255, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    duration: 0.3
                });
            },
            onLeaveBack: () => {
                gsap.to(navbarRef.current, {
                    backgroundColor: 'transparent',
                    backdropFilter: 'none',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
        });
    }, [isDarkMode]);

    const openMenu = () => {
        if (!sideMenuRef.current) return
        sideMenuRef.current.style.transform = 'translateX(-16rem'

        // mobile menu open animation
        gsap.fromTo(sideMenuRef.current.children,
            { x: 20, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, delay: 0.2 }
        );
    }

    const closeMenu = () => {
        if (!sideMenuRef.current) return

        // animation before closing
        gsap.to(sideMenuRef.current.children, {
            x: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.3,
            onComplete: () => {
                sideMenuRef.current!.style.transform = 'translateX(16rem)'
            }
        });
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (scrollY > 50) {
                setIsScroll(true)
            } else {
                setIsScroll(false)
            }
        })

        return () => {
            // コンポーネントアンマウント時にイベントリスナーを削除
            window.removeEventListener('scroll', () => { });
        };
    }, [])

    const linkList = [
        { name: 'Home', href: '#top' },
        { name: 'About me', href: '#about' },
        { name: 'Work', href: '#work' },
    ]

    return (
        <>
            <div className='fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%] 
            dark:hidden'>
                <Image src={assets.header_bg_color} alt='' className='w-full' />
            </div>
            <nav ref={navbarRef} className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex 
            items-center justify-between z-50 ${isScroll ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-sm dark:bg-darkTheme dark:shadow-white/20"
                    : ""}`}>
                <a ref={logoRef} href="#top" className="flex-shrink-0">
                    <Image
                        src={isDarkMode ? assets.logoDark : assets.myIcon}
                        className='w-10 sm:w-20 cursor-pointer'
                        alt="My Icon"
                    />
                </a>

                <ul ref={menuRef} className={`hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3 absolute left-1/2 transform -translate-x-1/2
                ${isScroll ? "" : "bg-white shadow-sm bg-opacity-50 dark:border dark:border-white/50 dark:bg-transparent"}`}>
                    {linkList.map((link, index) => (
                        <li key={index} className='font-Ovo hover:scale-105 transition-transform'>
                            <a href={link.href}>{link.name}</a>
                        </li>
                    ))}
                </ul>

                <div ref={actionsRef} className='flex items-center gap-4 flex-shrink-0'>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="hover:rotate-12 transition-transform duration-300"
                    >
                        <Image src={isDarkMode ? assets.sunIcon : assets.moonIcon} alt="moonIcon" className='w-6' />
                    </button>
                    {/* <a href='#contact' className='hidden lg:flex items-center gap-3 px-10
                    py-2.5 border border-gray-500 rounded-full ml-4 font-Ovo hover:bg-black/5
                    hover:scale-105 transition-all duration-300 dark:hover:bg-white/10
                    dark:border-white/50'>Contact
                        <Image className='w-3' src={isDarkMode ? assets.contactArrowDark : assets.contactArrow} alt="Contact Arrow" /></a> */}

                    <button className='block md:hidden ml-3 hover:scale-110 transition-transform'
                        onClick={openMenu}>
                        <Image src={isDarkMode ? assets.menuWhite : assets.menuBlack} alt="menu-button" className='w-6' />
                    </button>
                </div>

                {/* -- ---- mobile menu ---- -- */}
                <ul ref={sideMenuRef} className='flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64
                top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500
                dark:bg-darkHover dark:text-white'>

                    <div className='absolute top-6 right-6' onClick={closeMenu}>
                        <Image src={isDarkMode ? assets.closeWhite : assets.closeBlack} alt='Close Menu'
                            className='w-5 cursor-pointer hover:rotate-90 transition-transform duration-300' />
                    </div>

                    {linkList.map((link, index) => (
                        <li key={index} className='font-Ovo hover:translate-x-2 transition-transform duration-300' onClick={closeMenu}>
                            <a href={link.href}>{link.name}</a>
                        </li>
                    ))}
                </ul>

            </nav >
        </>
    )
}

export default Navbar