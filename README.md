# Machapa Games

E-commerce de videojuegos en **React** (Vite) con componentes funcionales, `useState`, `useEffect` y renderizado condicional.

Proyecto del curso **Desarrollo Frontend I (PFY2201)** — actividad formativa *Construyendo componentes funcionales en React para un eCommerce interactivo*.

**Autor:** Sebastián Tapia

**Repositorio:** [github.com/SebastianTapia1104/Desarrollo-Frontend-I](https://github.com/SebastianTapia1104/Desarrollo-Frontend-I)

**Sitio publicado:** [sebastiantapia1104.github.io/Desarrollo-Frontend-I](https://sebastiantapia1104.github.io/Desarrollo-Frontend-I/)

## Cómo ver la tienda

```bash
cd Machapa-Store
npm install
npm run dev
```

La URL local es `http://127.0.0.1:5173`. El catálogo se carga con Fetch desde `public/data/productos.json`.

La carpeta **`docs/`** es el sitio ya compilado para GitHub Pages (`main` → `/docs`). El código que se edita está en **`Machapa-Store/`**. Para actualizar Pages: `cd Machapa-Store` y `npm run build`.

## Estructura

```
README.md
docs/                 Sitio publicado en GitHub Pages
Machapa-Store/        Proyecto React (código fuente)
  index.html
  vite.config.js
  public/
  src/
```

## Contenido

Cada producto muestra nombre, imagen completa (contain + fondo difuminado), descripción, stock, **precio normal** y **precio oferta** cuando hay campaña. Acción y aventura va con 30% e Indie con 20%. El carrito permite agregar, cambiar cantidad y quitar, con el total al precio vigente.

Identidad visual: fondo `#1a1a2e`, morado `#6c5ce7`, cian `#00cec9`. Precios en pesos chilenos.
