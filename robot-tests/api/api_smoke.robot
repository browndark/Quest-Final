*** Settings ***
Documentation    Smoke da API do cinema (health, movies, reservas).
Resource         ../resources/keywords_api.resource
Suite Setup      Abrir sessão API

*** Test Cases ***
Health deve responder 200
    ${resp}=    GET deve 200    /health

Listar filmes deve responder 200 e lista
    ${resp}=    GET deve 200    /movies
    Should Be True    ${resp.json()} != None

Admin consegue acessar reservas (200)
    # Ensure test users exist (safe to call multiple times)
    ${resp_setup}=    POST On Session    api    /setup/test-users
    Should Be True    ${resp_setup.status_code} in [200, 201]

    ${token}=   Login admin e pegar token
    ${resp}=    GET auth deve 200    /reservations    ${token}
