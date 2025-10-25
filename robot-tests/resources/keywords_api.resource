*** Settings ***
Library    RequestsLibrary
Resource   variables.resource

*** Keywords ***
Abrir sessão API
    Create Session    api    ${BASE_API}    disable_warnings=1

Login admin e pegar token
    [Arguments]    ${email}=${ADMIN_EMAIL}    ${password}=${ADMIN_PASS}
    ${payload}=    Create Dictionary    email=${email}    password=${password}
    ${resp}=       POST On Session    api    /auth/login    json=${payload}
    Should Be Equal As Integers    ${resp.status_code}    200
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
