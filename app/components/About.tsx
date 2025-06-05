import { assets, skillsData, toolsData } from '@/assets/assets'
import React from 'react'
import Image from 'next/image'

const About = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div id='about' className='w-full px-[12%] py-10
        scroll-mt-20'>
            <h4 className='text-center mb-2 text-lg font-Ovo'>Introduction</h4>
            <h2 className='text-center text-5xl font-Ovo'>About me</h2>

            <div className='flex w-full flex-col lg:flex-row items-center gap-20 my-20'>
                <div className='w-64 sm:w-80 rounded-3xl max-w-none'>
                    <Image src={assets.profile} alt="Profile" className='w-full rounded-3xl' />
                </div>
                <div className='flex-1'>
                    <p>I am a frontend engineer with two years of professional experience.<br />
                        Despite my relatively short career, I have been involved in projects where I handled everything
                        from planning and design to development.<br />
                        I have also gained experience as a team leader in engineering teams.<br />
                        I constantly strive to deliver value from both user perspective and engineering standpoint,
                        while contributing to the overall productivity and quality improvement of the team.
                    </p>

                    <ul className='flex flex-wrap items-center gap-3 sm:gap-2 my-6'>
                        {skillsData.map((skill, index) => (
                            <li key={index} className='inline-flex items-center gap-2
                            px-3 py-1 rounded-full text-gray-700 dark:text-white/80 dark:border dark:border-white/20'
                                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }}>
                                <Image src={isDarkMode ? skill.iconDark : skill.icon} alt={skill.name} className='w-5 h-5' width={20} height={20} />
                                <span className='font-semibold'>{skill.name}</span>
                            </li>
                        ))}
                    </ul>


                    <h4 className='my-6 text-gray-700 font-Ovo dark:text-white/80'>Tools I use</h4>
                    <ul className='flex items-center gap-3 sm:gap-5'>
                        {toolsData.map((tool, index) => (
                            <li key={index} className='flex items-center justify-center
                            w-12 sm:w-14 aspect-square border border-grey-400
                            rounded-lg cursor-pointer hover:translate-y-1
                            duration-500'>
                                <Image src={isDarkMode ? tool.iconDark : tool.icon} alt='Tool' className='w-5 sm:w-7' width={20} height={20} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div >
    )
}

export default About