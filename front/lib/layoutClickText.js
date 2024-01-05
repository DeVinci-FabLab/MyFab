export function getTextForClick(currentClicked) {
  if (currentClicked < 2) return [];
  if (currentClicked < 4) {
    return [
      {
        type: "success",
        text: "Vous êtes déjà sur cette page",
        options: {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      },
    ];
  }
  if (currentClicked < 7) {
    return [
      {
        type: "warn",
        text: "Tu peux arrêter s'il te plaît",
        options: {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      },
    ];
  }

  const nombreAleatoire = Math.floor(Math.random() * 6);
  switch (nombreAleatoire) {
    case 0:
      return [
        {
          type: "error",
          text: "Ca t'arrive de faire autre chose ?",
          options: {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
      ];

    case 1:
      return [
        {
          type: "warn",
          text: "Haha très drôle, on a bien rit",
          options: {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
      ];

    case 2:
      return [
        {
          type: "success",
          text: "Quel est la différence entre un robot et une sauce pour les pâtes",
          options: {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
        { type: "wait", time: 5000 },
        {
          type: "success",
          text: "Aucune, ils sont tous les deux automates/aux tomates",
          options: {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
      ];

    case 3:
      const result = [
        {
          type: "warn",
          text: "Moi aussi je sais faire ca",
          options: {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
        { type: "wait", time: 2000 },
      ];

      function addToast(text) {
        return {
          type: "success",
          text: text,
          options: {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        };
      }

      for (let index = 0; index < 8; index++) {
        switch (index) {
          case 0:
            result.push(addToast("Frère"));
            break;
          case 1:
            result.push(addToast("Jaques"));
            break;
          case 2:
            result.push(addToast("Frère"));
            break;
          case 3:
            result.push(addToast("Jaques"));
            break;
          case 4:
            result.push(addToast("Arrête"));
            break;
          case 5:
            result.push(addToast("ca"));
            break;
          case 6:
            result.push(addToast("Arrête"));
            break;
          case 7:
            result.push(addToast("ca"));
            break;

          default:
            break;
        }
        result.push({ type: "wait", time: 750 });
      }
      return result;

    case 4:
      return [
        {
          type: "warn",
          text: "Il faut faire un autre truc maintenant",
          options: {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
      ];

    default:
      return [
        {
          type: "error",
          text: "...",
          options: {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        },
      ];
  }
}
