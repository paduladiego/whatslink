
// DOM Elements
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const generateBtn = document.getElementById('generateBtn');
const linkCard = document.getElementById('linkCard');
const generatedLinkInput = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const copyIcon = document.getElementById('copyIcon');
const checkIcon = document.getElementById('checkIcon');
const testLink = document.getElementById('testLink');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastDescription = document.getElementById('toastDescription');

// State
let currentLink = '';
let copyTimeout = null;

// Phone formatting function
function formatPhoneNumber(value) {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Formata para o padrão brasileiro
    if (numbers.length <= 2) {
        return numbers;
    } else if (numbers.length <= 7) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
}

// Phone input handler
phoneInput.addEventListener('input', function(e) {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
});

// Toast function
function showToast(title, description, variant = 'default') {
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Generate WhatsApp link
function generateWhatsAppLink() {
    const phoneNumbers = phoneInput.value.replace(/\D/g, '');
    const message = messageInput.value.trim();
    
    if (phoneNumbers.length < 10) {
        showToast(
            "Número inválido",
            "Por favor, insira um número de telefone válido.",
            "destructive"
        );
        return;
    }

    // Adiciona código do país se não tiver
    const fullPhone = phoneNumbers.startsWith('55') ? phoneNumbers : `55${phoneNumbers}`;
    const encodedMessage = message ? encodeURIComponent(message) : '';
    const whatsappURL = `https://wa.me/${fullPhone}${message ? `?text=${encodedMessage}` : ''}`;
    
    // Update UI
    currentLink = whatsappURL;
    generatedLinkInput.value = whatsappURL;
    testLink.href = whatsappURL;
    linkCard.classList.remove('hidden');
    
    // Reset copy button
    copyIcon.classList.remove('hidden');
    checkIcon.classList.add('hidden');
    
    showToast(
        "Link gerado com sucesso!",
        "Seu link do WhatsApp está pronto para ser usado."
    );
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(currentLink);
        
        // Update button icons
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        
        // Reset icons after 2 seconds
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
        copyTimeout = setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
        }, 2000);
        
        showToast(
            "Link copiado!",
            "O link foi copiado para sua área de transferência."
        );
    } catch (err) {
        showToast(
            "Erro ao copiar",
            "Não foi possível copiar o link.",
            "destructive"
        );
    }
}

// Event listeners
generateBtn.addEventListener('click', generateWhatsAppLink);
copyBtn.addEventListener('click', copyToClipboard);

// Enter key support
phoneInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateWhatsAppLink();
    }
});

messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateWhatsAppLink();
    }
});

// Hide toast on click
toast.addEventListener('click', function() {
    toast.classList.add('hidden');
});
