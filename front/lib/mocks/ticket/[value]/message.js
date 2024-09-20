export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  switch (id) {
    case "1":
      return {
        status: 200,
        data: [
          {
            userName: "Etudiant 1",
            content:
              "Est-ce que vous pouvez m’imprimer cette pièce ? Il s’agit d’un composant dont j’ai besoin pour un projet sur lequel je travaille en ce moment. Voici quelques détails qui pourront vous être utiles pour mieux comprendre l’importance de cette pièce et pourquoi je souhaite qu’elle soit imprimée. Cette pièce fait partie d’un ensemble mécanique qui doit être non seulement robuste, mais aussi extrêmement précis. Elle doit s'intégrer parfaitement dans un mécanisme plus large, qui est conçu pour des applications nécessitant un mouvement fluide et une résistance importante aux forces extérieures. Toute erreur dans la dimension ou l’alignement pourrait compromettre le bon fonctionnement de l’ensemble, c’est pourquoi la précision de l’impression est primordiale. Concernant le matériau, je privilégierais quelque chose de durable et résistant aux chocs, tout en restant léger. Il faut aussi tenir compte de la température à laquelle la pièce sera soumise, car elle devra fonctionner dans des environnements où la chaleur peut devenir un facteur critique. Par conséquent, un matériau capable de résister à des températures élevées serait un atout. En ce qui concerne les dimensions, je vous ai fourni le modèle 3D exact qui décrit la géométrie de la pièce. Les tolérances doivent être très fines pour éviter tout jeu ou frottement excessif une fois la pièce montée.",
            creationDate: "2023-06-21T10:49:06.000Z",
          },
          {
            userName: "Agent 1",
            content: "Oui bien sûr",
            creationDate: "2023-06-18T08:00:24.000Z",
          },
          {
            userName: "Etudiant 1",
            content: "Parfait, merci",
            creationDate: "2023-06-21T10:50:09.000Z",
          },
        ],
      };

    default:
      return { error: true };
  }
}
