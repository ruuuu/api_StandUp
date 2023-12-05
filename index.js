//const http = require("node:http");        // импор по умлчанию из  nodejs ипортируем модуль http
import http from "node:http";
import fs from "node:fs/promises";                       // модуль для считывания файлов
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientstdRequest } from "./modules/handleClientstdRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";


const PORT = 4024;  // порт можно занять любой не только 8080
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';






const startServer = async () => {

      if(!(await checkFile(COMEDIANS))){
            return;                       // выход из метода
      }


      await checkFile(CLIENTS, true);     // если файл не существует, то он будет создан
      
      const comediansData = await fs.readFile(COMEDIANS, "utf-8");                     // дожидаемся когда  файл comedians.json считается  и получаемм data, дока есть https://nodejs.org/dist/latest-v20.x/docs/api/fs.html#promises-api
      // comediansData = [{id, comedian, perfomances}, {}]
                                    
      const comedians = JSON.parse(comediansData); 


      http
            .createServer(async (req, res) => {        // создаем сервер, req-запрос от клиента, res-ответ сервера
                  
                  try{
                        res.setHeader("Access-Control-Allow-Origin", "*");   // какиее сайты могут отсылать запросы серверу
                        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");  // какик запросы ожидает сервер                               //  укащзываем загловк чтобы отпарвлять POST/PATCH запросы, 2-ым параметром указываем адрес того сайта кому разрешено отсылать запросы на сервер, *- значит разрешаем всем
                        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                        if(req.method === 'OPTIONS'){
                              res.writeHead(204);
                              res.end();
                              return;
                        }

                        //const reqURL = new URL(req.url, `http://${req.headers.host}`);                 // создаем урл, получаем  /comedians
                                                         
                        const segments = req.url.split("/").filter(Boolean);                  // разделяет строку req.url  и получаем  массив  строк ['', 'comedians', '11'], после filter(Boolean) станет ['comedians', '11']
                        

                        if(req.method === "GET" && segments[0] === "comedians"){                   // если url = http://localhost:4024/comedians
                              handleComediansRequest(req, res, comedians, segments);
                              return;                                                                 // выход из метода
                        }
                  

                        if(req.method === "POST" && segments[0] === 'clients'){  
                              // POST /clients  Добавление клиента
                              handleAddClient(req, res);
                              return;
                        }


                        if(req.method === "GET" && segments[0] === 'clients' && segments.length === 2){
                              // GET /clients/:ticket    Получение клиента по номеру билета
                              const ticketNumber = segments[1];  
                              console.log('ticket in inedex.js ',ticketNumber)                                     // segments = ['clients', 'ticketNumber']
                              handleClientstdRequest(req, res, ticketNumber);
                              return;
                        }


                        if(req.method === "PATCH" && segments[0] === 'clients' && segments.length === 2){
                              // PATCH  /clients/:ticket   Редаткрование клиента по номеру билета
                              const ticketNumber = segments[1];  
                              handleUpdateClient(req, res, ticketNumber);
                              return;
                        }
  
                  }catch(error){

                        sendError(res, 404, 'Не найдено');
            }
      })  
      .listen(PORT)      // запускаем сервер на прослушивание запросов клиента


      console.log(`сервер запущен на http://localhost:${PORT}`)
};



startServer();
