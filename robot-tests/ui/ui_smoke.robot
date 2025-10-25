*** Settings ***
Documentation    Smoke do Front: abre home e verifica elementos básicos.
Resource         ../resources/keywords_ui.resource
Suite Setup      Setup Suite UI
Suite Teardown   Fechar navegador

*** Test Cases ***
Home deve carregar
    Ir para home
    Get Title    # apenas força render
    # Ajuste o seletor abaixo para algo que exista na sua home:
    Wait For Elements State    css=h1,css=[data-testid="app-title"]    visible    10s

Navegação básica (exemplo) - Lista de filmes visível
    Ir para home
    # Se houver link / texto “Filmes”:
    # Click    text=Filmes
    # Wait For Elements State    css=[data-testid="movies-list"]    visible    10s
