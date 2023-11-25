import fs from "node:fs/promises";  


// проверка наличия файла:
export const checkFile = async (path, createIfMissing) => { 

      if(createIfMissing){  // если файл не создан

            try{
                  await fs.access(path);   // если есть доступ к файлу  path
            } 
            catch(error){
                  console.log(error);
                  await fs.writeFile(path,  JSON.stringify([]));   //   в файл CLIENTS записываем массив в виде строки
                  console.log(`Файл ${path} был создан`);
                  return true;
            }
      }



      try{
            await fs.access(path);  
      } 
      catch(error){
            console.log(error);
            console.error(`Файл ${path} не найден`);
            return false;
      }

     
      return true;
};
