@echo off

rem Pergunta ao usuário se deseja construir a imagem Docker
set /p build_option=Buildar a imagem Docker? (s/n): 
set image=lucasfogliarini/bora:latest
set containerName=Bora
echo.

rem Verifica a escolha do usuário
if /i "%build_option%"=="s" (
    echo Buildando a imagem Docker... 'docker build -t %image% .'
    docker build -t %image% .
    echo.
)
echo Iniciando o conteiner Docker...
docker stop %containerName%
docker rm %containerName%
docker run -d --name %containerName% -p 8080:80 %image%

echo.
echo Conteiner Docker %containerName% iniciado! (image: %image%)
echo.

pause
