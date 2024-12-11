import { fetchAPIAuth, parseCookies } from "../lib/api";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Dialog, DialogPanel } from "@headlessui/react";
import sha256 from "sha256";

import { UserUse } from "../context/provider";

const FallingEmojis = ({ children }) => {
  const [emojiList, setEmojiList] = useState([]);
  const [score, setScore] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [showCodyHelmet, setShowCodyHelmet] = useState(false);
  
  const jwt = getCookie("jwt");
  const { roles, darkMode } = UserUse(jwt);

  let type = null;
  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth();

  useEffect(() => {
    setScore(0);
    setShowCodyHelmet(true);
    document.body.style.overflow = "hidden";
    const animateEmojis = () => {
      setEmojiList(
        (prev) =>
          prev
            .map((emoji) => {
              // Assurez-vous que `t` commence à 0 lors de la création de l'emoji.
              const newX =
                emoji.initialx + emoji.direction * emoji.t * emoji.distanceX;
              const newY =
                Math.pow(emoji.t, emoji.speed) +
                emoji.t * emoji.verticalJump * -1 +
                emoji.initialy;
                
              return {
                ...emoji,
                x: newX,
                y: newY,
                rotation: emoji.rotation + emoji.rotationSpeed,
                t: emoji.t + 1, // Incrémentation de t
              };
            })
            .filter((emoji) => emoji.y < window.innerHeight * 2 && emoji.t < 50 && emoji.x > -200 && emoji.x < window.innerWidth + 200), // Limites de y
      );
    };

    const interval = setInterval(animateEmojis, 100);
    return () => clearInterval(interval);
  }, []);

  if (
    (process.env.IS_TEST_MODE === "true" && jwt === "1410") ||
    (process.env.IS_TEST_MODE !== "true" &&
      roles.length !== 0 &&
      date === 14 &&
      month == 9)
  )
    type = "1410"; //Activation le 14 octobre

  if (
    (process.env.IS_TEST_MODE === "true" && jwt === "1212") ||
    (process.env.IS_TEST_MODE !== "true" &&
      roles.length !== 0 &&
      date === 11 &&
      month == 11)
  )
    type = "1212"; //Activation le 12 decembre

  let images = [];
  switch (type) {
    case "1410":
      images = [
        "/icon/alpaga/alpaga1.png",
        "/icon/alpaga/alpaga2.png",
        "/icon/alpaga/alpaga3.png",
        "/icon/alpaga/alpaga4.png",
        "/icon/alpaga/alpaga5.png",
        "/icon/alpaga/alpaga6.png",
      ];
      return onclickEmoji({ images, emojiList, children, setEmojiList })

    case "1212":
        return codyChallenge({ emojiList, children, setEmojiList, score, setScore, openMenu, setOpenMenu, showCodyHelmet, setShowCodyHelmet, darkMode })

    default:
      return <div>{children}</div>;
  }

  
};

function onclickEmoji({ images, emojiList, children, setEmojiList }){
  const handleClick = (event, images) => {
    const size = Math.random() * (200 - 50) + 100;
    const newEmoji = {
      image: images[Math.floor(Math.random() * images.length)],
      id: Date.now() + Math.random(),
      initialx: event.clientX - size / 2,
      initialy: event.clientY - size / 2,
      x: event.clientX - size / 2,
      y: event.clientY - size / 2,
      rotation: Math.random() * 200 - 100,
      size,
      t: 0,
      direction: Math.random() < 0.5 ? -1 : 1,
      animationDuration: 2000,
      distanceX: Math.random() * 100,
      verticalJump: Math.random() * (100 - 20) + 20,
      speed: Math.random() * (4 - 2) + 2,
      rotationSpeed: Math.random() * 200 - 100,
    };
    setEmojiList((prev) => [...prev, newEmoji]);

    setTimeout(() => {
      newEmoji.x =
        newEmoji.initialx +
        newEmoji.direction * newEmoji.t * newEmoji.distanceX;
      newEmoji.y =
        Math.pow(newEmoji.t, newEmoji.speed) +
        newEmoji.t * newEmoji.verticalJump * -1 +
        newEmoji.initialy;
      newEmoji.t = 1;
    }, 1);
  };

  return (
    <div
      onClick={(e) => {
        handleClick(e, images);
      }}
      className="relative w-full h-screen overflow-hidden"
    >
      {emojiList.map(({ image, x, y, rotation, size, id }) => (
        <div
          key={id}
          className="absolute z-10 select-none"
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
            width: `${size}px`, // Appliquer la taille aléatoire
            height: `${size}px`, // Appliquer la taille aléatoire
            transition: "transform 0.11s linear",
          }}
        >
          <img src={image}></img>
        </div>
      ))}
      {children}
    </div>
  );
}

function codyChallenge({ emojiList, children, setEmojiList, score, setScore, openMenu, setOpenMenu, showCodyHelmet, setShowCodyHelmet, darkMode }) {
  const handleClick = (event) => {
    if(event?.target?.src?.endsWith("JarJar.jpg")) {
      setScore(score + 10);
    } else {
      setScore(score + 1);
    }
    
    event.target.src = "";
  };

  function sendScore(){
    const cookie = getCookie("jwt");
      
    fetchAPIAuth({
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        dvflCookie: cookie,
      },
      url:
        process.env.API +
        "/api/codyChallenge",
      data: {
        score: score,
        key: calculateKey(cookie, score)
      },
    });
  }

  function calculateKey(jwt, score) {
    const string = `${jwt}${score}${jwt}`;
    return sha256(string);
  }


  const startGame = () => {
    setShowCodyHelmet(false);
    setOpenMenu(false);
    setScore(1);
  
    let tic = 0;
    const interval = setInterval(() => {
      function animate_emoji(newEmoji){
        setEmojiList((prev) => [...prev, newEmoji]);

        setTimeout(() => {
          newEmoji.x =
            newEmoji.initialx +
            newEmoji.direction * newEmoji.t * newEmoji.distanceX;
          newEmoji.y =
            Math.pow(newEmoji.t, newEmoji.speed) +
            newEmoji.t * newEmoji.verticalJump * -1 +
            newEmoji.initialy;
          newEmoji.t = 1;
        }, 1);
      }

      function get_gonk(){
        const direction = Math.random() < 0.5 ? -1 : 1;
        const size = Math.random() * (200 - 50) + 100;
        const initialx = direction == 1 ? -100 : screen.width + 100;
        const initialy = Math.floor(Math.random() * (screen.height - (screen.height / 2)) + (screen.height / 2));
        const newEmoji = {
          image: "/icon/codyChallenge/gonk.png",
          id: Date.now() + Math.random(),
          initialx: initialx - size / 2,
          initialy: initialy - size / 2,
          x: initialx - size / 2,
          y: initialy - size / 2,
          rotation: Math.random() * 200 - 100,
          size,
          t: 0,
          direction: direction, //Math.random() < 0.5 ? -1 : 1,
          mirror: Math.random() < 0.5 ? -1 : 1,
          animationDuration: 2000,
          distanceX: Math.random() * (60 - 20) + 20,
          verticalJump: Math.random() * (40 - 20) + 20,
          speed: Math.random() * 2,// Pour JarJar (4 - 2) + 2
          rotationSpeed: Math.random() * 100 - 50,
        };

        return newEmoji;
      }

      function get_jarjar(){
        const direction = Math.random() < 0.5 ? -1 : 1;
        const size = 100;
        const initialx = direction == 1 ? -100 : screen.width + 100;
        const initialy = screen.height / 2;
        const newEmoji = {
          image: "/icon/codyChallenge/JarJar.jpg",
          id: Date.now() + Math.random(),
          initialx: initialx - size / 2,
          initialy: initialy - size / 2,
          x: initialx - size / 2,
          y: initialy - size / 2,
          rotation: Math.random() * 200 - 100,
          size,
          t: 0,
          direction: direction, //Math.random() < 0.5 ? -1 : 1,
          mirror: Math.random() < 0.5 ? -1 : 1,
          animationDuration: 2000,
          distanceX: 200,
          verticalJump: 50,
          speed: 3,// Pour JarJar (4 - 2) + 2
          rotationSpeed: Math.random() * 200 - 100,
        };

        return newEmoji;
      }

      if ((tic % 8 == 0 || (tic > 200 && tic % 6 == 0) || (tic > 400 && tic % 5 == 0)) && tic < 600) {
        const newEmoji = get_gonk();
        animate_emoji(newEmoji);
      }
      if (tic == 300) {
        const newEmoji = get_jarjar();
        animate_emoji(newEmoji);
      }

      if (tic > 650) {
        clearInterval(interval);
        setOpenMenu(true);
      }

      tic++;
    }, 100);
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
    >
      {emojiList.map(({ image, x, y, rotation, size, mirror, id }) => (
        <div
          onClick={(e) => {
            handleClick(e);
          }}
          key={id}
          className="absolute z-10 select-none cursor-pointer"
          style={{
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scaleX(${mirror})`,
            width: `${size}px`, // Appliquer la taille aléatoire
            height: `${size}px`, // Appliquer la taille aléatoire
            transition: "transform 0.2s linear",
          }}
        >
          <img src={image} onDragStart={(e) => {
            handleClick(e);
          }} onDrop={(e) => {
            handleClick(e);
          }}></img>
        </div>
      ))}

      { showCodyHelmet ? <div
          onClick={(e) => {
            setOpenMenu(true);
          }}
          key="helmet"
          className="absolute z-10 select-none cursor-pointer hidden lg:block"
          style={{
            transform: `translate(-10px, -50px) rotate(135deg)`,
            width: `150px`,
            height: `150px`
          }}
        >
          <img src={"/icon/codyChallenge/CodyButton.png"} onDragStart={(e) => {
            handleClick(e);
          }} onDrop={(e) => {
            handleClick(e);
          }}></img>
        </div> : ""}

      { openMenu ? (
      <Dialog
        open={openMenu}
        as="div"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClose={() => {
          if(score!=0){
            sendScore();
          }
          setOpenMenu(false);
          setShowCodyHelmet(true);
          setScore(0);
        }}
      >
        <DialogPanel
          transition
          className={`w-full max-w-md rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[500px] sm:w-full sm:p-6 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          { score === 0 ? (<div>
            <div className="flex items-center justify-center">
              <h1
                className={`text-3xl font-bold pb-6 ${
                  darkMode ? "text-gray-200" : ""
                }`}
              >
                Le défi de Cody
              </h1>
            </div>
            <div className="flex items-center justify-center sm:flex sm:items-start pb-3">
              <div className={`text-lg leading-6 font-medium`}>
                <p className={`text-justify ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  Salutations, individu qui fait des tickets ou qui a vu sur discord qu'il y a un mini-jeu aujourd'hui sur MyFab.
                </p>
                <p className={`pt-2 text-justify ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  Le but de ce mini jeu est de détruire les droïdes GONK en cliquant dessus en 60 secondes. Voilà fin des règles.
                </p>
                <p className={`pt-2 text-justify ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                Ah, aussi, il ne s'agit pas d'une compétition, mais il y aura un classement en fin de journée.
                </p>
                <p className={`pt-2 text-justify text-xs ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  * Le classement est envoyé manuellement donc il ne sera pas envoyé quand je dors ou que je suis au taf, donc calmos !
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className={`approve-button back-button mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm sm:col-span-2 ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200 hover:text-gray-300"
                    : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 hover:text-gray-500"
                }`}
                onClick={() => startGame()}
              >
                Démarrer
              </button>
            </div>
          </div>) : (<div>
            <div className="flex items-center justify-center">
              <h1
                className={`text-3xl font-bold pb-6 ${
                  darkMode ? "text-gray-200" : ""
                }`}
              >
                Partie terminée
              </h1>
            </div>
            <div className="flex items-center justify-center sm:flex sm:items-start pb-10">
              <div className={`text-lg leading-6 font-medium`}>
                <p className={`text-justify ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  Ton score final est de { score }.
                </p>
                <p className={`text-justify ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  Merci d'avoir joué.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className={`approve-button back-button mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm sm:col-span-2 ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200 hover:text-gray-300"
                    : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 hover:text-gray-500"
                }`}
                onClick={() => {                  
                  if(score!=0){
                    sendScore();
                  }
                  setOpenMenu(false);
                  setShowCodyHelmet(true);
                  setScore(0);
                }}
              >
                Fermer
              </button>
            </div>
          </div>)}
        </DialogPanel>
      </Dialog>
      ) : ""}
      {children}
    </div>
  );
}

export default FallingEmojis;
