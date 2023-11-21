//const http = require("node:http");        // импор по умлчанию из  nodejs ипортируем модуль http
import http from "node:http";
import fs from "node:fs/promises";                       // для считывания файлов


const PORT = 4024;  // порт можно занять любой не только 8080

http
      .createServer(async(req, res) => { // создаем сервер, req-запрос от клиента
            
            const data = await fs.readFile('comedians.json', 'utf-8');  // дожидаемся когда  файл comedians.json считается  и получаемм data, дока есть https://nodejs.org/dist/latest-v20.x/docs/api/fs.html#promises-api
            
            if(req.method === "GET" && req.url === '/comedians'){   // если url = http://localhost:4024/comedians
                  try{
                        res.writeHead(200, {          // устанавливаес заголовк и статус ответа
                              "Content-Type": "text/json; charset=utf-8",   // ответ в формате json
                              "Access-Control-Allow-Origin": "*"   //  здесь  указываем адрес того сайта кому разрешено отсылать запросы на сервер, *- занчи раешеаем всем
                        }); 

                        res.end(data);  // отправка ответ(data) на запрос клиента
                  }
                  catch(error){

                        res.writeHead(500,{
                              "Content-Type": "text/plain; charset=utf-8", 
                        });
                            
                        res.end(`Ошбика сервера ${error}`);
                  }
      }
      else{
            res.writeHead(404, {
                  "Content-Type": "text/plain; charset=utf-8", 
            }); 
            res.end('Page Not found');
          }
      })  
      .listen(PORT)      // запускаем сервер на прослушивание



console.log(`сервер запущен на http://localhost:${PORT}`)