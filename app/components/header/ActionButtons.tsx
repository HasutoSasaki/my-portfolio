'use client'

import Image from 'next/image'
import { assets } from '@/assets/assets'

export const ActionButtons = () => {
    return (
        <div className='flex flex-col sm:flex-row items-center gap-4 mt-4'>
            {/* <a href="#contact"
                className='px-10 py-3 border border-white rounded-full bg-black
                text-white flex items-center gap-2 dark:bg-transparent'>contact me
                <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
            </a> */}
            <a href="/resume.pdf" download
                className='px-10 py-3 border rounded-full border-gray-500 flex
                    items-center gap-2 bg-white dark:text-black'>my resume
                <Image src={assets.contactArrow} alt='Contact Arrow' className='w-4' />
            </a>
        </div>
    )
}