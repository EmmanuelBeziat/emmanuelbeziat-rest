---
title: "Principes du CSS - Les sélecteurs (Partie 2 : CSS3)"
date: "2014-02-04 08:55:02"
tags:
- html/css
categories:
- Tutoriels
---

Lorsqu’on utilise du CSS, on peut se contenter des trois sélecteurs de base : les éléments, les identifiants et les classes. Souvent, sans le savoir, vous utilisez un sélecteur simple de descendance, par un espace entre deux de ces sélecteurs - hé oui ! Mais il existe d’autres sélecteurs plus avancés, nous allons les passer en revue.

Je ne traite ici que du CSS 3\. Je vous recommande d’avoir lu préalablement l’article concernant les [sélecteurs du CSS2](http://www.emmanuelbeziat.com/blog/principes-du-css-les-selecteurs-partie1-css2/ "Principes du CSS – Les sélecteurs (Partie1 : cSS2)").


## Les espaces de noms (namespace)

```css
namespace|div {
	color: red
}
```

Une des grandes nouveautés apportées par cette nouvelle version est la gestion des espaces de noms. Les programmeurs sauront de quoi je parle. Pour faire simple, on peut définir un espace de nom particulier et n’appliquer des propriétés qu’aux balises dans cet espace de nom.

**Exemple :** Définissons un espace de nom pour une page particulière :

```css
@namespace produits url(http://www.monsite.com/produits.html);
```

Puis un espace de nom pour une autre page :

```css
@namespace membre url(http://www.monsite.com/membre.html);
```

Il est désormais possible d’appliquer des modifications qui ne seront spécifiques qu’à ces pages :

```css
/* propriétés qui ne seront appliqués que sur les balises h1
de la page définie par l’espace de nom "produits" */
produits|h1 { color: red }

/* uniquement les balises h1 dans la page définie par "membre" */
membre|h1 { color: red }

/* uniquement les balises h1 qui ne sont PAS dans un espace de nom
(donc autre que dans les pages définies plus haut */
|h1 { color: red }

/* tout élément h1 dans n’importe quel espace de nom */
*|h1 { color: red }

/* par défaut */
h1 {color: red}
```

À noter qu’il est possible de définir un nom d’espace par défaut :

```css
@namespace "http://www.monsite.com"
```

Tous les sélecteurs css qui n’ont pas d’espace de nom spécifié seront donc attribués à celui-ci.

## Les sélecteurs

### Sélecteur d’adjacence indirecte : "~"

```css
h1 ~ pre {
	color: red
}
```

Dans la même idée que les sélecteurs d’adjacence `+`, celui-ci permet d’atteindre tout élément (ici `pre`) de même niveau que l’élément référent (ici `h1`). La différence étant qu’ici, l’élément cible n’a pas besoin d’être directement adjacent à l’élément référent.

```markup
<h1>Titre</h1>
<p>Pas affecté</p>
<pre>Affecté</pre>
<p>Pas affecté</p>
```

### Sélecteur d’attribut

```css
a[href^=https] {
	color: red
}
```

Ce sélecteur permet de choisir un élément dont la valeur de l’attribut commence par ce que vous avez défini. Dans l’exemple, tous les liens dont l’adresse commence par "https".

```markup
<a href="http://www.monsite.com">Ce lien ne sera pas affecté</a>
<a href="https://www.monsite.com">Ce lien sera affecté</a>
```

Évidemment, ça ne se limite pas qu’aux liens.

```css
a[href$=.pdf] {
	color: red
}
```

Avec celui-ci, on peut choisir à l’inverse un élément dont la valeur de l’attribut fini par ce que vous avez défini. L’exemple au-dessus permet donc de choisir tous les liens vers un fichier PDF.

```markup
<a href="monfichier.doc">Ce lien ne sera pas affecté</a>
<a href="monfichier.pdf">Ce lien sera affecté</a>
<a href="monfichier.pdf.doc">Ce lien ne sera pas affecté</a>
```

```css
a[href*=monsite] {
	color: red
}
```

Celui-ci enfin, permet de sélectionner l’élément dont l’attribut désigné comporte au moins la chaîne de caractère définie.

```markup
<a href="http://www.lesite.com">Ce lien ne sera pas affecté</a>
<a href="http://www.monsite.com">Ce lien sera affecté</a>
```

## Les pseudo-classes

### last-child

À la manière de `:first-child`, cette pseudo-classe cible un élément s’il est le dernier enfant de son parent.

```css
div p:last-child {
	color: red;
}
```

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément sera affecté</p>
</div>
```

Si on voit maintenant, pour le même code CSS, ce code HTML :

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<h2>Ce titre ne sera pas affecté</h2>
</div>
```

Rien ne va se passer. En effet, le code CSS signifie "cibler tous les éléments `p` s’il s’agit du dernier enfant de leur parent" et non "cibler tous les éléments `p` qui sont les derniers de ce éléments de type `p` enfants". Or dans ce cas, c’est `h2` qui est le dernier enfant.

### first-of-type

L’élément manquant à `:first-child`. Cette pseudo-classe permet cette fois-ci de cibler chaque premier élément d’un type donné, pour son parent (par exemple, le premier <span> dans un paragraphe).

```css
div *:first-of-type {
	color: red
}
```

```markup
<div>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<span>Cet élément sera affecté</span>
</div>

<div>
	<h2>Ce titre sera affecté</h2>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<span>Cet élément sera affecté</span>
	<p>Cet élément ne sera pas affecté</p>
</div>
```

### last-of-type

Le parfait opposé de `:first-of-type`. Cette pseudo-classe permet cette fois-ci de cibler chaque dernier élément d’un type donné, pour son parent.

```css
div p:last-of-type {
	color: red
}
```

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément sera affecté</p>
</div>

<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément sera affecté</p>
	<h2>Ce titre ne sera pas affecté</h2>
</div>
```

### only-of-type

Un peu plus particulier cette-fois ci, cette pseudo-classe permet d’affecter un élément qui est le seul de son type par rapport à son parent.

```css
div p:only-of-type {
	color: red
}
```

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
</div>

<div>
	<h2>Ce titre ne sera pas affecté</h2>
	<p>Cet élément sera affecté</p>
	<h2>Ce titre ne sera pas affecté</h2>
</div>
```

### only-child

Comme son nom l’indique, cette pseudo-classe n’agit que sur un élément qui est le seul enfant de son parent.

```css
div p:only-child {
	color: red
}
```

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
</div>

<div>
	<p>Cet élément sera affecté</p>
</div>
```

### nth-child(n)

Un peu particulier, cette pseudo-classe permet de cibler un élément qui est le _n_ième enfant de son parent. Par exemple, si on veut choisir le second élément d’une liste :

```css
li:nth-child(2) {
	color: red
}
```

```markup
<ul>
	<li>Cet élément ne sera pas affecté</li>
	<li>Cet élément sera affecté</li>
	<li>Cet élément ne sera pas affecté</li>
</ul>
```

### nth-last-child(n)

Même chose que précédement, mais cette fois le décompte de _n_ commence en partant du dernier enfant. Par exemple, si on veut cibler l’avant-dernier élément d’une liste :

```css
li:nth-last-child(2) {
	color: red
}
```

```markup
<ul>
	<li>Cet élément ne sera pas affecté</li>
	<li>Cet élément ne sera pas affecté</li>
	<li>Cet élément ne sera pas affecté</li>
	<li>Cet élément sera affecté</li>
	<li>Cet élément ne sera pas affecté</li>
</ul>
```

### nth-of-type(n)

Similaire à `:nth-child(_n_)` , celle-ci permet de cibler le _n_ième enfant d’un type défini. Par exemple, si on veut choisir le troisième paragraphe :

```css
p:nth-of-type(3) {
	color: red
}
```

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté</p>
</div>
```

Sachant qu’il s’agit de type et non de nombre d’enfant, on peut s’en servir même lorsqu’il y a des balises entre deux :

```markup
<div>
	<span>balise</span>
	<p>Cet élément ne sera pas affecté</p>
	<span>balise</span>
	<p>Cet élément ne sera pas affecté</p>
	<span>balise</span>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté</p>
</div>
```

### nth-last-of-type(n)

Cette fois-ci, vous pouvez cibler le dernier d’un type, en partant du dernier de ce même type. Par exemple pour un avant-dernier paragraphe :

```css
p:nth-last-of-type(3) {
	color: red
}
```

```markup
<div>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément ne sera pas affecté</p>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté</p>
</div>
```

Sachant qu’il s’agit de type et non de nombre d’enfant, on peut s’en servir même lorsqu’il y a des balises entre deux :

```markup
<div>
	<span>balise</span>
	<p>Cet élément ne sera pas affecté</p>
	<span>balise</span>
	<p>Cet élément ne sera pas affecté</p>
	<span>balise</span>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté</p>
</div>
```

### not(selecteur)

Un peu particulier encore une fois, cette pseudo-classe permet d’affecter tout élément qui n’est pas du type spécifié. Un exemple :

```css
:not(p) {
	color: red
}
```
```markup
<div>
	<ul>
		<li>Cet élément sera affecté</li>
		<li>Cet élément sera affecté.
			<p>Cet élément ne sera pas affecté</p>
		</li>
	</ul>
	<p>Cet élément ne sera pas affecté</p>
</div>
```

### empty

Une pseudo-classe toute simple qui permet de cibler tout élément qui n’a aucun enfant.

```css
p:empty {
	color: red
}
```
```markup
<div>
	<p>Cet élément sera affecté</p>
	<p>Cet élément sera affecté</p>
	<p>Cet élément ne sera pas affecté
		<span>car il contient un enfant</span>
	</p>
</div>
```

### enabled

Celle-ci permet de cibler tout élément qui est, soit par défaut, soit précisément via html, défini comme "actif". c’est surtout utile pour les éléments de formulaire.

```input:enabled {
	background: white
}
```

```markup
<!-- cet élément sera affecté -->
<input type="text" />
<!-- cet élément ne sera pas affecté, il est désactivé -->
<input type="text" disabled="disabled" />
```

### disabled

À l’inverse, cette pseudo-classe permet de cibler un élément défini comme désactivé.

```css
input:disabled {
	background: grey
}
```
```markup
<!-- cet élément ne sera pas affecté, il n’est pas désactivé -->
<input type="text" />
<!-- cet élément sera affecté, il est désactivé -->
<input type="text" disabled="disabled" />
```

## Conclusion… ?

Tout en essayant d’être complet, je n’ai pas été exhaustif. Le CSS3 est une norme loin d’être terminée, qui évolue encore, et qui pourrait voir d’autres éléments s’ajouter par la suite. Comme toujours, n’oubliez pas qu’on peut toujours mixer plusieurs sélecteurs !
