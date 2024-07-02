const header = document.querySelector("header");
window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 500);
});

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navlist.classList.toggle('open');
};

window.onscroll = () => {
	menu.classList.remove('bx-x');
	navlist.classList.remove('open');
};


        // Função para verificar qual seção está visível e aplicar a classe 'active' ao link correspondente
        document.addEventListener('scroll', function() {
            let sections = document.querySelectorAll('section');
            let navLinks = document.querySelectorAll('.navlist li a');

            sections.forEach(function(section) {
                let top = section.offsetTop - 50; // Ajuste de 50 pixels para margem superior
                let bottom = top + section.clientHeight;

                if (window.scrollY >= top && window.scrollY < bottom) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${section.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            // Verifica se está no topo da página para marcar HOME como ativo
            if (window.scrollY < sections[0].offsetTop) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#home`) {
                        link.classList.add('active');
                    }
                });
            }

            // Verifica se está no final da página para marcar CONTATO como ativo
            let lastSection = sections[sections.length - 1];
            let lastSectionTop = lastSection.offsetTop - 50; // Ajuste de 50 pixels para margem superior
            let lastSectionBottom = lastSectionTop + lastSection.clientHeight;
            let windowHeight = window.innerHeight;

            if (window.scrollY + windowHeight >= lastSectionBottom) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#contact`) {
                        link.classList.add('active');
                    }
                });
            }
        });