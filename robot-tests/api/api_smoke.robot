*** Settings ***
Documentation    Smoke da API do cinema (health, movies, reservas).
Resource         ../resources/keywords_api.resource
Suite Setup      Configurar ambiente de testes

*** Test Cases ***
Health deve responder 200
    ${resp}=    GET deve 200    /health

Listar filmes deve responder 200 e lista
    ${resp}=    GET deve 200    /movies
    Should Be True    ${resp.json()} != None

Admin consegue acessar reservas (200)
    ${token}=   Login admin e pegar token
    ${resp}=    GET auth deve 200    /reservations    ${token}
