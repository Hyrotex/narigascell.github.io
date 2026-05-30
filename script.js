// Base de dados de produtos
const produtos = [
    {
        id: 1,
        nome: 'iPhone 15 Pro',
        marca: 'Apple',
        preco: 4999,
        descricao: 'Smartphone flagship com A17 Pro',
        emoji: '📱'
    },
    {
        id: 2,
        nome: 'Samsung Galaxy S24',
        marca: 'Samsung',
        preco: 3999,
        descricao: 'Câmera avançada com IA',
        emoji: '📱'
    },
    {
        id: 3,
        nome: 'Motorola Edge 50',
        marca: 'Motorola',
        preco: 2499,
        descricao: 'Tela AMOLED 144Hz',
        emoji: '📱'
    },
    {
        id: 4,
        nome: 'Xiaomi 14 Ultra',
        marca: 'Xiaomi',
        preco: 2299,
        descricao: 'Processador Snapdragon 8 Gen 3',
        emoji: '📱'
    },
    {
        id: 5,
        nome: 'iPhone 15',
        marca: 'Apple',
        preco: 3299,
        descricao: 'Versão padrão com A16 Bionic',
        emoji: '📱'
    },
    {
        id: 6,
        nome: 'Samsung Galaxy A15',
        marca: 'Samsung',
        preco: 1299,
        descricao: 'Celular acessível e confiável',
        emoji: '📱'
    },
    {
        id: 7,
        nome: 'Motorola G54',
        marca: 'Motorola',
        preco: 1799,
        descricao: 'Bateria de 5000mAh',
        emoji: '📱'
    },
    {
        id: 8,
        nome: 'Xiaomi Redmi Note 13',
        marca: 'Xiaomi',
        preco: 1399,
        descricao: 'Câmera 108MP',
        emoji: '📱'
    }
];

// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    atualizarCarrinho();
});

// Renderizar produtos
function renderizarProdutos() {
    const grid = document.getElementById('produtos-grid');
    const produtosFiltrados = aplicarFiltros();
    
    if (produtosFiltrados.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Nenhum produto encontrado</p>';
        return;
    }

    grid.innerHTML = produtosFiltrados.map(produto => `
        <div class="produto-card">
            <div class="produto-imagem">${produto.emoji}</div>
            <div class="produto-info">
                <div class="produto-marca">${produto.marca}</div>
                <div class="produto-nome">${produto.nome}</div>
                <div class="produto-descricao">${produto.descricao}</div>
                <div class="produto-preco">R$ ${produto.preco.toLocaleString('pt-BR')}</div>
                <button class="produto-btn" onclick="adicionarAoCarrinho(${produto.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

// Aplicar filtros
function aplicarFiltros() {
    const marca = document.getElementById('filtro-marca').value;
    const precoMax = parseInt(document.getElementById('filtro-preco').value);

    return produtos.filter(produto => {
        const marcaOk = !marca || produto.marca === marca;
        const precoOk = produto.preco <= precoMax;
        return marcaOk && precoOk;
    });
}

// Filtrar produtos
function filtrarProdutos() {
    const valor = document.getElementById('filtro-preco').value;
    document.getElementById('valor-preco').textContent = `R$ ${parseInt(valor).toLocaleString('pt-BR')}`;
    renderizarProdutos();
}

// Adicionar ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
    // Verificar se o produto já está no carrinho
    const itemCarrinho = carrinho.find(item => item.id === produtoId);
    
    if (itemCarrinho) {
        itemCarrinho.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

// Remover do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho();
    atualizarCarrinho();
    renderizarCarrinho();
}

// Atualizar carrinho
function atualizarCarrinho() {
    document.getElementById('carrinho-count').textContent = carrinho.length;
    calcularTotal();
}

// Renderizar items do carrinho
function renderizarCarrinho() {
    const container = document.getElementById('carrinho-items');
    
    if (carrinho.length === 0) {
        container.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio 🛒</div>';
        return;
    }

    container.innerHTML = carrinho.map(item => `
        <div class="carrinho-item">
            <div class="carrinho-item-info">
                <h4>${item.nome}</h4>
                <p style="color: #999;">Quantidade: ${item.quantidade}</p>
            </div>
            <div style="text-align: right;">
                <div class="carrinho-item-preco">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR')}</div>
                <button class="carrinho-item-remover" onclick="removerDoCarrinho(${item.id})">Remover</button>
            </div>
        </div>
    `).join('');
}

// Calcular total
function calcularTotal() {
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    document.getElementById('total-preco').textContent = `R$ ${total.toLocaleString('pt-BR')}`;
}

// Abrir carrinho
function abrirCarrinho() {
    document.getElementById('carrinho-modal').style.display = 'block';
    renderizarCarrinho();
}

// Fechar carrinho
function fecharCarrinho() {
    document.getElementById('carrinho-modal').style.display = 'none';
}

// Finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    alert(`Compra finalizada! Total: R$ ${total.toLocaleString('pt-BR')}\n\nObrigado por comprar na NarigasCell! 🎉`);
    
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharCarrinho();
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 2000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Adicionar evento de clique no botão do carrinho
document.addEventListener('DOMContentLoaded', () => {
    const botaoCarrinho = document.querySelector('.carrinho-btn');
    if (botaoCarrinho) {
        botaoCarrinho.addEventListener('click', (e) => {
            e.preventDefault();
            abrirCarrinho();
        });
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('carrinho-modal');
        if (event.target === modal) {
            fecharCarrinho();
        }
    });
});
