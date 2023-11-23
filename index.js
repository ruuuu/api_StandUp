//const http = require("node:http");        // импор по умлчанию из  nodejs ипортируем модуль http
import http from "node:http";
import fs from "node:fs/promises";                       // для считывания файлов


const PORT = 4024;  // порт можно занять любой не только 8080
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';



// проверка наличия файлов:
const checkFiles = async () => { 
      try{
            await fs.access(COMEDIANS);  // если есть доступ к файлу  COMEDIANS
      } catch(error){
            console.error(`Файл ${COMEDIANS} не найден`);
            return false;
      }

     
      try{
            await fs.access(CLIENTS);  
      } catch(error){
            await fs.writeFile(CLIENTS,  JSON.stringify([]));   //   в файл CLIENTS записываем массив в виде строки
            console.log(`Файл ${CLIENTS} был создан`);
            return false;
      }


      return true;
};



const sendData = (res, data) => {

      res.writeHead(200, {                                        // устанавливаес заголовк и статус ответа
            "Content-Type": "text/json; charset=utf-8",           // ответ в формате json
            "Access-Control-Allow-Origin": "*",
      }); 

      res.end(data);                      // отправка ответа клиенту
};



const sendError = (res, statusCode, errorMessage) => {
      
      res.writeHead(statusCode, {
            "Content-Type": "text/plain; charset=utf-8", 
      }); 

      res.end(errorMessage);
}



const startServer = async () => {

      if(!(await checkFiles())){
            return;                       // дальше код выполняться не будет
      }


      http
            .createServer(async(req, res) => {        // создаем сервер, req-запрос от клиента, res-ответ сервера
                  
                  try{
                        // req.setHeader("Access-Control-Allow-Origin", "*");                                  //  здесь  указываем адрес того сайта кому разрешено отсылать запросы на сервер, *- занчи раешеаем всем
                  
                        //const reqURL = new URL(req.url, `http://${req.headers.host}`);                 // создаем урл
                        //console.log('req.url  ', req.url)                                             //  /comedians

                        const segments = req.url.split("/").filter(Boolean);                  // разделяет строку  и получаем  массив  строк ['', 'comedians', '11']
                  

                        if(req.method === "GET" && segments[0] === "comedians"){                   // если url = http://localhost:4024/comedians
                        
                                    const data = await fs.readFile(COMEDIANS, "utf-8");                     // дожидаемся когда  файл comedians.json считается  и получаемм data, дока есть https://nodejs.org/dist/latest-v20.x/docs/api/fs.html#promises-api
                                    // data = [{id, comedian, perfomances}, {}]
                                    
                                    if(segments.length === 2){
                                          const comedian = JSON.parse(data).find((item) => item.id === segments[1]);          // вернет {id, comedian, perfomances}
                                          
                                          if(!comedian){
                                                sendError(res, 400, 'Комик не найден')
                                                return;
                                          }

                                          sendData(res, JSON.stringify(comedian)); 
                                          return;
                                    }
                              
                                    sendData(res, data); 
                                          
                                    return;      
                        }
                  

                        if(req.method === "POST" && segments[0] == 'clients'){
                        // POST /clients  Добавление клиента
                        }


                        if(req.method === "GET" && segments[0] == 'clients' && segments.length === 2){
                              // GET /clients/:ticket    Получение клиента по номеру билета


                        }


                        if(req.method === "PATCH" && segments[0] == 'clients' && segments.length === 2){
                              // PATCH  /clients/:ticket   Редаткрование клиента по номеру билета


                        }
  
                  }catch(error){

                        sendError(res, 404, 'Не найдено');
            }
      })  
      .listen(PORT)      // запускаем сервер на прослушивание


      console.log(`сервер запущен на http://localhost:${PORT}`)
};



startServer();
