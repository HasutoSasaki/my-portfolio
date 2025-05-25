import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div className='mt-20'>
            <div className='text-center'>
                <Image src={assets.logo} alt='' className='w-36 mx-auto mb-2' />

                <div className='w-max flex items-center gap-2 mx-auto'>
                    <Image src={assets.mailIcon} alt='' className='w-6' />
                    hasuto.sa@gmail.com
                </div>
            </div>
        </div>
    )
}

export default Footer