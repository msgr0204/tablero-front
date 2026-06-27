# Tablero de Requerimientos — Frontend

React + Vite + Tailwind. Multi-tenant con branding dinámico por tenant (colores + logo). Dominio: Categoria → Modulo → Requerimiento, con Estado/Prioridad como catálogos editables y Notificacion como log de eventos.

## Disciplina de código (no negociable, lo que nos ha funcionado)

- Código profesional, 0 parches, full limpio, 100% escalable.
- Cero comentarios de QUÉ. Solo PORQUÉ cuando hay una decisión no obvia — ejemplo real en `components/Select.jsx`: el comentario explica por qué se usa Headless UI Listbox en vez de `<select>` nativo (el navegador ignora el `font-size` en `em` del select nativo) y por qué `Listbox.Options` usa `anchor` (escapar del `overflow-hidden` del contenedor padre vía Floating UI).
- Nunca abstraer antes de tener 2-3 casos reales que lo pidan.
- Todo en `em`, nunca `px` — así escala con el font-size base, consistente en toda la app.
- Textos de UI y nombres de variables/funciones en español.

## El patrón exacto, capa por capa (replicar literal para cualquier dominio nuevo)

Siempre: `src/modules/<dominio>/services/` → `hooks/` → `components/` → `pages/`.

**Service** (`modules/tablero/services/categoryService.js`) — solo llama a `apiClient`, normaliza la respuesta:
```js
function normalize(categoria) {
  return { ...categoria, id: categoria._id, fecha_entrega: normalizeDate(categoria.fecha_entrega) };
}
const categoryService = {
  update: async (id, payload) => {
    const { data } = await apiClient.patch(`/categorias/${id}`, payload);
    return normalize(data);
  },
};
```
Cada service tiene su propia función `normalize()` — siempre agrega `id: doc._id` (Mongoose no expone `id` en objetos planos serializados por JSON), y normaliza cualquier campo de fecha con `lib/normalizeDate.js`.

**Hook** (`modules/tablero/hooks/useCategories.js`) — dueño del estado en memoria de ese dominio, patrón fijo en cada mutación:
```js
const updateCategory = async (id, payload) => {
  setMutating(true); setError(null);
  try {
    const updated = await categoryService.update(id, payload);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    return updated;
  } catch (err) {
    setError(err.message); throw err;
  } finally {
    setMutating(false);
  }
};
```
`loading` (fetch inicial) y `mutating` (create/update/remove) son estados separados siempre. El hook relanza el error (`throw err`) después de guardarlo en `error` — el componente que llama decide si necesita reaccionar al catch.

**Component/Page**: consumen el hook, nunca llaman al service directo. Si un dominio tiene estado que necesita compartirse entre páginas (no solo dentro de una página), ese estado vive en un **Context** (`modules/tablero/contexts/EstadosPrioridadesContext.jsx`), no en un hook que cada página instancia por separado.

## Una sola fuente de verdad por dominio — el bug real que ya nos pasó

`ConfiguracionEstados.jsx` tenía su propio hook (`useEstadosPrioridadesConfig`, ya eliminado) con su copia local de `estados`/`prioridades`, separada del `EstadosPrioridadesContext` que usa el resto del tablero (`CategoryCard`, `Tablero`, los filtros). Resultado: renombrar un estado ahí nunca se reflejaba en el resto de la app sin recargar la página completa — dos copias de la misma data en memoria, desincronizadas. Fix: las funciones de mutación (`createEstado`, `updateEstado`, etc.) viven directamente en el Context; `ConfiguracionEstados.jsx` consume `useEstadosPrioridades()`, el mismo hook que usa todo lo demás.

Antes de crear un hook nuevo para un dominio que ya tiene Context: ¿esto debería vivir ahí para que se sincronice con el resto de la app, o es genuinamente local a una sola página?

## Identificadores en Select/FilterDropdown: SIEMPRE mapear a `{value: item.id, label}`

Bug real ya corregido: varios componentes (`StatusFields.jsx`, `CategoryForm.jsx`, `ModuleForm.jsx`, `CategoryCard.jsx`, `Tablero.jsx`, `ModulosCategoria.jsx`, `DetalleModulo.jsx`) pasaban el array crudo del catálogo directo como `options`:
```js
// MAL — Select usa item.value (el slug interno), no el id real
options={[{ value: '', label: 'Sin estado' }, ...estados]}

// BIEN — mapear explícito
options={[{ value: '', label: 'Sin estado' }, ...estados.map((e) => ({ value: e.id, label: e.label }))]}
```
`components/Select.jsx` y `components/FilterDropdown.jsx` SIEMPRE comparan/seleccionan por el campo `value` de cada opción — si ese `value` no es el `id` real del item, el filtro/selección queda roto silenciosamente (sin error, simplemente no encuentra match).

## Comparar valores que pueden venir de Mongo (ObjectId serializado)

Cuando un campo del backend es un `ref` (ObjectId), llega al frontend ya serializado como string por JSON — comparar con `===` contra otro string normalizado funciona bien (a diferencia del backend, donde comparar dos `ObjectId` de Mongoose con `===` es un bug). El patrón real en `CategoryCard.jsx` para detectar cambios sin guardar:
```js
const isDirty =
  nombre.trim() !== category.nombre ||
  (estado || null) !== (category.estado ?? null) ||
  ((estado && esEstadoFinal(estado)) ? null : (prioridad || null)) !== (category.prioridad ?? null);
```
Siempre normalizar `''`/`undefined` a `null` antes de comparar contra lo que vino del backend (que usa `null`, nunca `''`, para "sin valor").

## Edición inline con confirmación de descarte (patrón replicado en CategoryCard, RequirementItem, EstadoPrioridadItem, DetalleModulo)

- `isDirty` se calcula comparando cada campo editable contra el valor original — nunca se asume "hay cambios" solo porque el usuario entró a modo edición.
- Botón guardar (check): si `!isDirty`, solo cierra el modo edición, NUNCA llama al backend ni dispara notificación.
- Botón cancelar (X): si `isDirty`, abre `components/ConfirmDiscardModal.jsx` antes de descartar; si no hay cambios, cierra directo.
- `autoEdit`/`onAutoEditDone` (ver `CategoryCard.jsx` + `Tablero.jsx`): patrón para abrir una card específica en modo edición al llegar desde otra parte de la app (ej. el link de una notificación) vía query param `?editar=<id>` — el query param se limpia recién cuando el usuario cierra/guarda esa edición, NUNCA en un `useEffect` al montar (React StrictMode hace un montaje fantasma en desarrollo que limpiaría el param antes de que la página real lo use).

## Branding dinámico por tenant

- `context/BrandingContext.jsx` aplica las 16 variables CSS (`--color-primero`, etc.) sobre `:root` vía `lib/applyBrandingColors.js`, sincronizado con `tenant` de `AuthContext`.
- La paleta fija en `index.css` es la de Quantum — es la identidad de la pantalla pública de login/registro, nunca debe cambiar por la plantilla elegida por un tenant.
- Al cerrar sesión o si el token expira, SIEMPRE llamar `resetBrandingColors()` (en `AuthContext#logout` y en el catch de `fetchPerfil`) — si no, el login queda pintado con los colores del último tenant, porque las variables CSS quedan inline en el DOM y nada las revierte solo.
- `components/Modal.jsx` se monta vía `createPortal` a `document.body`, nunca inline — si se renderiza dentro de un ancestro con `transform` (Framer Motion, headers `sticky`), el `position: fixed` del overlay se ancla a ese ancestro en vez del viewport completo, rompiendo el centrado.

## Cómo trabajamos en este proyecto

- El usuario prueba todo manualmente en su navegador — nunca correr `npm run dev` salvo que lo pida explícitamente.
- Para decisiones de UX/diseño con trade-offs reales (qué resaltar, qué ocultar, dónde vive un dato, qué pasa si la entidad referenciada ya no existe) preguntar con opciones concretas ANTES de construir, no asumir.
- Cuando se reporta un bug visual, leer el componente real involucrado antes de proponer un fix — no adivinar la causa por la descripción.
- Cuando una tarea toca más de ~5 archivos en cascada, usar TodoWrite para trackearla.
- Al terminar: resumen corto de qué cambió y por qué, no narración de cada paso intermedio.
