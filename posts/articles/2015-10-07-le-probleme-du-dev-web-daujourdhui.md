---
title: "Le problème du dev web d’aujourd’hui"
date: "2015-10-07 02:34:00"
image: "https://images.emmanuelbeziat.com/web-moderne.png"
description: "Ces dernières années, pas mal d’avancées ont été faites dans le domaine du web. L’arrivée de html5 mais surtout de CSS3, de nouvelles API, les nouvelles possibilités au sein des navigateurs, le versionning (svn, git), les fonticons, les préprocesseurs et la pléthore de nouveaux outils comme les task-runners ont permis de faire de grosses avancées en matière de workflow, de productivité et de possibilités."
tags:
- bonnes pratiques
- workflow
categories:
- Diatribes
publish: false
---

Ces dernières années, pas mal d’avancées ont été faites dans le domaine du web. L’arrivée de html5 mais surtout de CSS3, de nouvelles API, les nouvelles possibilités au sein des navigateurs, le versionning (svn, git), les _fonticons_, les préprocesseurs et la pléthore de nouveaux outils comme les _task-runners_ ont permis de faire de grosses avancées en matière de _workflow_, de productivité et de possibilités.

Pour autant, il me semble que tout ne soit pas rose… Petite réaction à chaud.


![web-moderne](https://images.emmanuelbeziat.com/web-moderne.png) { .text-align-center }

## Je suis un dinosaure, mais je me soigne

J’ai été plutôt long à adopter certaines de ces nouveautés. Je n’utilise un _task-runner_ ([Gulp](http://gulpjs.com/){ target="_blank" rel="noopener" }) que depuis un an, je suis resté relativement frileux aux préprocesseurs avant de découvrir [Stylus](https://learnboost.github.io/stylus/){ target="_blank" rel="noopener" } l’année dernière, et il m’a fallu un moment avant de me convaincre d’utiliser [Bower](http://bower.io/){ target="_blank" rel="noopener" } et [Composer](https://getcomposer.org/){ target="_blank" rel="noopener" }.

Pour autant, je prend conscience que freiner me fait prendre du retard, et j’essaie de m’engager le plus possible en sens inverse, cherchant les nouveautés, me renseignant sur les nouvelles pratiques. Mais à force de tester pas mal de choses, je constate un problème dans ces nouveautés ; un problème récurrent qui me dérange un peu (Beaucoup, passionnément).

## Un monde de dépendances

Un exemple simple : Pour utiliser Stylus (ou Sass, ou Less, etc.), il faut l’installer sur la machine sur laquelle on travaille. Oui, mais comment ? Hé bien il faut d’abord installer [NodeJS](https://nodejs.org/){ target="_blank" rel="noopener" }. Peu importe l’environnement sur lequel je suis (OSX, Windows, Linux), il me faut à présent lancer la console, et taper une commande pour installer Stylus :

```bash
$ npm install -g stylus
```

Et là, on a touché du doigt les deux premiers problèmes que je vois dans cette nouvelle ère.

### Tout est interdépendant

Il n’y a plus rien, ou presque, qui soit _standalone_. Pour utiliser un outil, il faut installer des outils permettant d’installer les outils qui permettent d’installer l’outil qu’on veut utiliser. Outre le fait que ce soit un parcours du combattant au moindre besoin, c’est surtout très pénible. NodeJS permet de faire énormément de choses, notamment de lancer un serveur et de travailler en JS comme langage client (En lieue et place de PHP, par exemple). c’est super cool, d’ailleurs. Mais moi, je n’en ai besoin QUE pour installer des dépendances (Gulp, Bower…) et lancer celles-ci. J’installe donc une petite usine à gaz pour tirer deux manettes. Bon.

### La console, en 2015 ?!

Sérieusement ? Alors certes, ça permet de gagner du temps de développement, car il n’y a pas à développer d’interface. Mais bon dieu, l’informatique a trouvé sa place dans nos foyers parce qu’on a ajouté une interface graphique.

Oui, moi aussi j’aime me la péter un peu devant un néophyte en tapouillant trois lignes qui font des couleurs et défilent du texte en mode hacker d’Hollywood. Mais en vrai, dans la pratique, c’est chiant. En plus de tout ce que je fais déjà, je dois lancer ma console, écrire manuellement le chemin de mon dossier de travail (Et pour peu que j’aie besoin de trois onglets différents, je dois faire ça trois fois), et écrire ma commande. Commande que je dois soit connaître par cœur, soit aller chercher sur la doc.

À titre d’exemple, voilà le "minimum" de code que je tape pour utiliser un task-runner en fonction de mes besoins "simples". Et la commande n’est que le début, après il me faut paramétrer tout le fonctionnement ; même si je peux réutiliser d’anciens modèles.

```bash
$ npm install --save-dev gulp gulp-stylus gulp-concat gulp-uglify gulp-plumber gulp-sourcemaps gulp-imagemin gulp-rename gulp-autoprefixer
```

Pour peu que j’utilise [Pug](http://jade-lang.com/){ target="_blank" rel="noopener" } et [CoffeeScript](http://coffeescript.org/){ target="_blank" rel="noopener" }, il faut ajouter d’autres dépendances. Encore heureux qu’il n’y ai pas trente-six commandes. Mais la console quoi… **En 2015, putain !**

## Mais tout n’est pas centralisé non plus…

Alors les dépendances, c’est une chose. Le problème, c’est que tout n’est pas centralisé non plus. Exemple très simple là aussi : [Composer](https://getcomposer.org/){ target="_blank" rel="noopener" }. Composer permet d’installer des dépendances PHP (comme des Framework, des classes…). Exactement ce que fait [Bower](http://bower.io/){ target="_blank" rel="noopener" }, qui permet d’installer des choses aussi ; mais pas les mêmes choses.

### Des outils identiques pour des éléments différents

Un problème dans l’autre sens, donc : les outils sont dépendants, ont des dépendances, mais ne dépendent pas des mêmes éléments. Ainsi, si je veux utiliser Lumen (Un Framework PHP), il me faut donc Composer. Celui-ci ne passe pas par [NodeJS](https://nodejs.org/en/){ target="_blank" rel="noopener" } (J’ai donc installé un premier outil pour faire "peu" de choses sur tout ce qu’il peut faire, mais il ne peut pas faire autre chose dont j’aurais besoin. Ah.). Composer s’installe donc soit via l’outil Curl (qu’il vous faut donc avoir installé, lui aussi), soit en téléchargement manuel via PHP, soit via un installeur sous Windows. Pour que son installation se déroule correctement, il faut que PHP soit configuré sur ma machine, donc que j’aie un ×AMP (Wamp, Lamp, Mamp, ou autres outils du même genre). J’y reviendrais plus tard…

Donc, une fois que j’ai Composer, il faut que j’installe mes outils (Frameworks, Classes)… Via la console, avec une commande. Mais pas la même qu’avec NodeJS, puisqu’il n’utilise pas ce dernier — vous suivez ? Hop, deux docs ouvertes, et d’autres commandes à retenir.

```bash
$ curl -sS https://getcomposer.org/installer | php
$ mv composer.phar /usr/local/bin/composer

$ composer require slim/slim
```

Bon, c’est bien, ça marche. Mais je voudrais aussi utiliser jQuery et Bootstrap… Ah, mais pour ceux-là il faut Bower ! Bien, donc j’installe aussi Bower, un outil qui sert à installer des dépendances. Comme Composer. Comme NodeJS, aussi. Donc **j’installe des installeurs de dépendances**. Oui, oui. Bien sûr, Bower a ses propres commandes pour installer ses dépendances, sinon ce ne serait pas drôle. Hop, trois docs ouvertes.

## Mes dossiers sont sales !

Je suis maniaque. J’aime que mes dossiers soient propres, rangés, bien nommés ; que mes projets soient bien ordonnés. Avec NodeJS, j’installe des dossiers de diverses saloperies dans chacun de mes projets (Que je dois réinstaller à chaque projet, toujours à la ligne de commande). autant de dossiers lourds, que je peux certes cacher par la suite. **Composer va me faire un dossier supplémentaire pour ajouter son merdier**. Grmbl. Et la cerise, c’est Bower, qui non content d’ajouter son bazar, est très peu rigoureux sur la forme : chaque dépendance clone un _repository_ entier, avec** tout ce qui ne m’intéresse à priori pas** (gulpfile, gruntfiles, de quoi installer les dépendances de ma dépendance (Argh !), des fichiers de démo, des docs, une licence, un _readme_…). De plus, comme chacun fait un peu ce qu’il veut, il est quasi impossible d’automatiser une tâche pour chaque dépendance afin de récupérer le ou les fichiers qui nous intéressent au milieu du fourbi, parce que l’auteur est libre de mettre lesdits fichiers où il le veut, avec l’arborescence qui lui sied. Donc en plus d’avoir du merdier, j’ai encore du travail.

Et surtout, **j’ai pourri mon PC/Mac avec une tonne de logiciels** qui ne me servent qu’à installer des logiciels. Et j’ai horreur de ça.

## Encore plus au fond

Allons encore plus loin dans le problème : je parlais plus haut des outils pour émuler un serveur de façon locale (Wamp, Lamp, Mamp et consorts). Oui, mais ça c’est fini ! Aujourd’hui, on utilise [Vagrant](http://www.vagrantup.com){ target="_blank" rel="noopener" }, et on crée une machine virtuelle par projet (ou presque).

Alors ne nous méprenons pas : Vagrant est un outil intéressant, qui apporte des réponses à des problèmes de dev courants.

Le problème, c’est que pour faire fonctionner Vagrant, il nous faut aussi un autre outil : [VirtualBox](https://www.virtualbox.org/){ target="_blank" rel="noopener" }. En gros, Vagrant ne sert qu’à créer des mini-machine virtuelles, paramétrées selon nos besoins du moment ; mais il lui faut donc de quoi lancer les machines virtuelles, donc un outil de virtualisation, et un OS à installer (Très souvent une distribution Linux, ce qui n’est déjà pas simple à gérer de base, mais là croyez-moi c’est du grand art).

Outre le fait que la procédure est longue et pas toujours bien renseignée en fonction de ce qu’on cherche, tout est toujours en ligne de commande :

```bash
$ vagrant init hashicorp/precise32
$ vagrant up
```

Mais surtout, pour utiliser pleinement les outils de Vagrant, il va falloir installer des dépendances pour ce dernier. Avec ses propres commandes. Hop, une doc de plus. Donc, pour installer des dépendances à Vagrant, il faut… Installer une dépendance, qui va installer les dépendances. Et allez ! On se tourne donc vers Chef, on lance une commande Vagrant, et on l’installe. Et ça marche… Jusqu’à ce qu’on veuille installer des dépendances ; là, il faut installer ChefDK, un ensemble de classes pour Chef, cette fois via git ou un installer Windows (qui ne demande pas dans quel dossier s’installer et se fout à la racine du disque C:/. Pour la petite histoire, cette faute lui a vallu une désinstallation immédiate de ma bécane, et je n’ai donc toujours pas de VagrantBox sur mon PC).

## Et c’est pas fini !

Ajoutons à tout ça qu’il nous faut généralement aussi installer et configurer git, qui s’utilise — mais vous le savez déjà ou l’avez deviné — en ligne de commandes. Et celles-ci, elles sont velues en plus. Même chez les plus chevronnés de l’outil, certains problèmes qui se posent parce que Jean-Bertrand a _commit_ sur la branche de préprod’ que Jeanne-Syvlie était en train de _merge_ alors que François-Eugène faisait un _checkout_, et on est parti pour deux heures à fouiller dans la doc, essayer toutes les commandes existantes, et bloquer le taff de tout le monde.

```bash
$ git stash create "Stash message"
$ git pull --rebase
$ git stash clear
$ git commit -m "Commit message"
$ git push
```

En sus, on ajoute à ça un petit accès SSH, le besoin de gérer des clés pour tout le monde…

Et surtout, il faut que tout ce merdier soit actif en permanence pour pouvoir bosser. Je ne peux plus faire une petite retouche rapide en ouvrant l’ordi avec un sandwiche dans le bec, profitant d’une borne Wifi : il faut lancer l’IDE (c’est souvent lourd), lancer le serveur local, ouvrir la console, taper le chemin vers le dossier, lancer une commande, faire ma modification, enregistrer, vérifier qu’elle est prise en compte lancer une commande pour envoyer ma modif. Et ça, c’est la version "facile", pour peu qu’il faille se connecter à un VPN et gérer les _commits_ dans un Tracker un peu mal foutu ([Gerrit](https://code.google.com/p/gerrit/){ target="_blank" rel="noopener" }, par exemple), il faut en plus aller sur un site, s’y connecter et valider sa modif' manuellement. Évidemment, je n’en parle pas, mais 15 outils qui tournent en permanence pour en faire fonctionner deux, ce n’est pas économe.

## Des possibilités futures ?

Alors oui, on a gagné beaucoup de choses, comme je le disais en introduction. Et tous les outils que je viens de critiquer ont un très bon propos : apporter une solution à un problème. Et généralement, ils le font bien. Mais on a aussi entassé une surcharge de merdes inutiles : on télécharge 80 fichiers pour 6 qui nous intéressent réellement, on installe 15 logiciels pour utiliser trois outils, et on utiliser des outils archaïques pour ce faire.

Et **c’est pour ça que j’espère, de tout mon cœur, qu’une solution va être trouvée** à ce merdier. Il y a déjà certaines applications qui essaient de faciliter le travail : par exemple, [CodeKit](https://incident57.com/codekit/){ target="_blank" rel="noopener" }, qui sert de task-runner, compilant différents langages et effectuant diverses opérations, le tout avec une interface graphique. Une bonne idée ; malheureusement l’outil n’est disponible que sur OSX d’une part, et n’est pas très fiable à l’utilisation d’autre part… Comme la plupart des outils du genre que j’ai pu tester ([Simpless](http://wearekiss.com/simpless){ target="_blank" rel="noopener" }, [Koala](http://koala-app.com/){ target="_blank" rel="noopener" }, et je ne me souviens pas des autres), il trouve vite ses limites en terme de configuration, de portabilité, de réactivité, et de fiabilité. Et même si ces applications doivent elles aussi tourner en permanence en tâche de fond lorsqu’on bosse, elles ont au moins le bon goût de ne pas installer quinze dossiers de dépendances dans mes projets. Malheureusement au prix d’une portabilité entre collaborateurs relativement pauvre, qui oblige très souvent à configurer chacun son poste à chaque projet, voire à reconfigurer à chaque fois que quelqu’un _commit_ (j’ai eu le soucis).

Côté Git, il y a [pas mal de clients graphiques](https://git-scm.com/download/gui/linux){ target="_blank" rel="noopener" }, dont mon préféré, [SourceTree](https://www.sourcetreeapp.com/){ target="_blank" rel="noopener" }. Néanmoins, on se retrouve ici aussi avec un lot de problèmes : traductions approximative, labellisation de tâches qui n’ont rien à voir avec les noms des commandes…

### Tout n’est pas cirrhose (Comme disait l’alcoolique)

Ne nous méprenons pas, je ne crache pas sur tous ces outils par simple frustration de ne pas m’en sortir avec (Même qu’à part Vagrant (qu’on m’a conseillé à l’instant de délaisser pour [Docker](https://www.docker.com/){ target="_blank" rel="noopener" }), je m’en sors pas mal !). Je pense que ces outils répondent à des besoins, qu’ils améliorent notre travail ; mais je pense aussi qu’on peut faire mieux.

Pour revenir sur l’exemple de la console, pas mal de développeurs adorent cet outil. Pour autant, je pense **qu’il pourrait être largement amélioré**. Pourquoi pas un explorateur de fichiers intégré, qui permette de cibler rapidement son dossier, de lancer des commandes (Relatives au projet et/ou aux possibilités du fichier) via un simple clic droit ? Ou inversement, un explorateur de fichiers avec console intégré, qui fasse tout ça aussi ?

De la même façon, Git (et les autres outils de _versionning_) sont d’une importance capitale, les vieilles méthodes via FTP étant absolument intenables en cas de travail à plusieurs (modifications écrasées, etc.). Pour autant, l’outil en question est suffisamment complexe pour générer à son tour de nouveaux problèmes et de nouveaux besoins, auxquels on répond par de nouveaux outils supplémentaires…

### Que voulons-nous ?

Je ne sais pas pour vous, mais moi, je veux un outil pour les gérer tous. Je veux un (ou plusieurs, mais qu’ils fassent tous ça) gestionnaire de dépendance centralisé, qui me permette d’installer du PHP aussi bien que du Javascript si ça me chante, sans avoir à passer par cinquante tiers ni intermédiaires. Je veux que les dépendances que j’utilise n’aient pas besoin de faire cinquante dossiers et de télécharger trouzmille fichiers par projets. Je veux ne pas avoir à passer deux heures à paramétrer manuellement des tâches automatiques, à chaque projet. Je veux me concentrer sur mon boulot, comme un guitariste de rock se concentre sur son jeu et sur la musique, pendant que le roadie et les techs gèrent ce qu’il y a à gérer (en l’occurrence, que le logiciel soit le roadie et le tech, et que je n’aie pas besoin d’un sysadmin à chaque fois que je veux un outil).

Pas vous ?
