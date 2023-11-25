import { sendError,sendData } from "./send.js";
import { CLIENTS } from "../index.js";
import fs from "node:fs/promises"; 



 
// PATCH  /clients/:ticket   Редаткрование клиента по номеру билета

export const handleUpdateClient = async(req, res, ticketNumber) => {

      try{
            const clientsData = await fs.readFile(CLIENTS, "utf-8");                // запишем в clientsData содержимое файла CLIENTS
            const clients = JSON.parse(clientsData);                                    // [{fullName, phone, ticketNumber},{},{}]
            let ind = 0;


            const client = clients.find((item, index) => {
                  ind = index;
                  return (item.ticketNumber === ticketNumber);
            });
           
            console.log('client object for /clients/:ticket',  client);


            let body = "";                                                    // тело запроса, котрый отправляет клиент

            try{
                  req.on("data", (chunk) => {  // событие data, как тлоько оно наступит запустится коллбэк функция
                        body += chunk;
                  })
            }
            catch(error){
                  console.log(`Ошибка ${error} при чтении запроса`);
                  sendError(res, 500, "Ошибка сервера при чтении запрса")
            }



            req.on("end", async () => {   // при откравке запроса PACTH  отрабоатет коллбэк
                  console.log('body ', body);                      // это то, что клиент отправляет: {"fullName":"Ru Ivanova",  "phone":"89765456",  "ticketNumber":"895"}
                  const updateClient = JSON.parse(body);                // {fullName, phone, ticketNumber, booking: [{}]}
                  console.log('updateClient ', updateClient)
            
                  clients.splice(ind, 1, updateClient);                 // удалили элеент с индексом ind  из массива и вставили элемент updateClient

                  await fs.writeFile(CLIENTS, JSON.stringify(clients));                   // в файле будет [ {"fullName":"Ru Ivanova", "phone":"89765456", "ticketNumber":"895"} ]
      
                  sendData(res, updateClient);            // сервер посылает ответ клиенту
      
            });  
      }
      catch(error){
            console.error(`Ошибка при обработке запроса ${error}`);
            sendError(res, 500, 'Ошибпри при обработке запроска клиента');
      }




};