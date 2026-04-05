# 🏰 Kingdom Creation Page - Design & Layout

## 📋 Especificações Aprovadas

### 1️⃣ Estrutura em 3 Linhas (3x3 Grid)

```
┌─────────────────────────────────────────────────────────────┐
│          LINHA 1: NOME DO REINO (FULL-WIDTH)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  "Nome do Reino"      [Input de texto]               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           LINHA 2: CONTEÚDO PRINCIPAL (3 COLUNAS)           │
│ ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│ │ CULTURAS │  │              │  │  DESCRIÇÃO DA CULTURA │  │
│ │          │  │   ARTE CARD  │  │                       │  │
│ │ • Baduran│  │              │  │  [Texto da raça]      │  │
│ │ • Drow   │  │  (500x700px) │  │                       │  │
│ │ • Aig... │  │              │  │                       │  │
│ │ • Björske│  │              │  │                       │  │
│ │ • Polkin │  │              │  │                       │  │
│ │ • Gulth..│  │              │  │                       │  │
│ │ • P.Leste│  │              │  │                       │  │
│ │ • Aluriel│  │              │  │                       │  │
│ └──────────┘  └──────────────┘  └───────────────────────┘  │
│  30-35%          ~33%                ~33-35%                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│      LINHA 3: BOTÃO CRIAR REINO (FULL-WIDTH)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           🏰 FUNDAR REINO                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2️⃣ Dimensões & Espaçamento

| Elemento | Dimensão | Notas |
|----------|----------|-------|
| **Container Principal** | 100vh (viewport) | Sem scroll vertical |
| **Sidebar (Culturas)** | 30-35% de largura | Larga e acessível |
| **Imagem** | 500x700px | Grande, focal |
| **Descrição** | ~33-35% de largura | Flex para ocupar espaço |
| **Botão** | 100% abaixo do grid | Full-width em rodapé |

### 3️⃣ Cores por Cultura

Cada cultura terá uma **cor highlight pastel/suave** que afeta:
- Borda/texto quando selecionada
- Cor do nome em maiúscula
- Cor de fundo suave do card de descrição
- Cor do botão quando ativa

```javascript
CULTURES = [
  { id: 'baduran', name: 'Baduran', color: '#A67C52', desc: '...' },      // Marrom suave
  { id: 'drow', name: 'Drow', color: '#6B5B5B', desc: '...' },            // Cinza escuro
  { id: 'aiglanos', name: 'Aiglanos', color: '#D4AF37', desc: '...' },    // Dourado
  { id: 'björske', name: 'Björske', color: '#8CB5D0', desc: '...' },      // Azul pastel
  { id: 'polkinea', name: 'Polkinea', color: '#B8D87F', desc: '...' },    // Verde pastel
  { id: 'gulthrak', name: 'Gulthrak', color: '#A0522D', desc: '...' },    // Marrom terra
  { id: 'p_leste', name: 'P. Leste', color: '#E08B7D', desc: '...' },     // Coral pastel
  { id: 'aluriel', name: 'Aluriel', color: '#A989BE', desc: '...' },      // Roxo pastel
]
```

### 4️⃣ Responsividade Mobile

**BREAKPOINTS:**
- `xs` (0-600px): Mobile phone
- `sm` (600-960px): Small tablet  
- `md` (960px+): Desktop

**MOBILE LAYOUT (xs):**
```
┌─────────────────────────────────────────────────┐
│  NOME DO REINO                                  │
│  [Input]                                        │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  CULTURAS (ABAS HORIZONTAIS - SCROLL H)         │
│  [Baduran][Drow][Aiglanos][Björske]..→          │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  IMAGEM (Full-width)                            │
│                                                 │
│       [Cultura selecionada - 100% w]           │
│                                                 │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  DESCRIÇÃO DA CULTURA                           │
│  [Texto da raça - Full-width]                   │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  [Botão FUNDAR REINO - Full-w com 1rem margin] │
└─────────────────────────────────────────────────┘
```

**TABLET (sm):**
Mantém layout mobile, aumenta espaçamento.

**DESKTOP (md):**
Usa layout 3 colunas conforme especificado acima.

### 5️⃣ Estados Interativos

#### Input do Nome:
- Label acima: **"Nome do Reino"** (uppercase)
- Placeholder: "Ex: Reino da Esperança"
- Borda padrão: #8B6F47
- Borda ao focar: muda da cor da cultura selecionada

#### Sidebar - Seleção de Cultura:
- **Visual**: Apenas borda colorida + texto em DOURADO quando selecionada
- Borda padrão: #555 (cinza)
- Borda ao selecionar: cor da cultura (pastel)
- Texto: #999 (padrão) → #D4A574 (selecionada)

#### Descrição da Cultura:
- Font size: **0.9rem** (reduzida para caber melhor)
- Se texto muito longo: adaptar font-size dinamicamente (não truncar)
- Fundo suave: cor da cultura com 10% de opacidade
- Box padding: 2.5
- Scroll interno se necessário (overflow: auto)

#### Botão "Fundar Reino":
- Desktop: Full-width - 2rem (margem dos lados)
- Mobile: Full-width - 1rem (margem reduzida)
- Cor de fundo: Gradiente baseado na cor da cultura
- Estado disabled: cinza #555, texto #999

### 6️⃣ Estados de Interação (Não Selecionado vs Selecionado)

**SEM CULTURA SELECIONADA:**
```
Imagem: "Selecione uma cultura" (texto cinza)
Descrição: placeholder "Selecione uma cultura na esquerda"
Botão: DESABILITADO (cinza)
```

**COM CULTURA SELECIONADA:**
```
Imagem: Mostra a arte (500x700px, bordered)
Nome: COR_CULTURA (uppercase bold)
Descrição: Texto real com fundo colorido suave
Botão: ATIVO (gradiente da cor)
```

### 6️⃣ Viewport Constraint

```css
height: 100vh
overflow: hidden  /* Linha 2 pode ter overflow: auto internamente */
```

A linha 2 (culturas + imagem + descrição) pode ter scroll interno, mas o container geral não scrolls.

---

## 📝 Validação de Requisitos

✅ **APROVADOS:**
- [x] Layout 3x3: Linha1 (nome) | Linha2 (culturas/imagem/descrição) | Linha3 (botão)
- [x] Sidebar: 30-35% de largura, larga e acessível
- [x] Imagem: 500x700px, grande e focal
- [x] Input: Label + placeholder
- [x] Descrição: Font reduzido, borda colorida
- [x] Seleção: Apenas borda colorida + texto dourado
- [x] Mobile: Abas horizontais + stack vertical
- [x] Button: Full-width com margens
- [x] Cores: Pastel/suaves
- [x] Height: 100vh (sem scroll vertical externo)

---

## 🚀 Próxima Etapa

Implementar todo o **KingdomCreationPage.jsx** com este novo design completo!

### Estrutura que será criada:

1. **LINHA 1 (Nome do Reino)**
   - TextField com label "Nome do Reino"
   - Borda dinâmica baseada na cor da cultura

2. **LINHA 2 (3 Colunas - Grid)**
   - **Coluna 1**: Sidebar com botões de culturas (cores pastel)
   - **Coluna 2**: Imagem 500x700px da cultura
   - **Coluna 3**: Descrição em card colorido

3. **LINHA 3 (Botão)**
   - Button full-width com gradiente da cor da cultura
   - Desabilitado se não tiver cultura/nome selecionados

4. **RESPONSIVIDADE**
   - Mobile: Abas horizontais + stack vertical
   - Tablet: Similar ao mobile
   - Desktop: 3 colunas conforme acima