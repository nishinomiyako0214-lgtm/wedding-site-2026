/*!
* Start: Custom scripts for Wedding Site
*/

window.addEventListener('DOMContentLoaded', event => {

    // 1. スムーズスクロールの機能
    // スムーズスクロールを有効にするアンカーリンクをすべて選択
    const smoothScroll = function (target) {
        document.querySelector(target).scrollIntoView({
            behavior: 'smooth'
        });
    };

    // 'nav-link' クラスを持つすべてのリンクに対してイベントを設定
    document.querySelectorAll('.nav-link').forEach(anchor => {
        // hrefが '#' または '#page-top' ではないリンク（セクションリンク）のみを対象とする
        if (anchor.href.includes('#') && anchor.hash.length > 1) {
             anchor.addEventListener('click', function (e) {
                // デフォルトのアンカーリンク動作をキャンセル
                e.preventDefault();
                
                // スムーズスクロールを実行
                smoothScroll(this.hash);
                
                // リンクをクリックしたらナビゲーションメニューを閉じる (スマホ用)
                const navbarCollapse = document.getElementById('navbarResponsive');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        }
    });


    // 2. ナビゲーションバーのスタイル変更（スクロール時）
    const navbar = document.body.querySelector('#mainNav');
    
    // スタイルを変更するスクロール位置の閾値
    const scrollThreshold = 100;

    const navbarShrink = function () {
        if (!navbar) {
            return;
        }
        
        // スクロール量が閾値を超えたら 'navbar-shrink' クラスを追加
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('navbar-shrink')
        } else {
            navbar.classList.remove('navbar-shrink')
        }

    };

    // 初回ロード時に実行
    navbarShrink();

    // スクロールイベントが発生するたびに実行
    document.addEventListener('scroll', navbarShrink);

});