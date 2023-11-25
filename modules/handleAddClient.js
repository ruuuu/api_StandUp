import fs from "node:fs/promises";   
import { sendData, sendError } from "./send.js";
import { CLIENTS } from "../index.js";



// POST /clients  Добавление клиента:

export const handleAddClient = (req, res) => {

      let body = "";  // тело запроса

      try{
            req.on("data", (chunk) => {  // сjбытие data, как тлоько оно наступит запустится коллбэк функция
                  body += chunk;
            })
      }
      catch(error){
            console.log(`Ошибка ${error} при чтении запроса`);
            sendError(res, 500, "Ошибка сервера при чтении запрса")
      }



      req.on("end", async () => {  // событие end(когда буфер очистился), при отправке данных клиентом,  запустится коллбэк функция
           
            try{
                  console.log('body ', body);                      // это то, что клиент отправляет: {"fullName":"Ru Ivanova",  "phone":"89765456",  "ticketNumber":"895"}
                  const newClient = JSON.parse(body);              // превращаем из строки в json(сервер отдает в ввиде json)
                 
                  if(!newClient.fullName || !newClient.phone ||  !newClient.ticketNumber || !newClient.booking){
                        sendError(res, 400, 'Неверные основные данные');
                        return;
                  }


                 
                  if(newClient.booking && (!newClient.booking.length || !Array.isArray(newClient.booking) || !newClient.booking.every((item) => item.comedian && item.time))){
                        sendError(res, 400, 'отсутсвует список бронирования');
                        return;
                  }
                 

                  const clientsData = await fs.readFile(CLIENTS, "utf-8");                // запишем в clientsData содержимое файла CLIENTS
                  const clients = JSON.parse(clientsData);
                  console.log('cliensts in handleAddClient ', clients)

                  clients.push(newClient);
                  await fs.writeFile(CLIENTS, JSON.stringify(clients));                   // в файле будет [{"fullName":"Ru Ivanova","phone":"89765456","ticketNumber":"895"}]

                  sendData(res, newClient);            // сервер посылает ответ клиенту
            }
            catch(error){
                  console.log(error);        
            }
      })
}