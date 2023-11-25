import { sendError,sendData } from "./send.js";
import { CLIENTS } from "../index.js";
import fs from "node:fs/promises"; 




// GET /clients/:ticket    Получение клиента по номеру билета
export const handleClientstdRequest = async(req, res, ticketNumber) => {
     
      console.log('ticketNumber ', ticketNumber)

      try{
            const clientsData = await fs.readFile(CLIENTS, "utf-8");                // запишем в clientsData содержимое файла CLIENTS
            const clients = JSON.parse(clientsData);                                    // [{fullName, phone, ticketNumber},{},{}]
           
            const client = clients.find((item) => {
                  return (item.ticketNumber === ticketNumber);
            });
           
           console.log('client object for /clients/:ticket',  client);

            if(!client){
                  sendError(res, '404', 'Клиент с таким номером билета не найден');   
                  return;
            }

            if(client){
                  sendData(res, client);   
            }
      
      }
      catch(error){
            console.error(`Ошибка при обработке запроса ${error}`);
            sendError(res, 500, 'Ошибпри при обработке запроска клиента');
            
      }

}