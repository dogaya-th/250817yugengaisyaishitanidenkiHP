document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.header__nav-list a, .footer__nav-list a');
    const serviceNavLinks = document.querySelectorAll('.service-nav__link');
    
    // ハンバーガーメニュー
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.setAttribute('aria-label', !isExpanded ? 'メニューを閉じる' : 'メニューを開く');
        });
    }
    
    // アンカーリンクのスムーズスクロール
    const handleAnchorClick = function(e) {
        const href = this.getAttribute('href');
        
        if (href && href.includes('#')) {
            const hashIndex = href.indexOf('#');
            const path = href.substring(0, hashIndex);
            const hash = href.substring(hashIndex);
            
            if (path === '' || path === window.location.pathname || path === window.location.pathname.split('/').pop()) {
                if (hash !== '#') {
                    e.preventDefault();
                    
                    // メニューを閉じる
                    if (menuToggle && nav) {
                        menuToggle.classList.remove('active');
                        nav.classList.remove('active');
                    }
                    
                    const targetId = hash.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header ? header.offsetHeight : 70;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }
    };
    
    // ナビゲーションリンクにスムーズスクロールを適用
    navLinks.forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });
    
    serviceNavLinks.forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });
    
    // ヘッダーのスクロール効果
    let lastScrollTop = 0;
    let scrollTimer;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        
        scrollTimer = setTimeout(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
            }
            
            lastScrollTop = scrollTop;
        }, 10);
    });
    
    // IntersectionObserver でサービスナビの現在地表示（services.htmlページのみ）
    if (serviceNavLinks.length > 0 && window.location.pathname.includes('services.html')) {
        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetId = entry.target.id;
                const correspondingNavLink = document.querySelector(`.service-nav__link[data-target="${targetId}"]`);
                
                if (correspondingNavLink) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        // 全てのactiveクラスを削除
                        serviceNavLinks.forEach(link => link.classList.remove('active'));
                        // 現在のセクションのリンクにactiveクラスを追加
                        correspondingNavLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -60% 0px',
            threshold: [0, 0.3, 0.7, 1]
        });
        
        // サービス詳細セクションを監視
        const serviceDetailSections = document.querySelectorAll('.service-detail');
        serviceDetailSections.forEach(section => {
            serviceObserver.observe(section);
        });
    }
    
    // カードアニメーション用IntersectionObserver
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });
    
    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.service-card, .service-catalog-card, .strength-card, .company-digest__text, .company-digest__info, .service-detail__content');
    animateElements.forEach(element => {
        cardObserver.observe(element);
    });
    
    // 電話リンクの処理（PC環境での対応）
    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    telLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // モバイル環境でない場合は電話番号を表示
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                e.preventDefault();
                const phoneNumber = this.textContent.replace(/[^0-9-]/g, '');
                alert('電話番号: ' + phoneNumber);
            }
        });
    });
    
    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (menuToggle && nav) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        }
    });
    
    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            nav.classList.remove('active');
        }
    });
    
    // パフォーマンス改善: Intersection Observerの重複を避ける
    if (window.IntersectionObserver) {
        // ページのパフォーマンス監視
        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 必要に応じて遅延読み込みやアニメーションの処理
                    entry.target.style.visibility = 'visible';
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // 画像や重要でない要素の遅延表示
        const lazyElements = document.querySelectorAll('.service-detail__image');
        lazyElements.forEach(element => {
            element.style.visibility = 'hidden';
            performanceObserver.observe(element);
        });
    }
    
    // 年度の自動更新
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer__copyright');
    if (copyrightElement) {
        copyrightElement.innerHTML = `&copy; ${currentYear} 有限会社石谷電機 All Rights Reserved.`;
    }
    
    // デバッグ用（本番環境では削除）
    if (process && process.env && process.env.NODE_ENV !== 'production') {
        console.log('石谷電機HPスクリプト読み込み完了');
        console.log('IntersectionObserver対応:', 'IntersectionObserver' in window);
        console.log('サービスナビリンク数:', serviceNavLinks.length);
    }
    
    // フォームバリデーション（将来の拡張用）
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // フォームバリデーションロジック
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('必須項目を入力してください。');
            }
        });
    });
});

// CSS-in-JSでアニメーション定義
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .error {
        border: 2px solid #DC2626 !important;
        background-color: #FEF2F2 !important;
    }
    
    .fade-in-delay {
        animation: fadeIn 0.8s ease-out 0.2s both;
    }
`;
document.head.appendChild(style);