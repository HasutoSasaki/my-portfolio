'use client'

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// クライアントサイドでGSAPプラグインを登録
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export const SmoothScrollSection = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const smootherRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // スムーズスクロールの初期化 - パフォーマンス最適化版
        const smoother = ScrollSmoother.create({
            wrapper: smootherRef.current,
            content: contentRef.current,
            smooth: 0.8, // より低い値でパフォーマンスを改善
            effects: false, // data-speed属性を無効化してパフォーマンス向上
            normalizeScroll: true, // タッチデバイスでも動作を統一
            smoothTouch: 0, // タッチデバイスでは無効化してパフォーマンス向上
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