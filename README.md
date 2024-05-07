# MAIB

# Инструкция по запуску проекта

## Предварительные требования
Для запуска проекта необходимо иметь установленными следующие инструменты:
- SQL Server
- .NET SDK
- Node.js с npm

## 1. Установка и настройка MSSQL

### Установка SQL Server
Установите SQL Server и SSMS

## 2. Сборка и запуск .NET API

Необходимо перейти в директорию MAIB.API
После чего 

### Настройка строки подключения
Откройте файл `appsettings.json` в проекте API и убедитесь, что строка подключения к вашей базе данных указана правильно.
Если запускать локально нужно поменять Server=sql_server_demo,1433 на localhost,1433, то что сейчас стоит это запуск с Docker 
### Сборка и миграция базы данных
1. Откройте командную строку в корневой директории проекта API.
2. Выполните команды для восстановления зависимостей и сборки проекта:
   ```bash
   dotnet restore
   dotnet build
   dotnet run 
   ```
3. Миграция происходит runtime
## 3. Сборка и запуск UI

Необходимо перейти в MAIB.App
### Сборка UI
1. Откройте командную строку в корневой директории проекта App.
2. Выполните команды для установки зависимостей и сборки проекта:
   ```bash
   npm install
   npm start 
   ```

## Результат 

Локально в базе должна появиться база данных TodoDb с таблиец Tasks
По URL http://localhost:4200 должен открытся UI проекта 
По URL http://localhost:5150/swagger/index.html должен открытся API 

После чего можно проводить манипуляции 

## Запуск с помощью Docker 

Перед запуском необходимо выполнить 
docker network create my-net
### 1 Запустить базу MSSQL 

Установить базу 
docker pull mcr.microsoft.com/mssql/server:2019-latest
Запустить имедж
docker run -d --name sql_server_demo -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=reallyStrongPwd123' -p 1433:1433 --network my-net  mcr.microsoft.com/mssql/server:2019-latest 

Теперь необходимо поменять connctionString на Server=sql_server_demo,1433;Database=TodoDb;User Id=sa;Password=reallyStrongPwd123;
### 2 Запустить UI 

Перейти в директорию Maib.App
После чего выполнить 

docker build -t maib-app-app .
docker run -p 4200:4200 --network my-net maib-app-app

### З Запустить API 

Перейти в директорию Maib.API
После чего выполнить 

docker build -t maib-app-api .
docker run -e ASPNETCORE_ENVIRONMENT=Development -p 5150:8080 --network my-net maib-app-api

По URL http://localhost:4200 должен открытся UI проекта 
По URL http://localhost:5150/swagger/index.html должен открытся API 

После чего можно проводить манипуляции 

## Пример использования API с помощью curl 

curl -X 'GET' \
  'http://localhost:5150/api/Tasks?sortBy=createdon' \
  -H 'accept: */*'

Возвращает все таски сортированы по созданию изменяя createdon на modifiedon или priority сортировка произойдет по ним 

curl -X 'GET' \
  'http://localhost:5150/api/Tasks/2' \
  -H 'accept: text/plain'

Возвращает таск по ID 

curl -X 'POST' \
  'http://localhost:5150/api/Tasks' \
  -H 'accept: text/plain' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "Test 2",
  "description": "Test 2",
  "priority": 5,
  "status": "новая",
  "createdOn": "2024-05-07T08:24:21.169Z",
  "modifiedOn": "2024-05-07T08:24:21.170Z"
}'

Создает таск по исходя из переданных полей ID пппередавать не нужно он выставляется в зависимости от количества созданных элементов 

curl -X 'DELETE' \
  'http://localhost:5150/api/Tasks/4' \
  -H 'accept: */*' 

Удаляет таск по заданному ID 

curl -X 'PUT' \
  'http://localhost:5150/api/Tasks/2' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": 2,
  "title": "test test",
  "description": "test",
  "priority": 2,
  "status": "завершена",
  "modifiedOn": "2024-05-07T08:36:12.893Z"
}'

Изменяет таск по ID в зависимости от полей которые передали 

## Note
Я также добавил файлы для создания кластера и сервисов в AWS, но не могу их запустить так как сильно влетел по костам в AWS :(((
Но для реализации 
1) Необходимо затегировать контейнеры 
2) Необходимо запушить их на AWS ECS
3) Создать кластер с помощью команды eksctl create cluster -f cluster.yaml
4) Создать сервисы с помощью команд kubectl apply -f deployment.yaml && kubectl apply -f k8s-hpa.yaml && kubectl apply -f service.yaml