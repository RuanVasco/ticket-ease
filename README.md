# 📌 Projeto - TicketEase

Este projeto tem como objetivo fornecer um sistema de gestão de chamados com chat em tempo real e controle de permissões.

---

## ✅ To-Do List

✔️ ~~Authorization com permissões e perfis (Modal gerenciável no admin).~~  
✔️ ~~Chat em tempo real via WebSocket.~~  
🔲 Dashboard na página de gerenciamento de tickets.  
🔲 Notificações em tempo real.  
🔲 Especificar permissões por categoria de ticket.  
🔲 Criar formulários dinâmicos.

---

## 🚀 Implementação

### 🔧 Configuração do Ambiente

1️⃣ **Crie um arquivo `.env.local` na pasta `/frontend/`**  
2️⃣ **Adicione as variáveis de ambiente** necessárias, como no exemplo abaixo:

```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
