req (Request) y res (Response)

¿Qué información contiene cada uno?

req (Request): Contiene absolutamente todo lo que el cliente nos mandó en su solicitud. Aquí viene la URL que solicitó, el método que usó ya sea GET , POST o etc, y los datos o formularios que haya enviado.

res (Response): Contiene las herramientas que el servidor utiliza para contestarle. se usa para construir y enviarle la respuesta final, ya sea devolviéndole un archivo JSON, un texto o mandándole un código de estado como un 200 o un 404.

¿Cuándo usas req.params vs req.query vs req.body?


req.params: Lo usamos cuando el dato es una parte obligatoria de la ruta de la URL y nos sirve para identificar un recurso muy específico. Un ejemplo que pudiera dar es en /estudiantes/Adenawell/0647, ese numero al final es el parámetro para buscar a ese estudiante en particular.

req.query: Lo usamos para datos extras u opcionales que van al final de la URL lo que va despues del signo de interrogacion. Vi se usa mucho para filtrar, ordenar o hacer busquedas. 

req.body: Lo usamos cuando la información es más grande y no debe ir visible en la URL.

Fuente : https://keepcoding.io/blog/que-significa-el-req-query-en-express-js/