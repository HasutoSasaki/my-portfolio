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
        // 元のプロフィール画像は最初から非表示
        gsap.set(profileImageRef.current, {
            opacity: 0
        });

        // パーティクルエフェクト - 周りから集まって画像を形成
        if (particlesRef.current) {
            const particles = particlesRef.current.querySelectorAll('.particle');

            particles.forEach((particle, index) => {
                const randomAngle = (Math.random() - 0.5) * 2 * Math.PI;
                const randomDistance = 150 + Math.random() * 200;
                const randomRotation = (Math.random() - 0.5) * 360;
                const randomDelay = index * 0.005;

                // 初期状態：散らばった位置に配置
                gsap.set(particle, {
                    x: randomDistance * Math.cos(randomAngle),
                    y: randomDistance * Math.sin(randomAngle),
                    rotation: randomRotation,
                    opacity: 0,
                    scale: 0.3,
                });

                // アニメーション：元の位置に集まる
                gsap.to(particle, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    delay: randomDelay,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: parentRef.current,
                        start: 'center 80%',
                        end: 'center 45%',
                        scrub: 0.8,
                    }
                });
            });

            // パーティクル完成後、元の画像をフェードインしながらパーティクルをフェードアウト
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: parentRef.current,
                    start: 'center 50%', // パーティクル完了直後
                    end: 'center 20%', // 短い距離で切り替え
                    scrub: 0.5,
                }
            });

            // 元画像のフェードインとパーティクルのフェードアウトを同時実行
            tl.to(profileImageRef.current, {
                opacity: 1,
                duration: 0.3,
            }, 0)
                .to(particlesRef.current, {
                    opacity: 0,
                    duration: 0.3,
                }, 0);
        }
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
