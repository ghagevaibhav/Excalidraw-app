"use client"

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";


export default function Home() {

  const [roomId, setRoomId] = useState("");
  const router = useRouter()

  return (
    <div className={styles.page}>
      <input 
        type="text" 
        placeholder="Room Id" 
        value={roomId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRoomId(e.target.value); }}
      />

      <button onClick={() => {
        router.push(`/room/${roomId}`)
      }}>Join Room</button>
    </div>
  );
}
