import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

interface UseDraggableLogoProps {
    logoRef: RefObject<HTMLImageElement | null>;
    isDarkMode: boolean;
}

export const useDraggableLogo = ({ logoRef, isDarkMode }: UseDraggableLogoProps) => {
    useEffect(() => {
        if (!logoRef.current) return;

        gsap.registerPlugin(Draggable);
        const logo = logoRef.current;

        gsap.set(logo, { x: 0, y: 0 });

        const createParticles = (x: number, y: number) => {
            const colors = ['#61DAFB', '#3178C6', '#F59E0B', '#10B981'];

            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${gsap.utils.random(colors)};
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    z-index: 1000;
                `;
                document.body.appendChild(particle);

                gsap.to(particle, {
                    x: gsap.utils.random(-60, 60),
                    y: gsap.utils.random(-60, 20),
                    opacity: 0,
                    scale: 0,
                    duration: 1.5,
                    ease: "power2.out",
                    onComplete: () => particle.remove()
                });
            }
        };

        const draggableInstance = Draggable.create(logo, {
            type: "x,y",
            inertia: true,
            bounds: {
                top: -window.innerHeight / 2,
                left: -window.innerWidth / 2,
                width: window.innerWidth,
                height: window.innerHeight
            },
            onDragStart: function () {
                gsap.to(logo, {
                    scale: 1.1,
                    rotation: gsap.utils.random(-10, 10),
                    duration: 0.2,
                    ease: "back.out"
                });
                logo.style.cursor = 'grabbing';
                logo.style.zIndex = '1000';
            },
            onDrag: function () {
                if (Math.random() < 0.2) {
                    const rect = logo.getBoundingClientRect();
                    createParticles(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2
                    );
                }
            },
            onDragEnd: function () {
                const dragDistance = Math.sqrt(this.x * this.x + this.y * this.y);

                if (dragDistance > 50) {
                    // 大きく動かした場合 - パーティクル爆発
                    const rect = logo.getBoundingClientRect();
                    createParticles(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2
                    );
                }

                // back to original position
                gsap.to(logo, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: dragDistance > 50 ? 1 : 0.5,
                    ease: dragDistance > 50 ? "elastic.out(1, 0.3)" : "back.out",
                });

                logo.style.cursor = 'grab';
                logo.style.zIndex = 'auto';
            }
        })[0];

        logo.style.cursor = 'grab';

        // cleanup function
        return () => {
            if (draggableInstance) {
                draggableInstance.kill();
            }
            gsap.set(logo, { clearProps: "all" });
            logo.style.cursor = '';
            logo.style.zIndex = '';
        };

    }, [logoRef, isDarkMode]);
};