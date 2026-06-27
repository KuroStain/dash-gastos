# Dash Gastos

Aplicación web local para registrar, revisar y analizar gastos personales.

El objetivo del proyecto es reemplazar un libro de gastos mantenido en Excel por una webapp simple, rápida y cómoda de usar. La aplicación estará enfocada en el registro manual de movimientos, generación de informes y control básico de saldos personales.

## Objetivo principal

Dash Gastos busca permitir el registro diario de gastos e ingresos personales, manteniendo una lógica simple similar a un libro de gastos, pero con mejor experiencia visual, filtros, reportes y persistencia local.

La aplicación debe funcionar localmente y no necesita un backend grande. Como máximo, se contempla una pequeña base de datos local para guardar registros, categorías, ingresos, gastos, saldos de referencia e información necesaria para reportes.

## Estructura inicial del proyecto

```txt
dash-gastos/
  frontend/
  README.md
```

La carpeta `frontend/` contiene la aplicación web basada en Next.js y en un template visual generado desde v0.

A futuro podrían agregarse carpetas adicionales si el proyecto lo requiere:

```txt
dash-gastos/
  frontend/
  backend/
  docs/
  docker-compose.yml
  README.md
```

## Descripción general de la aplicación

La aplicación tendrá cuatro áreas principales:

* Registrar gasto
* Registrar ingreso
* Informes
* Configuraciones

## Registrar gasto

Formulario principal para ingresar manualmente cada gasto realizado.

Campos visibles esperados:

* Nombre descriptivo del gasto
* Monto
* Checkbox para marcar si el gasto es reembolsable
* Nombre de la persona asociada al reembolso, visible solo si el gasto es reembolsable

Campos internos esperados:

* ID del gasto
* Fecha de creación
* Fecha de actualización
* Categoría
* Descripción limpia
* Descripción original
* Estado del gasto
* Estado del reembolso, si aplica

### Categoría rápida

La categoría rápida permite registrar gastos de forma ágil usando la primera palabra del nombre descriptivo como categoría.

Ejemplo:

```txt
Almuerzo McDonalds con amigos
```

Resultado esperado:

```txt
Categoría: Almuerzo
Descripción visible: McDonalds con amigos
Descripción original: Almuerzo McDonalds con amigos
```

La primera palabra del texto debe usarse como categoría solo si existe previamente como categoría rápida registrada en Configuraciones.

Esto evita que palabras accidentales se transformen en categorías no deseadas.

Ejemplo:

```txt
Pagué cuenta de la luz
```

Si `Pagué` no existe como categoría rápida, no debe asignarse automáticamente como categoría.

Para almacenar estos datos, internamente se debe realizar por separado. En el registro del gasto, debera ir el id de la categoria rapida que se encuentra almacenada en otra tabla. En caso de que la palabra no se encuentre dentro de las almacenadas, el campo quedara vacio y se almacenara la descripcion completa.

Ejemplo:

```txt
Almuerzo McDonalds con amigos
```

Resultado esperado:

```txt
Tabla Categorias Rapidas
ID    Nombre
10    Almuerzo

Tabla Gastos
ID    Descripcion             Categoria     ...
100   McDonalds con amigos    10
101   Piercing de titanio     NULL
```

El caso 100 representa un caso con categoria rapida registrada.
El caso 101 representa un caso sin categoria rapida registrada, donde se almacena en la descripcion el nombre completo y no se le asigna categoria. 

## Gasto reembolsable

Un gasto reembolsable representa dinero que sale de la cuenta o billetera del usuario, pero que debería volver posteriormente.

Casos de uso:

* El usuario paga una comida grupal y luego sus amigos le transfieren su parte.
* El usuario presta dinero a otra persona.
* El usuario compra entradas o productos para otras personas y espera recuperar esos montos.

Este concepto no debe tratarse como una categoría normal de gasto, ya que no representa un tipo de consumo. Debe tratarse como un estado o detalle adicional asociado al gasto.

Nombre recomendado en la interfaz:

```txt
Es reembolsable
```

Estados posibles:

```txt
Pendiente
Pagado parcialmente
Pagado
Cancelado
```

En una primera versión, un gasto reembolsable puede tener una sola persona asociada.

En una versión posterior, un mismo gasto podrá tener varios reembolsos asociados, por ejemplo cuando se compran entradas para varias personas.

Modelo conceptual futuro:

```txt
expenses
  id
  description
  original_description
  category_id
  amount
  is_reimbursable
  created_at
  updated_at

reimbursements
  id
  expense_id
  debtor_name
  amount
  status
  paid_at
  created_at
  updated_at
```

## Registrar ingreso

Formulario para registrar entradas de dinero.

Casos de uso:

* Sueldo
* Pegas pequeñas
* Ventas
* Transferencias recibidas
* Otros ingresos manuales

Campos esperados:

* Nombre descriptivo del ingreso
* Monto
* Fecha de creación
* Nota opcional

Modelo conceptual:

```txt
incomes
  id
  description
  amount
  created_at
  updated_at
```

## Informes

Área para revisar el comportamiento financiero registrado.

Informes iniciales sugeridos:

* Gastos por mes
* Gastos por semana
* Gastos por categoría
* Ingresos por mes
* Balance mensual
* Detalle de movimientos recientes
* Gastos reembolsables

### Informe de gastos reembolsables

Este informe debe mostrar el estado de los gastos marcados como reembolsables.

Debe permitir ver:

* Quién debe dinero
* Cuánto debe cada persona
* Qué gastos están pendientes
* Qué gastos ya fueron pagados
* Qué gastos fueron pagados parcialmente
* Monto total pendiente por cobrar
* Monto total ya recuperado

Vista inicial sugerida:

```txt
Persona        Total pendiente    Total pagado    Último gasto asociado
Amigo 1        $10.000            $5.000          Ramen
Amigo 2        $15.000            $0              Entrada concierto
```

También debe existir una tabla de detalle:

```txt
Fecha       Descripción        Persona       Monto       Estado
2026-06-20  Ramen amigos       Amigo 1       $10.000     Pendiente
2026-06-21  Entrada concierto  Amigo 2       $15.000     Pendiente
```

Métricas útiles:

```txt
Total de gastos
Total de ingresos
Balance del periodo
Total pendiente por reembolso
Total recuperado por reembolsos
Categoría con mayor gasto
Promedio de gasto semanal
```

## Configuraciones

Área para administrar opciones generales de la aplicación.

Funciones esperadas:

* Registrar categorías rápidas
* Editar categorías rápidas
* Eliminar o desactivar categorías rápidas
* Registrar saldo manual de cuenta corriente
* Revisar diferencias entre saldo esperado y saldo real

### Saldo manual

El saldo manual representa una foto del dinero real disponible en una cuenta en un momento específico.

No debe tratarse como un ingreso o gasto, sino como un registro de verificación.

Modelo conceptual:

```txt
balance_snapshots
  id
  account_name
  amount
  note
  created_at
```

Esto permitirá comparar el saldo registrado por la aplicación contra el saldo real indicado manualmente.

## Categorías rápidas iniciales sugeridas

```txt
Almuerzo
Comida
Once
Supermercado
Transporte
Farmacia
Mascotas
Ropa
Juego
Suscripción
Perfume
Salud
Casa
Cuenta
```

Estas categorías pueden cambiarse libremente desde Configuraciones.

## Principios del proyecto

La aplicación debe priorizar:

* Simplicidad
* Registro rápido
* Claridad visual
* Uso local
* Reportes útiles
* Código fácil de modificar
* Separación clara entre gasto, ingreso, categoría y reembolso

## No objetivos iniciales

Por ahora, el proyecto no busca incluir:

* Autenticación compleja
* Sincronización bancaria
* Integraciones externas
* Multiusuario
* Sistema avanzado de presupuestos
* Backend grande
* Despliegue público obligatorio

## Stack inicial

Frontend:

```txt
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

Base de datos local sugerida para etapas posteriores:

```txt
SQLite
```

ORM sugerido para etapas posteriores:

```txt
Prisma
```

## Comandos de desarrollo

Desde la raíz del proyecto:

```bash
cd frontend
pnpm install
pnpm dev
```

## Regla de trabajo por etapas

El proyecto debe avanzar por etapas pequeñas.

Cada etapa debe completarse, probarse y commitearse antes de pasar a la siguiente.

Cuando se trabaje con un agente de código, se debe pedir explícitamente que realice solo una etapa del TODO a la vez.

Ejemplo:

```txt
Trabaja solo en la Etapa 1 del TODO. No implementes etapas posteriores.
```

## TODO por etapas

### Etapa 0: Preparación del proyecto

* [x] Crear repositorio Git.
* [x] Copiar el template de v0 dentro de `frontend/`.
* [x] Eliminar el archivo `.zip` del template si ya fue descomprimido.
* [x] Instalar dependencias.
* [x] Verificar que el frontend levante correctamente.
* [x] Crear commit inicial con el template funcionando.

Resultado esperado:

```txt
El proyecto levanta localmente sin errores y el template visual está intacto.
```

### Etapa 1: Limpieza inicial del template

* [x] Revisar estructura del frontend.
* [x] Identificar componentes principales del dashboard.
* [x] Eliminar contenido de ejemplo que no sirva para Dash Gastos.
* [x] Mantener estilos, layout y componentes visuales útiles del template.
* [x] Ajustar textos visibles para que hablen de gastos, ingresos e informes.
* [x] No implementar lógica de negocio todavía.

Resultado esperado:

```txt
El frontend se ve como una base visual de Dash Gastos, pero aún sin funcionalidad real.
```

### Etapa 2: Layout principal de la aplicación

* [x] Crear navegación principal.
* [x] Agregar accesos a Registrar gasto, Registrar ingreso, Informes y Configuraciones.
* [x] Definir pantalla inicial del dashboard.
* [x] Crear cards o secciones visuales para resumen mensual, gastos, ingresos y reembolsos pendientes.
* [x] Usar datos mockeados.

Resultado esperado:

```txt
La aplicación tiene navegación y una pantalla principal clara usando datos falsos.
```

### Etapa 3: Formulario visual de registrar gasto

* [x] Crear formulario de registro de gasto.
* [x] Agregar campo nombre descriptivo.
* [x] Agregar campo monto.
* [x] Agregar checkbox `Es reembolsable`.
* [x] Mostrar campo nombre deudor solo cuando el checkbox esté activo.
* [x] No guardar datos todavía.
* [x] Validar visualmente campos obligatorios.

Resultado esperado:

```txt
Existe un formulario funcional a nivel UI para registrar gastos, pero sin persistencia.
```

### Etapa 4: Lógica de categoría rápida

* [x] Crear función para detectar categoría rápida desde la primera palabra del nombre descriptivo.
* [x] Crear lista temporal de categorías rápidas.
* [x] Si la primera palabra coincide con una categoría rápida, asignarla como categoría.
* [x] Limpiar la descripción removiendo la categoría del texto visible.
* [x] Mantener categoria y descripción separadas internamente.
* [x] Agregar pruebas simples o casos manuales de validación.

Ejemplo:

```txt
Entrada: Almuerzo McDonalds con amigos

Resultado:
Categoría: Almuerzo
Descripción limpia: McDonalds con amigos
Descripción original: Almuerzo McDonalds con amigos
```

Resultado esperado:

```txt
La aplicación puede interpretar categoría rápida desde el nombre del gasto.
```

### Etapa 5: Tabla de gastos con datos mockeados

* [ ] Crear tabla de gastos.
* [ ] Mostrar fecha, descripción limpia, categoría, monto y estado de reembolso.
* [ ] Mostrar si el gasto es reembolsable.
* [ ] Mostrar nombre deudor si existe.
* [ ] Usar datos mockeados.
* [ ] Permitir seleccionar un gasto para ver detalle básico.

Resultado esperado:

```txt
Existe una tabla clara para revisar gastos registrados usando datos falsos.
```

### Etapa 6: Registro de ingresos con datos mockeados

* [ ] Crear formulario de ingreso.
* [ ] Agregar campos descripción y monto.
* [ ] Crear tabla o listado de ingresos.
* [ ] Usar datos mockeados.
* [ ] Mostrar ingresos en el resumen del dashboard.

Resultado esperado:

```txt
La aplicación permite simular registro y visualización de ingresos.
```

### Etapa 7: Modelo de datos local

* [ ] Definir modelo de datos inicial.
* [ ] Decidir implementación local.
* [ ] Preparar SQLite.
* [ ] Preparar Prisma si corresponde.
* [ ] Crear tablas iniciales para gastos, ingresos, categorías rápidas y snapshots de saldo.
* [ ] No migrar todavía datos reales desde Excel.

Modelos iniciales sugeridos:

```txt
expenses
incomes
quick_categories
balance_snapshots
reimbursements
```

Resultado esperado:

```txt
Existe una base local preparada para persistir los datos principales.
```

### Etapa 8: Persistencia de gastos

* [ ] Conectar formulario de gastos con base de datos.
* [ ] Guardar descripción original.
* [ ] Guardar descripción limpia.
* [ ] Guardar categoría detectada.
* [ ] Guardar monto.
* [ ] Guardar fecha de creación.
* [ ] Guardar si es reembolsable.
* [ ] Guardar información inicial del reembolso si aplica.
* [ ] Actualizar tabla de gastos desde datos reales.

Resultado esperado:

```txt
Los gastos se guardan y se leen desde la base de datos local.
```

### Etapa 9: Persistencia de ingresos

* [ ] Conectar formulario de ingresos con base de datos.
* [ ] Guardar descripción.
* [ ] Guardar monto.
* [ ] Guardar fecha de creación.
* [ ] Actualizar resumen del dashboard desde datos reales.

Resultado esperado:

```txt
Los ingresos se guardan y se leen desde la base de datos local.
```

### Etapa 10: Configuración de categorías rápidas

* [ ] Crear pantalla de Configuraciones.
* [ ] Crear CRUD básico de categorías rápidas.
* [ ] Permitir crear categoría rápida.
* [ ] Permitir editar categoría rápida.
* [ ] Permitir eliminar o desactivar categoría rápida.
* [ ] Usar estas categorías en la lógica de registro de gasto.

Resultado esperado:

```txt
Las categorías rápidas se administran desde Configuraciones y afectan el registro de gastos.
```

### Etapa 11: Reportes básicos

* [ ] Crear pantalla de Informes.
* [ ] Mostrar gastos por mes.
* [ ] Mostrar gastos por semana.
* [ ] Mostrar gastos por categoría.
* [ ] Mostrar ingresos por mes.
* [ ] Mostrar balance mensual.
* [ ] Mostrar detalle de movimientos recientes.

Resultado esperado:

```txt
La aplicación muestra reportes básicos usando datos persistidos.
```

### Etapa 12: Reporte de gastos reembolsables

* [ ] Crear sección de gastos reembolsables dentro de Informes.
* [ ] Mostrar total pendiente por cobrar.
* [ ] Mostrar total ya pagado.
* [ ] Agrupar deuda pendiente por persona.
* [ ] Mostrar gastos reembolsables pendientes.
* [ ] Mostrar gastos reembolsables pagados.
* [ ] Permitir cambiar estado de un reembolso.
* [ ] Preparar el modelo para soportar varios reembolsos por un mismo gasto en una etapa futura.

Resultado esperado:

```txt
La aplicación permite ver quién debe dinero, cuánto debe y qué montos ya fueron pagados.
```

### Etapa 13: Registro manual de saldo

* [ ] Crear formulario para registrar saldo manual de cuenta corriente.
* [ ] Guardar snapshots de saldo.
* [ ] Mostrar historial de saldos registrados.
* [ ] Comparar saldo real registrado contra saldo calculado por la app.
* [ ] Mostrar diferencia.

Resultado esperado:

```txt
La aplicación permite registrar saldos reales y compararlos contra los movimientos registrados.
```

### Etapa 14: Importación inicial desde Excel

* [ ] Revisar estructura del Excel original.
* [ ] Definir formato esperado de importación.
* [ ] Crear script o flujo manual para importar registros.
* [ ] Validar categorías.
* [ ] Validar montos.
* [ ] Validar fechas.
* [ ] Insertar datos en la base local.

Resultado esperado:

```txt
Los registros históricos del Excel pueden migrarse a la aplicación.
```

### Etapa 15: Pulido visual y experiencia de uso

* [ ] Mejorar estados vacíos.
* [ ] Mejorar mensajes de error.
* [ ] Mejorar validaciones.
* [ ] Ajustar responsive.
* [ ] Revisar accesibilidad básica.
* [ ] Revisar consistencia visual con el template original.
* [ ] Limpiar componentes no usados.

Resultado esperado:

```txt
La aplicación queda cómoda, clara y agradable para uso diario.
```

## Estado del proyecto

Proyecto personal en etapa inicial.

La primera meta es dejar funcionando la base visual del frontend y luego construir progresivamente los flujos principales sin implementar todo de una vez.
