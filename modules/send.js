

export const sendData = (res, data) => {  // отправка ответа клиенту

      res.writeHead(200, {                                        // устанавливаес заголовк и статус ответа
            "Content-Type": "text/json; charset=utf-8",           // ответ в формате json
      }); 

      res.end(JSON.stringify(data));                      // отправка ответа клиенту
};



export const sendError = (res, statusCode, errorMessage) => {
      
      res.writeHead(statusCode, {
            "Content-Type": "text/plain; charset=utf-8", 
      }); 

      res.end(errorMessage);
}