Middleware

¿Qué es y para qué sirve?

Por lo que estuve investigando un middleware es una función que se ejecuta en el medio del proceso un poco después de que el servidor recibe la petición del cliente, pero antes de devolver la respuesta. Esto nos sirve para interceptar esa solicitud y hacerle revisiones osea validaciones literalmente. Se usa mucho para cosas como verificar permisos, procesar archivos subidos o simplemente registrar en la consola qué rutas se están visitando.

¿Qué pasa si no se llama next()?
La instrucción next() es la que le dice a Express que ya termino la revision y pasa el turno a la siguiente función o ruta. Pero Si se nos olvida ponerla en el código, la petición se queda completamente atascada.El cliente se quedará cargando infinitamente esperando una respuesta que nunca va a llegar, porque el servidor se quedó parado en ese middleware.


Da un ejemplo de uso real: 

El ejemplo mas rapido que se me viene a la mente es el login de cualquier sistema , vamos a imaginarnos de que alguien intenta acceder a una ruta protegida, como /configuracion-cuenta. Antes de cargar esa pantalla, un middleware captura  la petición y revisa si el usuario tiene un token o una sesión activa. Si el usuario inicio sesion, el middleware dice lo deja pasar, ejecuta next() y lo deja pasar a ver su cuenta pero si no ha iniciado sesión, el middleware lo que haria es que pararia el proceso ahí mismo y le devuelve un error 401 (No autorizado), protegiendo el sistema sin tener que repetir ese código de seguridad en cada ruta.



fuente : https://expressjs.com/es/5x/guide/using-middleware/