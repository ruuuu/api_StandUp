import { sendData, sendError } from "./send.js";


// получение спсика комедиантов
export const handleComediansRequest = async (req, res, comedians, segments) => {          // segments = ['comedians', 'id_comediant']

                        
      if(segments.length === 2){
            const comedian = comedians.find((item) => item.id === segments[1]);          // вернет {id, comedian, perfomances:[]}
                                          
            if(!comedian){
                  sendError(res, 400, 'Комик не найден')
                  return;  
            }

            sendData(res, comedian); 
            return;                             // выход из метода
      }
                              
      sendData(res, comedians);                  // отправка ответа клиенту
                  
      return;                                    // выход из метода

}