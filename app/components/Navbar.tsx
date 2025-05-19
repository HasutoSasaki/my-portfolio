import { assets } from '@/assets/assets'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const Navbar = () => {
    const [isScroll, setIsScroll] = useState(false)
    const sideMenuRef = useRef<HTMLUListElement>(null)

    const openMenu = () => {
        if (!sideMenuRef.current) return
        sideMenuRef.current.style.transform = 'translateX(-16rem'
    }
    const closeMenu = () => {
        if (!sideMenuRef.current) return
        sideMenuRef.current.style.transform = 'translateX(16rem)'
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (scrollY > 50) {
                setIsScroll(true)
            } else {
                setIsScroll(false)
            }
        })
    }, [])



    const linkList = [
        { name: 'Home', href: '#top' },
        { name: 'About me', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' },
        { name: 'Blog', href: '#blog' }
    ]

    return (
        <>
            <div className='fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%]'>
                <Image src={assets.header_bg_color} alt='' className='w-full' />
            </div>
            <nav className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex 
            items-start justify-between z-50 ${isScroll ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-sm"
                    : ""}`}>
                <a href="#top">
                    <Image
                        src={assets.myIcon}
                        className='w-20 cursor-pointer mr-14'
                        alt="My Icon"
                    />
                </a>

                <ul className={`hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3
                ${isScroll ? "" : "bg-white shadow-sm bg-opacity-50"}`}>
                    {linkList.map((link, index) => (
                        <li key={index} className='font-Ovo'>
                            <a href={link.href}>{link.name}</a>
                        </li>
                    ))}
                </ul>

                <div className='flex items-center gap-4'>

                    <button>
                        <Image src={assets.moonIcon} alt="moonIcon" className='w-6' />
                    </button>
                    <a href='#contact' className='hidden lg:flex items-center gap-3 px-10
                    py-2.5 border border-gray-500 rounded-full ml-4'>Contact <Image className='w-3' src={assets.contactArrow} alt="Contact Arrow" /></a>

                    <button className='block md:hidden ml-3'
                        onClick={openMenu}>
                        <Image src={assets.menuIcon} alt="menu-button" className='w-6' />
                    </button>
                </div>

                {/* -- ---- mobile menu ---- -- */}
                <ul ref={sideMenuRef} className='flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64
                top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500'>

                    <div className='absolute top-6 right-6' onClick={closeMenu}>
                        <Image src={assets.closeIcon} alt='Close Menu'
                            className='w-5 cursor-pointer' />
                    </div>

                    {linkList.map((link, index) => (
                        <li key={index} className='font-Ovo' onClick={closeMenu}>
                            <a href={link.href}>{link.name}</a>
                        </li>
                    ))}
                </ul>

            </nav >
        </>
    )
}

export default Navbar