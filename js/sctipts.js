/*!
* Start: Custom scripts for Wedding Site (Multi-Page and Custom Menu)
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ===========================================
    // 1. AOS (アニメーション) の初期化
    // ===========================================
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }

    // ===========================================
    // 2. ハンバーガーメニューの開閉処理とスクロールロック (セクション1と7を統合)
    // ===========================================
    const nav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.menu-toggle');

    if (navToggle && nav) {
        // メニュー開閉時の処理
        const toggleMenu = () => {
            const isVisible = nav.getAttribute('data-visible') === 'true';
            const newVisibility = !isVisible;

            nav.setAttribute('data-visible', newVisibility);
            navToggle.setAttribute('aria-expanded', newVisibility);

            // メニューが開いたときは背景のスクロールを固定
            document.body.style.overflow = newVisibility ? 'hidden' : 'auto';
        };

        navToggle.addEventListener('click', toggleMenu);

        // リンクをクリックしたらメニューを閉じる
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.getAttribute('data-visible') === 'true') {
                    // クローズ処理を呼び出し
                    toggleMenu(); 
                }
            });
        });
    }

    // ===========================================
    // 3. スムーズスクロール (ページ内リンク用)
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const targetId = anchor.getAttribute('href');
        
        // 外部ページへのリンクではないか、かつターゲット要素が存在するかチェック
        if (targetId.length > 1 && document.querySelector(targetId)) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    });

    // ===========================================
    // 4. TOPへ戻るボタンの表示/非表示制御 (新規追加)
    // ===========================================
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        const toggleBackToTop = () => {
            // スクロール量が100pxを超えたらボタンを表示
            if (window.scrollY > 100) {
                backToTop.classList.remove('d-none'); // CSSの .d-none を削除して表示
            } else {
                backToTop.classList.add('d-none'); // CSSの .d-none を追加して非表示
            }
        };

        // ロード時とスクロール時に実行
        window.addEventListener('scroll', toggleBackToTop);
        window.addEventListener('load', toggleBackToTop);
    }


    // ===========================================
    // 5. カウントダウンタイマー機能 (index.htmlのみ実行)
    // ===========================================
    function startCountdown() {
        // 🚨 ここを結婚式の日時 (JST) に置き換えてください 🚨
        const weddingDate = new Date("November 22, 2026 15:00:00").getTime(); // 例: 2026年11月22日 15時
        const countdownElement = document.getElementById("timer-display");

        if (!countdownElement) return; // index.html以外では実行しない

        const updateTimer = setInterval(function() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            // 計算
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 表示を更新
            countdownElement.innerHTML = 
                `<span class="timer-unit">${days}</span><span class="timer-label">日</span>` +
                `<span class="timer-unit">${hours}</span><span class="timer-label">時間</span>` +
                `<span class="timer-unit">${minutes}</span><span class="timer-label">分</span>` +
                `<span class="timer-unit">${seconds}</span><span class="timer-label">秒</span>`;

            // 終了
            if (distance < 0) {
                clearInterval(updateTimer);
                countdownElement.parentElement.innerHTML = "🎉 The Day Has Come! Thank you! 🎉";
            }
        }, 1000);
    }

    startCountdown(); // タイマーを開始

});

/* End: Custom scripts for Wedding Site */