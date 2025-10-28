*** Settings ***
Library    RequestsLibrary
Resource   variables.resource

*** Keywords ***
Abrir sessão API
    Create Session    api    ${BASE_API}    disable_warnings=1

Configurar ambiente de testes
    [Documentation]    Abre sessão API e garante que usuários de teste existem
    Abrir sessão API
    # Tenta criar usuários de teste (retorna 200 se já existem)
    ${payload}=    Create Dictionary    email=${ADMIN_EMAIL}    password=${ADMIN_PASS}
    ${resp}=       Run Keyword And Ignore Error    POST On Session    api    /setup/test-users
    Log    Setup test users: ${resp}

Login admin e pegar token
    [Documentation]    Faz login com credenciais admin e retorna token JWT
    [Arguments]    ${email}=${ADMIN_EMAIL}    ${password}=${ADMIN_PASS}
    ${payload}=    Create Dictionary    email=${email}    password=${password}
    ${resp}=       POST On Session    api    /auth/login    json=${payload}    expected_status=any
    Log    Login response: ${resp.status_code} - ${resp.text}
    Should Be Equal As Integers    ${resp.status_code}    200    msg=Login falhou. Verifique se o MongoDB está rodando e se 'npm run seed' foi executado. Credenciais: ${email}
    ${token}=      Set Variable    ${resp.json()['token']}
    RETURN         ${token}

GET deve 200
    [Arguments]    ${path}
    ${resp}=       GET On Session    api    ${path}
    Should Be Equal As Integers    ${resp.status_code}    200
    RETURN         ${resp}

GET auth deve 200
    [Arguments]    ${path}    ${token}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${resp}=       GET On Session    api    ${path}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    RETURN         ${resp}
