*** Variables ***
# Backend (configured to run on port 3000 in this workspace)
${BASE_API}      http://localhost:3000/api/v1
# Frontend (Vite default port 3002). Use 127.0.0.1 to avoid IPv6 (::1) resolution issues.
${BASE_FRONT}    http://127.0.0.1:3002
${ADMIN_EMAIL}   admin@example.com
${ADMIN_PASS}    admin123
