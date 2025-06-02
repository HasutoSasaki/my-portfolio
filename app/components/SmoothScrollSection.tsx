'use client'

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// クライアントサイドでGSAPプラグインを登録
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const smootherRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // スムーズスクロールの初期化
        const smoother = ScrollSmoother.create({
            wrapper: smootherRef.current,
            content: contentRef.current,
            smooth: 1.5, // スクロールの滑らかさ（値が大きいほどぬるっとする）
            effects: true, // data-speed属性などを有効にする
            normalizeScroll: true, // タッチデバイスでも動作を統一
            smoothTouch: 0.1, // タッチデバイス用の設定（0で無効、小さい値でよりスムーズに）
        });

        return () => {
            // クリーンアップ
            smoother.kill();
        };
    }, []);

    return (
        <div ref={smootherRef} id="smooth-wrapper">
            <div ref={contentRef} id="smooth-content">
                {children}
            </div>
        </div>
    );
}