import { sendError,sendData } from "./send.js";
import { CLIENTS } from "../index.js";
import fs from "node:fs/promises"; 



 
// PATCH  /clients/:ticket   Редаткрование клиента по номеру билета
export const handleUpdateClient = async(req, res, ticketNumber) => {

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
                  
                  //console.log('body ', body);                      // это то, что клиент отправляет: {"fullName":"Ru Ivanova",  "phone":"89765456",  "ticketNumber":"895"}
                  const updateClient = JSON.parse(body);                // {fullName, phone, ticketNumber, booking: [{}]}
                 // console.log('updateClient ', updateClient)
                 
                  if(!updateClient.fullName || !updateClient.phone ||  ! updateClient.ticketNumber || !updateClient.booking){
                        sendError(res, 400, 'Неверные основные данные');
                        return;
                  }


      
                  if(updateClient.booking && (!updateClient.booking.length || !Array.isArray(updateClient.booking) || !updateClient.booking.every((item) => item.comedian && item.time))){
                        sendError(res, 400, 'отсутсвует список бронирования');
                        return;
                  }


                  const clientsData = await fs.readFile(CLIENTS, "utf-8");                // запишем в clientsData содержимое файла CLIENTS
                  const clients = JSON.parse(clientsData);                                    // [{fullName, phone, ticketNumber},{},{}]
                  
                  const clientIndex = clients.findIndex((item) => {                             // вернет индекс того элмнта котрый удовлетворяет условию
                        return (item.ticketNumber === ticketNumber);
                  });
                 
                  console.log('client object for /clients/:ticket',  clientIndex);
      
                  if(clientIndex === -1){ // если такого элемнта нет
                        sendError(res, 400, 'клиент с данными не существует');
                        return;  // выход из метода
                  }

                  clients.splice(clientIndex, 1, updateClient);                 // удалили элеент с индексом clientIndex  из массива и вставили элемент updateClient
                  // либо вместо splice сделать  так:
                  // clients[clientIndex] = {...clients[clientIndex], ...updateClient };

                  await fs.writeFile(CLIENTS, JSON.stringify(clients));                   // в файле будет [ {"fullName":"Ru Ivanova", "phone":"89765456", "ticketNumber":"895"} ]
      
                  sendData(res, updateClient);            // сервер посылает ответ клиенту
      
            });  

           

            
};
      




