import header_bg_color from './image/header-bg-color.png'
import myIcon from './image/my-icon.png'
import logo from './image/logo.png'
import logoDark from './image/logo-dark.png'
import contactArrow from './image/contact-arrow.svg'
import moonIcon from './image/moon-icon.png'
import menuIcon from './image/menu-icon.svg'
import closeIcon from './image/close-icon.svg'
import profile from './image/profile.png'
import codeIcon from './image/code-icon.svg'
import codeIconDark from './image/code-icon-dark.svg'
import rightArrow from './image/right-arrow.png'
import rightArrowWhite from './image/right-arrow-white.png'
import rightArrowBold from './image/right-arrow-bold.png'
import projectIcon from './image/project-icon.svg'
import projectIconDark from './image/project-icon-dark.svg'
import sendIcon from './image/send-icon.png'
import vscode from './image/vscode.png'
import figma from './image/figma.png'
import git from './image/git.png'
import mailIcon from './image/mail-icon.png'

export const assets = {
    header_bg_color,
    myIcon,
    logo,
    logoDark,
    contactArrow,
    moonIcon,
    menuIcon,
    closeIcon,
    profile,
    codeIcon,
    rightArrow,
    rightArrowBold,
    rightArrowWhite,
    codeIconDark,
    projectIcon,
    projectIconDark,
    sendIcon,
    vscode,
    figma,
    git,
    mailIcon
}

interface InfoList {
    icon: string;
    iconDark: string;
    title: string;
    description: string;
}
export const infoList: InfoList[] = [
    {
        icon: assets.codeIcon,
        iconDark: assets.codeIconDark,
        title: 'Language',
        description: 'HTML, CSS, JavaScript, TypeScript, React, Node.js',
    },
    {
        icon: assets.projectIcon,
        iconDark: assets.projectIconDark,
        title: 'Projects',
        description: 'I have worked on several projects, including web applications and mobile apps.',
    }
]

export const serviceData = [
    {
        icon: assets.codeIcon,
        title: 'Web Development',
        description: 'Building responsive and interactive websites.',
        link: '#',
    },
    {
        icon: assets.projectIcon,
        title: 'Mobile Development',
        description: 'Creating mobile applications for iOS and Android.',
        link: '#',
    },
    {
        icon: assets.codeIcon,
        title: 'Backend Development',
        description: 'Developing server-side applications and APIs.',
        link: '#',
    },
    {
        icon: assets.projectIcon,
        title: 'UI/UX Design',
        description: 'Designing user-friendly interfaces and experiences.',
        link: '#',
    }
]

export const workData = [
    {
        title: 'Frontend project',
        description: 'Mobile App',
        bgImage: '/work-1.png',
    },
    {
        title: 'Backend project',
        description: 'Web App',
        bgImage: '/work-2.png',
    },
    {
        title: 'UI/UX project',
        description: 'Web App',
        bgImage: '/work-3.png',
    },
    {
        title: 'Fullstack project',
        description: 'Web App',
        bgImage: '/work-4.png',
    }
]

export const toolsData = [
    assets.vscode,
    assets.figma,
    assets.git
]