*** Settings ***
Library   Browser
Library   RequestsLibrary
Resource  variables.resource

*** Keywords ***
Abrir navegador
    New Browser    chromium    headless=True
    New Context    viewport={'width':1280,'height':800}
    New Page

Fechar navegador
    Close Browser

Wait For Frontend
    # Create a short-lived session to the frontend and poll / until we get 200
    Create Session    front    ${BASE_FRONT}    disable_warnings=True
    Wait Until Keyword Succeeds    30s    2s    Check Front Ready

Check Front Ready
    ${resp}=    Get Request    front    /
    Status Should Be    ${resp}    200

Ir para home
    Log    BASE_FRONT=${BASE_FRONT}
    # Ensure the frontend is responding before opening the page (avoids race conditions)
    Wait For Frontend
    # Use explicit IP to avoid localhost resolving to IPv6 (::1)
    Go To    http://127.0.0.1:3002
    Wait For Elements State    css:body    visible    10s

Setup Suite UI
    # Wait for the frontend to be ready before opening browser (helps avoid race conditions)
    Wait For Frontend
    Abrir navegador
