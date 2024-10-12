import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import { UserUse } from "../context/provider";

const FallingEmojis = ({ children }) => {
  const [emojiList, setEmojiList] = useState([]);

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

  useEffect(() => {
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
            .filter((emoji) => emoji.y < window.innerHeight * 2), // Limites de y
      );
    };

    const interval = setInterval(animateEmojis, 100);
    return () => clearInterval(interval);
  }, []);

  const jwt = getCookie("jwt");
  const { roles } = UserUse(jwt);

  let type = null;
  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth();

  if (
    (process.env.IS_TEST_MODE === "true" && jwt === "1410") ||
    (process.env.IS_TEST_MODE !== "true" &&
      roles.length !== 0 &&
      date === 14 &&
      month == 9)
  )
    type = "1410"; //Activation le 14 octobre

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
      break;

    default:
      return <div>{children}</div>;
  }

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
            transition: "transform 0.1s linear",
          }}
        >
          <img src={image}></img>
        </div>
      ))}
      {children}
    </div>
  );
};

export default FallingEmojis;
