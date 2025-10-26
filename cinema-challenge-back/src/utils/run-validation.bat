@echo off
echo Executando validacao da API do Cinema App...
echo.

node scripts/validate-api.js

if %errorlevel% equ 0 (
  echo.
  echo Validacao concluida com sucesso!
  exit /b 0
) else (
  echo.
  echo Falha na validacao da API. Verifique os erros acima.
  exit /b 1
)
