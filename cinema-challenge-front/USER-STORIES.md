# Histórias de Usuário do Cinema App

## Introdução
Este documento contém histórias de usuário principais para a aplicação Cinema App, focando nas funcionalidades implementadas para teste de QA.

## Papéis de Usuário
- **Visitante**: Usuário não autenticado
- **Usuário**: Usuário regular autenticado
- **Administrador**: Usuário com privilégios administrativos

## Histórias de Autenticação

### US-AUTH-001: Registro de Usuário
**Como** visitante  
**Eu quero** registrar uma nova conta  
**Para que** eu possa reservar ingressos de cinema  

**Critérios de Aceitação:**
- Usuário pode inserir nome, e-mail e senha
- Sistema valida o formato do e-mail e senha
- Sistema impede registros de e-mails duplicados
- Após o registro bem-sucedido, o usuário é redirecionado para a página de login, autenticado

### US-AUTH-002: Login de Usuário
**Como** usuário registrado  
**Eu quero** fazer login na minha conta  
**Para que** eu possa acessar recursos personalizados  

**Critérios de Aceitação:**
- Usuário pode inserir e-mail e senha
- Sistema autentica credenciais válidas
- Sistema mantém sessão do usuário através de token JWT
- Usuário é redirecionado para a página inicial após login bem-sucedido

### US-AUTH-003: Logout de Usuário
**Como** usuário logado  
**Eu quero** sair da minha conta  
**Para que** minha sessão seja encerrada  

**Critérios de Aceitação:**
- Usuário pode fazer logout através do menu de navegação
- Após o logout, rotas protegidas não são mais acessíveis
- Token JWT é removido do localStorage

### US-AUTH-004: Visualizar e Gerenciar Perfil do Usuário
**Como** usuário logado  
**Eu quero** visualizar e atualizar minhas informações de perfil  
**Para que** eu possa manter meus dados atualizados  

**Critérios de Aceitação:**
- Perfil exibe nome do usuário, e-mail e função da conta
- Usuário pode editar seu nome completo
- Sistema indica visualmente os campos que foram alterados
- Sistema confirma sucesso após salvar alterações
- Interface exibe mensagem de confirmação após atualização bem-sucedida
- Página de perfil é separada da página de reservas para melhor organização

## Histórias de Gerenciamento de Filmes

### US-HOME-001: Página Inicial Atrativa
**Como** usuário (visitante ou autenticado)  
**Eu quero** ter uma visão geral e atrativa da aplicação ao entrar na página inicial  
**Para que** eu possa navegar facilmente e entender os serviços oferecidos  

**Critérios de Aceitação:**
- Página inicial exibe banner com informações sobre o cinema
- Exibe uma seção destacada de "Filmes em Cartaz" com pôsteres em tamanho adequado
- Layout responsivo que se adapta a diferentes tamanhos de tela
- Links rápidos para principais áreas da aplicação
- Acesso fácil à navegação principal através do cabeçalho
- Usuários autenticados veem opções personalizadas no menu

### US-MOVIE-001: Navegar na Lista de Filmes
**Como** usuário (visitante ou autenticado)  
**Eu quero** navegar pelos filmes disponíveis  
**Para que** eu possa descobrir filmes para assistir  

**Critérios de Aceitação:**
- Usuário pode visualizar uma lista dos filmes em exibição com layout em grid
- Filmes são exibidos com pôster grande e de alta qualidade
- Cards de filmes mostram título, classificação e gêneros
- Cards incluem duração do filme e data de lançamento
- Sistema adapta o layout para diferentes tamanhos de tela (responsivo)
- Usuário consegue acessar detalhes do filme com um clique

### US-MOVIE-002: Visualizar Detalhes do Filme
**Como** usuário (visitante ou autenticado)  
**Eu quero** visualizar informações detalhadas sobre um filme  
**Para que** eu possa decidir se quero assisti-lo  

**Critérios de Aceitação:**
- Detalhes incluem sinopse, elenco, diretor, data de lançamento, duração
- Página de detalhes mostra pôster do filme
- Página exibe horários de sessões disponíveis
- Usuário pode navegar para a reserva a partir dos horários disponíveis

## Histórias de Gerenciamento de Sessões

### US-SESSION-001: Visualizar Horários de Sessões
**Como** usuário (visitante ou autenticado)  
**Eu quero** visualizar horários para um filme específico  
**Para que** eu possa planejar quando assisti-lo  

**Critérios de Aceitação:**
- Usuário pode ver horários disponíveis para um filme selecionado
- Horários exibem data, hora, teatro e disponibilidade
- Usuário pode navegar para a seleção de assentos de um horário

## Histórias de Reserva

### US-RESERVE-001: Selecionar Assentos para Reserva
**Como** usuário logado  
**Eu quero** selecionar assentos para uma sessão de filme  
**Para que** eu possa reservar minha localização preferida  

**Critérios de Aceitação:**
- Usuário pode visualizar o layout de assentos do teatro
- Assentos são codificados por cores conforme disponibilidade
- Usuário pode selecionar múltiplos assentos disponíveis
- Usuário não pode selecionar assentos já reservados
- Sistema mostra o subtotal à medida que os assentos são selecionados

### US-RESERVE-002: Processo de Checkout
**Como** usuário logado  
**Eu quero** finalizar o processo de compra dos ingressos  
**Para que** eu possa garantir minha reserva  

**Critérios de Aceitação:**
- Usuário é redirecionado para a página de checkout após selecionar os assentos
- Página de checkout exibe resumo dos assentos selecionados
- Usuário pode visualizar o valor total da compra
- Usuário pode selecionar um método de pagamento (cartão de crédito, débito, PIX, transferência)
- Sistema processa o pagamento (simulado) e confirma a reserva
- Usuário recebe confirmação visual do sucesso da reserva
- Assentos selecionados são marcados como ocupados

### US-RESERVE-003: Visualizar Minhas Reservas
**Como** usuário logado  
**Eu quero** visualizar meu histórico de reservas  
**Para que** eu possa verificar minhas reservas  

**Critérios de Aceitação:**
- Usuário pode acessar lista de suas reservas através do link "Minhas Reservas" no menu
- Reservas são exibidas em formato de card com informações visuais claras
- Cada reserva exibe filme, data, horário, cinema, assentos, status e método de pagamento
- Usuário pode visualizar o pôster do filme associado à reserva
- Sistema exibe indicadores visuais de status da reserva (confirmada, pendente, cancelada)
- Usuário pode acessar página dedicada de reservas separada das informações de perfil

## Histórias de Experiência do Usuário

### US-NAV-001: Navegação Intuitiva
**Como** usuário da aplicação  
**Eu quero** navegar facilmente entre as diferentes seções do site  
**Para que** eu possa encontrar rapidamente as informações e funcionalidades que preciso  

**Critérios de Aceitação:**
- Cabeçalho está presente em todas as páginas com links para áreas principais
- Menu é responsivo e se adapta a diferentes tamanhos de tela (versão móvel)
- Usuário logado tem acesso à seções personalizadas como "Minhas Reservas" e "Perfil"
- Breadcrumbs ou elementos de navegação indicam o caminho atual do usuário
- Links diretos para retornar à página anterior quando apropriado
- Feedback visual indica a página atual no menu de navegação

---
