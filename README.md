# Módulo 1 — Auth + Hierarquia (Proprietário → Líder → Funcionário)

## O que já funciona
- Login por e-mail/senha
- Primeiro acesso com `menezesapptec@gmail.com` vira proprietário automaticamente
- Proprietário cadastra líderes de setor
- Líder cadastra funcionários (herdam o setor do líder automaticamente)
- Tabela em tempo real de quem está cadastrado
- PWA instalável (manifest + service worker)

## Passo a passo pra colocar no ar

### 1. Criar o projeto Firebase
1. https://console.firebase.google.com → criar projeto novo
2. Ativar **Authentication** → método Email/Senha
3. Ativar **Firestore Database** (modo produção)
4. Em Configurações do projeto → Seus apps → Web, copiar o config e colar em `firebase-config.js`

### 2. Criar o primeiro usuário (você, proprietário)
No Firebase Console → Authentication → Add user:
- E-mail: `menezesapptec@gmail.com`
- Senha: defina uma

Não precisa criar o documento no Firestore manualmente — o app cria sozinho no primeiro login, porque reconhece esse e-mail como dono.

### 3. Publicar as regras do Firestore
Console → Firestore → Regras → colar o conteúdo de `firestore.rules` → publicar.

### 4. Gerar a chave do Admin SDK (pra função de cadastro funcionar)
1. Configurações do projeto → Contas de serviço → **Gerar nova chave privada** (baixa um JSON)
2. Desse JSON você vai precisar de 3 valores pras variáveis de ambiente na Vercel:
   - `FIREBASE_PROJECT_ID` → campo `project_id`
   - `FIREBASE_CLIENT_EMAIL` → campo `client_email`
   - `FIREBASE_PRIVATE_KEY` → campo `private_key` (cole com as quebras de linha `\n` mesmo, o código já trata isso)

### 5. Deploy na Vercel
1. Sobe esse projeto pro GitHub (do jeito que você já faz)
2. Importa na Vercel
3. Em Settings → Environment Variables, adiciona as 3 variáveis do passo 4
4. Deploy

### 6. Testar
1. Acessa o link, loga com `menezesapptec@gmail.com`
2. Cadastra um líder de teste (ex: setor Estrutural)
3. Desloga, loga com o e-mail do líder
4. Cadastra um funcionário — ele já nasce vinculado ao setor Estrutural automaticamente

## Próximo módulo
Estoque + Movimentações (é a base que Financeiro, Trato e Ordens de Serviço vão consumir).
