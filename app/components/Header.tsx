import Image from 'next/image'
import React from 'react'
import { assets } from '@/assets/assets'

const Header = () => {
    return (
        <div className='w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col
        items-center justify-center gap-4'>
            <Image src={assets.profile} alt='Profile Image'
                className='rounded-full w-32' />
            <h3 className='flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo'>
                Hi! I'm Hasuto Sasaki 👋
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
                    text-white flex items-center gap-2'>contact me
                    <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
                </a>
                <a href="/sample.pdf" download
                    className='px-10 py-3 border rounded-full border-gray-500 flex
                        items-center gap-2'>my resume
                    <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
                </a>
            </div>
        </div >
    )
}

export default Header