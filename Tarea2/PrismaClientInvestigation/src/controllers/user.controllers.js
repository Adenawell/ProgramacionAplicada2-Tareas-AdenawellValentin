import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



// findMany — listar registros, incluyendo uso de where, orderBy, skip y take
// Trae una lista de registros y permite filtrar (where), ordenar (orderBy) y paginar (skip y take) para no traer toda la base de datos de golpe.
const usuarios = await prisma.user.findMany({
  where: { edad: 20 },
  orderBy: { nombre: 'asc' },
  skip: 0, take: 5
})

//findUnique y findFirst — diferencias entre ambos y cuando usar cada uno
//findUnique busca directo por un campo único como el ID, mientras que findFirst trae el primero que encuentre usando cualquier condicion que le pasemos.
const unico = await prisma.user.findUnique({ where: { id: 1 } })
const primero = await prisma.user.findFirst({ where: { nombre: 'Juan' } })

//create — crear un registro simple y crear con relaciones anidadas
//Crea un registro nuevo y de paso nos deja crear datos en otra tabla relacionada al mismo tiempo en la misma consulta.
await prisma.user.create({
  data: {
    nombre: 'AnthonyBarrera', correo: 'anthonybarreraGuaranas@gmail.com',
    posts: { create: { titulo: 'Samsung > Google Pixel Lamentablemente' } }
  }
})

//createMany — crear multiples registros a la vez
//Inserta varios registros de un solo golpe pasandole un arreglo, lo cual es muchisimo más rapido que hacerlo uno por uno.
await prisma.user.createMany({
  data: [{ nombre: 'Luis', correo: 'fabio@gmail.com' }, { nombre: 'Stormy', correo: 'stormy@gmail.com' }]
})

//update y updateMany — actualizar uno o varios registros
// update modifica un solo registro buscandolo por su ID y updateMany cambia varios a la vez que cumplan con la condicion que pongamos.
await prisma.user.update({ where: { id: 1 }, data: { edad: 21 } })
await prisma.user.updateMany({ where: { edad: 20 }, data: { edad: 21 } })

//upsert — que es y cuándo conviene usarlo sobre create o update
//Intenta actualizar un registro, pero si no lo encuentra lo crea automaticamente y conviene usarlo para ahorrarnos validaciones en el codigo.
await prisma.user.upsert({
  where: { correo: 'x@x.com' },
  update: { edad: 25 },
  create: { nombre: 'Max', correo: 'x@x.com', edad: 25 }
})

//delete y deleteMany — eliminar registros con condiciones
//delete borra un solo registro buscando por su ID o campo único y deleteMany borra todos los que coincidan con el filtro.
await prisma.user.delete({ where: { id: 2 } })
await prisma.user.deleteMany({ where: { edad: 18 } })

//count — contar registros con y sin filtros
//Solo nos devuelve el numero total de registros que hay, ya sea de toda la tabla completa o filtrando con un where.
const total = await prisma.user.count({ where: { edad: 20 } })

//aggregate — calcular _sum, _avg, _min, _max
//Hace calculos matematicos directo en la base de datos como sumar valores o sacar el promedio de una columna.
const calculos = await prisma.user.aggregate({ _avg: { edad: true } })

//groupBy — agrupar resultados por campo
//Agrupa los registros que tengan el mismo valor en un campo en especifico para poder sacar totales por cada grupo.
const grupos = await prisma.user.groupBy({ by: ['edad'], _count: true })

//Filtros avanzados — contains, startsWith, endsWith, in, notIn, gt, gte, lt, lte
// Son un conjunto de operadores extras para el where como contains para buscar si un texto incluye algo, o gt y lte para comparar numeros.
await prisma.user.findMany({
  where: { nombre: { contains: 'Juan pablo' }, edad: { gt: 18 } }
})

//Relaciones — include para traer datos relacionados y select para elegir campos especificos
// include trae tambien los datos de la tabla relacionada y select sirve para pedir solo columnas especificas y no cargar de mas.
const conPost = await prisma.user.findFirst({ include: { posts: true } })
const soloNombre = await prisma.user.findFirst({ select: { nombre: true } })

//Transacciones — prisma.$transaction para ejecutar múltiples operaciones atómicas
// Ejecuta varias consultas juntas de forma segura porque si una sola falla se cancelan todas las demas para no dejar informacion a media.
await prisma.$transaction([
  prisma.user.create({ data: { nombre: 'AdenawellElMejor', correo: 'ade@mejor.com' } }),
  prisma.post.create({ data: { titulo: 'Aviso', userId: 1 } })
])



