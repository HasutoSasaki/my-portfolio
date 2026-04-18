'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

export const AboutProfileImage = ({ parentRef }: { parentRef: React.RefObject<HTMLDivElement> }) => {
    const profileImageRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!particlesRef.current) return;

        const particles = particlesRef.current.querySelectorAll<HTMLDivElement>('.particle');

        gsap.set(profileImageRef.current, { opacity: 0 });

        // Stash per-particle random starting offsets once so the tween can animate
        // every particle back to (0,0) through a single ScrollTrigger — replacing
        // 400 individual ScrollTrigger instances that recalculated on every scroll.
        particles.forEach((particle) => {
            const angle = (Math.random() - 0.5) * 2 * Math.PI;
            const distance = 150 + Math.random() * 200;
            gsap.set(particle, {
                x: distance * Math.cos(angle),
                y: distance * Math.sin(angle),
                rotation: (Math.random() - 0.5) * 360,
                opacity: 0,
                scale: 0.3,
                force3D: true,
                willChange: 'transform, opacity',
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: parentRef.current,
                start: 'center 80%',
                end: 'center 20%',
                scrub: 0.8,
            }
        });

        tl.to(particles, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
            stagger: { amount: 0.6, from: 'random' },
        }, 0)
            .to(profileImageRef.current, { opacity: 1, duration: 0.2 }, '>-0.2')
            .to(particlesRef.current, { opacity: 0, duration: 0.2 }, '<');
    }, [parentRef]);

    const generateParticles = () => {
        const particles = [];
        const gridSize = 20;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const left = (j / gridSize) * 100;
                const top = (i / gridSize) * 100;
                const size = 100 / gridSize;

                particles.push(
                    <div
                        key={`${i}-${j}`}
                        className="particle absolute overflow-hidden rounded-sm"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${size}%`,
                            height: `${size}%`,
                            backgroundImage: `url(${assets.profile.src})`,
                            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                            backgroundPosition: `-${left * gridSize}% -${top * gridSize}%`,
                        }}
                    />
                );
            }
        }
        return particles;
    };

    return (
        <div className="relative">
            <div ref={profileImageRef} className='w-64 sm:w-80 rounded-3xl max-w-none'>
                <Image src={assets.profile} alt="Profile" className='w-full rounded-3xl' />
            </div>

            <div
                ref={particlesRef}
                className="absolute top-0 left-0 w-64 sm:w-80 h-full rounded-3xl overflow-hidden pointer-events-none"
                style={{ aspectRatio: '1' }}
            >
                {generateParticles()}
            </div>
        </div>
    )
}
