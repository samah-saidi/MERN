# 📘 README -- Semaine 7 MERN : React Hooks (useState, useEffect, useReducer)

## 🎯 Objectifs de la séance

Cette séance vise à maîtriser les trois hooks fondamentaux de React à
travers des explications théoriques puis plusieurs projets pratiques.

📁 Structure du projet
```bash
REACT2_TP8/
│
├── node_modules/
│
├── public/
│   └── index.html
│
├── src/
│   ├── assets/                # Images utilisées dans le README / projets
│   │
│   ├── components/
│   │   └── ShoppingListApp.jsx
│   │
│   ├── reducers/
│   │   └── todoReducer.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── BlogApp.jsx
│   ├── index.css
│   ├── main.jsx
│   └── ProjectManager.jsx     # Projet final complet
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

------------------------------------------------------------------------

# 🧠 Partie 1 : Concepts Essentiels

## 🔹 1. useState -- Ajouter un état local

`useState` ajoute de la mémoire à un composant fonctionnel.

Exemples : - `const [count, setCount] = useState(0)` -
`const [items, setItems] = useState([])` -
`const [user, setUser] = useState({ name: "", age: 0 })`

### ✔ Règle d'Or : Immutabilité

❌ Incorrect :

``` js
user.name = "Bob";
setUser(user);
```

✅ Correct :

``` js
setUser({ ...user, name: "Bob" });
setItems([...items, newItem]);
```

------------------------------------------------------------------------

## 🔹 2. useEffect -- Gérer les effets de bord

useEffect permet d'exécuter du code après le rendu.

Trois usages importants : 1. Au montage : `useEffect(() => {...}, [])`
2. Quand une valeur change : `useEffect(() => {...}, [value])` 3. À
chaque rendu : `useEffect(() => {...})`

Utilisations courantes : - Timers - Appels API - localStorage -
Écouteurs d'événements

------------------------------------------------------------------------

## 🔹 3. useReducer -- Gestion d'état complexe

Recommandé lorsque : - plusieurs valeurs d'état sont liées, - les mises
à jour suivent une logique métier structurée.

Exemple :

``` js
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "ACTION_NAME", payload: data });
```

------------------------------------------------------------------------
# 🧠 Partie 1 : Projets Pratiques
## 🛒 2. Projet 2 -- Liste de Courses avec Timer

*Fonctionnalités* : 
- Ajouter des articles 
- Marquer comme acheté 
- Calcul des prix 
- Timer Pomodoro (25 min) 
- Pause / Reset 
- Persistance
localStorage

*Hooks utilisés* : 
- useState (items et timer) 
- useEffect (stockage + nettoyage des timers)

**Resultat**
![img](src/assets/liste_courses.png)

**Toutes Liste** 
![img](src/assets/liste_courses2.png)

**Pause**
![img](src/assets/pause.png)

**Reset**
![img](src/assets/reset.png)

*✅ Points clés du Projet 2 :*

-  **useState multiple** : Gestion de plusieurs états indépendants (liste, inputs, timer)
-  **useEffect avec cleanup** : Timer avec clearInterval pour éviter les fuites mémoire
-  **useEffect avec dépendances** : Persistance localStorage automatique
-  **Calculs dérivés** : totalPrice et boughtCount calculés à la volée
-  **Inputs contrôlés** : Liaison bidirectionnelle avec value + onChange

------------------------------------------------------------------------

## 📝 3. Projet 1 -- Gestionnaire de Tâches avec useReducer (Todo List)

Fonctionnalités : - Ajouter / compléter / supprimer une tâche - Filtrer
: all / active / completed - Sauvegarde dans localStorage

Architecture : - useReducer pour le reducer - useEffect pour
persistance - useState pour les inputs

**Resultat**
![img](src/assets/todo_list.png)

**Toutes Liste**
![img](src/assets/toutes_list.png)

**Liste Actives**
![img](src/assets/list_actives.png)

**Liste Completees**
![img](src/assets/list_completees.png)

------------------------------------------------------------------------

## ✍️ 4. Projet 3 -- Blog Interactif avec Tri & Recherche

Fonctionnalités : - Ajouter un article - Rechercher par texte - Filtrer
par auteur - Trier : likes / date - Like / supprimer - Persistance
automatique

Hooks : - useState (multi-états) - useEffect (sauvegarde locale)

**Resultat**
![img](src/assets/BlogApp_projet3.png)

**Filter par recherche**
![img](src/assets/filtered_research.png)

**Filter par Auteur**
![img](src/assets/filtered_auteur.png)

**Ajout d'un course**
![img](src/assets/ajout_course.png)

------------------------------------------------------------------------

## 🧱 5. Projet Final -- Gestionnaire de Projets

Maintenant, le projet le plus complet qui combine TOUS les concepts :

*Fonctionnalités obligatoires : *
- useReducer : gestion des projets 
- useEffect : timers + persistance 
- useState : formulaires, filtres,recherche 
- Filtrer par statut 
- Trier par deadline 
- Timer Pomodoro par projet - Statistiques

**Ajout Projet**
![img](src/assets/ajout_projet.png)

**Resultat**
![img](src/assets/Final_project.png)

**Filter par recherche**
![img](src/assets/filter_research.png)
![img](src/assets/filter_recherche.png)

**Filter par les projets à faire**
![img](src/assets/filter_afaire.png)

**Filter par les projets terminées**
![img](src/assets/filter_terminee.png)

**Filter par statut**
![img](src/assets/filter_statut.png)

**Affichage de gestion du projet**
![img](src/assets/gestion_projet.png)

**Capture Vidéo du resultat**
![img](src/assets/20251117-1824-37.9004249.gif)



[👉 Voir la vidéo résultat](src/assets/Project_manager.mp4)
**Supprimer un projet cela afficher dans la vidéo**

------------------------------------------------

## 📚 RÉCAPITULATIF FINAL
✅ Ce que vous avez maintenant :
### Projet 2 - Liste de Courses avec Timer

✅ useState multiple (liste, inputs, timer)

✅ useEffect avec cleanup (timer)

✅ Persistance localStorage

✅ Timer Pomodoro fonctionnel

### Projet 1 - Gestionnaire de Tâches

✅ useReducer pour la logique centralisée

✅ Filtrage (toutes/actives/complétées)

✅ Persistance avec chargement/sauvegarde

✅ Immutabilité stricte

### Projet 3 - Blog Interactif

✅ Recherche multi-critères

✅ Tri dynamique (date/likes)

✅ Filtre par auteur

✅ CRUD complet (Create, Read, Update, Delete)

✅ Initialisation lazy useState

### 🎯 PROJET FINAL - Gestionnaire de Projets
Combine TOUS les hooks :

✅ useReducer : Gestion d'état complexe (projets, filtres, tri)

✅ useEffect :

Persistance localStorage
Timers multiples avec cleanup
Chargement initial


✅ useState : Formulaires, recherche, affichage conditionnel

✅ Statistiques visuelles en temps réel

✅ Timer Pomodoro par projet

✅ Filtrage et tri avancés

✅ Interface moderne en grid layout


### 🎓 Concepts Maîtrisés

| Concept        | Projet 2 | Projet 1 | Projet 3 | Final |
|----------------|----------|----------|----------|--------|
| useState       | ✅        | ✅        | ✅        | ✅      |
| useEffect      | ✅        | ✅        | ✅        | ✅      |
| useReducer     | ❌        | ✅        | ✅        | ❌      |
| Immutabilité   | ✅        | ✅        | ✅        | ✅      |
| localStorage   | ✅        | ✅        | ✅        | ✅      |
| Timer/Cleanup  | ✅        | ❌        | ❌        | ✅      |
| Filtrage       | ✅        | ✅        | ✅        | ✅      |

------------------------------------------------------------------------

## 📚 Ressources

-   React Docs : https://react.dev
-   useState : https://react.dev/reference/react/useState
-   useEffect : https://react.dev/reference/react/useEffect
-   useReducer : https://react.dev/reference/react/useReducer

-----------------

## Auteur 
**Samah SAIDI**