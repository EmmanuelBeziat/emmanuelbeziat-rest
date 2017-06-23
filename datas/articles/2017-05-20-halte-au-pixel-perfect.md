---
title: "Halte au pixel perfect"
date: 2017-06-23 01:31:07
image: https://images.emmanuelbeziat.com/article-pixel-perfect.jpg
tags: ["html/css", "design", "mauvaises pratiques"]
categories: ["Diatribes"]
disqus: true
---

Le pixel perfect, c’est cette volonté d’obtenir un rendu informatique (de site web, donc) parfaitement identique partout. C’est un vieux truc marketing de web agency, époque 2005-2010 ; une façon d’assurer au client que le rendu sera « parfait » comme un gage de qualité.

Je vais commencer par conclure : **le pixel perfect n’est pas possible**. Il est parfaitement inutile de courir après.

## Les maquettes ne sont pas parfaites…

C’est évidemment la première source de problème : Photoshop peut faire n’importe quoi. Même faire des décimales de pixels. Ainsi, comment rendre au pixel près une typo calculée à 25.87px ? Aucun navigateur ne fera ça, le rendu sera arrondi à l’entier supérieur.

Et quand bien même, cette valeur ne sera jamais constante d’une maquette de page à une autre, voire même d’un calque de texte à un autre. Ce sera 25.87px sur `home.psd`, 24.39px sur `about-us.psd`, et finalement 31.42px sur `home-final-v2.psd`.

![Pixel perfect Photoshop](https://images.emmanuelbeziat.com/pixel-perfect-01.jpg) { .text-align-center }

De la même façon, respecter une _grid_ sur Photoshop est complexe. Mais respecter des marges encore plus. Ici aussi, d’un fichier à un autre, les marges de tel ou tel élément, voulu comme identique, ne seront pas les mêmes (surtout verticalement). Pas plus que les alignements, qu’un coup de souris malheureux peux réduire à néant.

Et dans la liste de toutes les fantaisies, on trouve :

- Les interlignages qui peuvent changer d’un calque à l’autre, toujours potentiellement avec des valeurs improbables
- L’espacement des lettres peut lui aussi avoir des valeurs impossibles à reproduire en CSS
- Les effets de calque (faux gras, faux italique) ne peuvent être fidèlement reproduits
- Les couleurs qui varient sensiblement d’un ou deux digits, mais qui finissent par produire quinzes tons de bleu différents
- J’en passe et pas des meilleurs…

De plus, la tentation de laisser libre court à ses envies graphiques est très présent sur un logiciel d’image, ce qui conduit souvent à se retrouver avec 5 ou 6 types de titres, parfois sans aucune réelle continuité visuelle d’une page à l’autre, avec des tailles, des couleurs et des typos qui s’accumulent.

Bref, Photoshop — et tout équivalent qui servirait à produire une maquette — n’est pas fiable. Je répète : **On ne peut pas faire confiance à une maquette**.

![Pixel perfect Photoshop](https://images.emmanuelbeziat.com/pixel-perfect-02.jpg) { .text-align-center }

## … mais le CSS, si

Le CSS est mathématique. En celà, il est bien plus fiable, à plus forte raison avec un préprocesseur (Stylus, Sass, Less…) qui permet de mettre toutes les valeurs dans des variables, afin de ne jamais se tromper nulle part.

![Pixel perfect Photoshop](https://images.emmanuelbeziat.com/pixel-perfect-03.jpg) { .text-align-center }

Le centrage effectué par le moteur de rendu du navigateur est absolu. Si vous indiquez `text-align: center;`, votre texte est centré de façon parfaite.

Le calcul des tailles est fixe. Définissez une marge à 40px sur un type d’élément, elle sera à 40px sur tous les éléments en question. Sans jamais faillir.

Enfin, le fait d’utiliser les variables permet d’avoir sous les yeux une liste rapide de valeurs-clés, et de s’apercevoir très vite si le nombre de titres différents, de tailles de texte prévues ou de couleurs ne commence pas à friser l’abus pur et simple.

En clair, le CSS est rigoureux, fiable et permet une meilleure continuité sur le site. Il a été prévu pour ça.

## Fluidité, adaptabilité, accessibilité

Du reste, un site est fluide. Le texte va être amené à changer, le contenu va évoluer. La mise en page peut être modifiée par un simple redimensionnement de la fenêtre du navigateur, ou un écran différent.

Photoshop ne peut pas gérer cela. On ne peut pas prévoir des variations infimes, l’étirement de colonnes ou l’agrandissement du texte global (pour les malvoyants par exemple) dans Photoshop. Alors que le web prévoit tout ça. Le CSS propose des unités relatives à la taille du texte d’un élément, une taille de texte de référence, la largeur ou la hauteur de la fenêtre, la taille de son parent, et plein d’autres choses qui ne seront jamais à la portée d’un logiciel de retouche d’images.

## Différences matérielles

Au-delà de ça, il est même impossible de garantir un rendu "pixel perfect" d’un écran à un autre, d’un ordinateur à un autre. Chaque système d’exploitation a un système de lissage de polices qui lui est propre, et qui va impacter le rendu de la page. De la même façon, un navigateur pourrait embarquer un système similaire indépendant (c’était le cas sur IE 7 et 8).

Et bien sûr, chaque type d’écran peut avoir un système d’affichage différent. Outre les écrans qui affichent une densité de pixels supérieure aux plus classiques, il y a également des différences de technologie d’affichage, qui auront également un certain impact.

Enfin, que dire du fait que, de toutes façons, les couleurs ne sont jamais identiques d’un écran à l’autre ?

## Le CSS a raison

En un mot comme en cent, **une maquette est une charte purement indicative**, qui annonce l’allure générale du site et/ou des différents gabarits de page. En aucun cas elle ne peut assumer le rôle de "master" à dupliquer avec précision. Ce n’est pas fait pour ça. Aucun outil d’image n’est adapté au web, ni à aucun des supports du Web.

### D’autres liens sur le sujet

- [UX Republic - le pixel perfect est mort](http://www.ux-republic.com/le-pixel-perfect-est-mort/)
