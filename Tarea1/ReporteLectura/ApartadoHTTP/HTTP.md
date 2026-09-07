1. ¿Qué es HTTP y cómo funciona? 

El HTTP (Protocolo de Transferencia de Hipertexto) es básicamente la base por asi decirlo de la comunicación en la web porque esto nos sirve para que podamos transferir documentos, como lo que son las páginas HTML , el funcionamiento de esto va de la mano con lo que es el modelo cliente-servidor que esto quiere decir que nuestro navegador cualquiera que usemos ya sea chrome , firefox, opera gx o incluso el mismo edge viene siendo el cliente donde este mismo abre una conexión con un servidor web para hacerle una petición y se queda a la espera de que este le devuelva una respuesta y algo que vi de este protocolo porque en si es un protocolo osea tiene un conjunto de reglas a seguir para el funcionamiento es que este es sin estado, basicamente el servidor no tiene memoria de las peticiones que le hicimos nosotros le hicimosantes y lo que hace que cada vez que nos comunicamos con él es como si fuera la primera vez.  

2. ¿Qué es un request y un response? 

¿Qué es un request y un response? Son las dos partes que van a cabo con el HTTP. El request es el mensaje que el cliente le manda al servidor para pedirle algo, como por ejemplo entrar a una página. El response seria la respuesta por parte del servidor ósea el mensaje que él manda de regreso, lo cual puede contener lo que pedimos o un aviso de que algo salió mal.

¿Qué viaja dentro de cada uno? 

Dentro del request viaja la instrucción de lo que queremos hacer aquí van dentro el método como GET para solicitar datos o POST para mandar información, la ruta de lo que estamos buscando y los encabezados que son lo que conocemos como headers, que le dan al servidor los detalles por así decirlo como, por ejemplo, el idioma que preferimos o desde qué navegador estamos entrando.



3. ¿Qué es GET, POST, PUT, DELETE y Cuándo se usa cada uno y por qué ? 

GET: Sirve para leer o solicitar información. Lo usamos cuando solo queremos consultar datos, como al entrar a una página o ver una lista de productos. 

POST: Sirve para enviar o crear información nueva. Se usa, por ejemplo, al enviar un formulario de registro o hacer una publicación, ya que manda los datos de forma segura en el cuerpo del mensaje para que el servidor los procese y guarde. 


PUT: Se utiliza para actualizar o modificar un dato que ya existe. Es el método que debemos de utilizar cuando necesitamos reemplazar la información completa de un registro, como al editar todos los datos de nuestro perfil de usuario. 

DELETE: Como su nombre lo indica sirve para eliminar un recurso del servidor. Se usa exclusivamente cuando queremos borrar definitivamente algo como un archivo. 


4. Códigos de estado HTTP

¿Qué significan los rangos 2xx, 4xx, 5xx?

200 OK (Exito): Es el código que confirma que la solicitud funcionó perfectamente osea es lo que indica que el servidor hizo lo que le pedimos sin ningún inconveniente.

301 Moved Permanently (Redirección): Este nos avisa que el archivo o la página que buscamos cambió de dirección de forma definitiva. osea, el recurso se cambio de lugar para siempre, y en la misma respuesta el servidor nos pasa la nueva dirección para que la usemos.

404 Not Found (Error del cliente): Es de los más famosos en internet porque casi siempre lo vemos cuando programamos paginas web le ha pasado a todp el mundo creo hahah y esto lo que quiere decir es que el servidor buscó por todas partes pero no pudo encontrar el contenido que le pedimos. El error viene de nuestra parte, casi siempre porque muchas veces escribimos mal el enlace o porque pedimos algo que borramos.

500 Internal Server Error (Error del servidor): Aquí nosotros hicimos la petición correctamente pero el servidor fue el que falló. Ocurre cuando el sistema del servidor se topa con un error interno o una situación que simplemente no sabe como resolver.




Explica al menos 5 códigos con ejemplos reales:
 

 
200 OK (Éxito) : Cuando entramos a moddle la página de la universidad, pongo mi usuario y me carga el inicio de mi perfil sin problemas; ahí el servidor me está devolviendo un 200 por detrás sin que yo lo vea indicando que todo salió bien.

201 Created (Creado): Cuando termino de llenar un formulario de registro en una página y le doy a el boton "Guardar". Si el sistema guarda mi usuario en la base de datos correctamente, me responde con un 201.

301 Moved Permanently (Redirección): Cuando intentamos entrar a un enlace viejo de una página web que cambió su nombre de dominio, y que el navegador te cambia la URL y te manda automáticamente a la página nueva.

404 Not Found (Error del cliente): Me paso una vez que en un código HTML puse la ruta de una imagen, pero escribi mal el nombre de la carpeta. Al recargar la página, me tiro el 404 porque el archivo ya no está ahí.

500 Internal Server Error (Error del servidor): Este esta facil de explicar por que lo explicare con el mismo campus oracle de la ucne y es que antes pasaba que muchos los estudiantes intentan seleccionar una materia en la plataforma de la universidad a las 11:59 p.m pero la página se satura, no aguanta a tanta gente conectada al mismo tiempo y se cae. Ahí la página nos tira un error 500 porque el sistema de oracle dejo de funcionar.

 

 FUENTE1: https://developer.mozilla.org/es/docs/Web/HTTP
 FUENTE2: https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status

